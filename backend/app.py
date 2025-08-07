from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
import shutil
import os
import zipfile
import time
import json
from typing import List, Dict, Any, Optional
import re
import logging

# Import our project generator, template controller, and projects controller
from project_generator import ProjectGenerator
from template_controller import TemplateController
from projects_controller import ProjectsController, router as projects_router
from auth_api import router as auth_router
from mmry_workflow_service import mmry_workflow_service

# Set up logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Squadbox API", description="API for the Squadbox AI Webapp Builder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store generated projects
PROJECTS_DIR = "generated_projects"
os.makedirs(PROJECTS_DIR, exist_ok=True)

# Initialize project generator
# You can directly set the API key here if you prefer not to use environment variables
# For example: api_key = "your_openai_api_key_here"
api_key = None  # Set this to your API key if you don't want to use .env file
api_key_path = None  # Or set this to the path of a file containing your API key

# Initialize the project generator with the chosen API key approach
project_generator = ProjectGenerator(
    projects_dir=PROJECTS_DIR,
    api_key=api_key,
    api_key_path=api_key_path
)

# Set up template controller
template_controller = TemplateController(project_generator.template_manager)
app.include_router(template_controller.router)

# Set up projects router
app.include_router(projects_router)

# Set up authentication router
app.include_router(auth_router)

SAFE_FILENAME = re.compile(r'^[\w\-\.]+$')
SAFE_PROJECT_ID = re.compile(r'^\d+$')

def is_safe_project_id(project_id):
    return SAFE_PROJECT_ID.match(project_id)

def is_safe_filename(filename):
    return SAFE_FILENAME.match(filename)

def execute_build_task(project_id: str):
    """Background task to execute project build"""
    project_generator.execute_build(project_id)


@app.post("/generate-project/")
async def generate_project(background_tasks: BackgroundTasks, 
                         requirements: List[str] = Form(...),
                         project_type: str = Form("web"),
                         template_id: Optional[str] = Form(None),
                         project_name: str = Form("My Project")):
    """
    Accepts requirements and initiates an AI-powered project build process
    
    Args:
        background_tasks: FastAPI BackgroundTasks
        requirements: List of project requirements as strings
        project_type: Type of project to generate (web, api, mobile, etc.)
        template_id: Optional template to use as starting point
        project_name: Name of the project
    """
    # Start project build
    result = project_generator.start_build(
        project_name=project_name,
        requirements=requirements,
        template_id=template_id,
        project_type=project_type
    )
    
    project_id = result["project_id"]
    
    # Start background task for building
    background_tasks.add_task(execute_build_task, project_id)
    
    return {"project_id": project_id, "zip_file": f"/download/{project_id}.zip"}

@app.get("/logs/{project_id}")
def get_logs(project_id: str):
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    log_path = os.path.join(PROJECTS_DIR, project_id, "build.log")
    if not os.path.exists(log_path):
        raise HTTPException(status_code=404, detail="Log not found")
    with open(log_path, "r") as f:
        content = f.read()
    return PlainTextResponse(content)

@app.get("/build-status/{project_id}")
def get_build_status(project_id: str):
    """Get the current build status for a project"""
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    
    # Check if project exists
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get detailed status from project generator
    status_data = project_generator.get_build_status(project_id)
    
    # Calculate progress percentage
    progress = 0
    if status_data["status"] == "initializing":
        progress = 10
    elif status_data["status"] == "generating":
        progress = 50
    elif status_data["status"] == "complete":
        progress = 100
    elif status_data["status"] == "failed":
        progress = 100  # Even if failed, process is complete
    
    # Add progress to status data
    status_data["progress"] = progress
    status_data["timestamp"] = time.time()
    
    return status_data

# Template endpoints are now handled by TemplateController

@app.get("/download/{zip_name}")
def download_zip(zip_name: str):
    if not is_safe_filename(zip_name):
        raise HTTPException(status_code=400, detail="Invalid zip filename")
    zip_path = os.path.join(PROJECTS_DIR, zip_name)
    if os.path.exists(zip_path):
        return FileResponse(zip_path, filename=zip_name)
    return JSONResponse({"error": "Not found"}, status_code=404)

@app.delete("/cleanup/{project_id}")
def cleanup_project(project_id: str):
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    project_path = os.path.join(PROJECTS_DIR, project_id)
    zip_path = os.path.join(PROJECTS_DIR, f"{project_id}.zip")
    # Remove project directory
    if os.path.exists(project_path):
        shutil.rmtree(project_path)
    # Remove zip file
    if os.path.exists(zip_path):
        os.remove(zip_path)
    return {"status": "cleaned"}

# Serve generated zips statically
app.mount("/generated_projects", StaticFiles(directory=PROJECTS_DIR), name="generated_projects")

# MMRY Storage and Retrieval Endpoints
@app.get("/mmry/user-stats/{user_id}")
def get_user_storage_stats(user_id: str):
    """Get MMRY storage statistics for a user"""
    try:
        stats = mmry_workflow_service.get_user_storage_stats(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user stats: {str(e)}")

@app.get("/mmry/retrieve/{user_id}/{project_id}")
def retrieve_project_files(user_id: str, project_id: str):
    """Retrieve project files from MMRY storage"""
    try:
        files = mmry_workflow_service.retrieve_project_files(user_id, project_id)
        return files
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving files: {str(e)}")

@app.get("/mmry/system-stats")
def get_mmry_system_stats():
    """Get overall MMRY system statistics"""
    try:
        stats = mmry_workflow_service.get_system_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system stats: {str(e)}")

@app.post("/feedback")
async def submit_feedback(feedback: dict):
    """Submit user feedback"""
    try:
        # Store feedback in database
        # For now, just log it and send email
        print(f"Feedback received: {feedback}")
        
        # TODO: Implement email sending to hello@squadbox.uk
        # TODO: Store in database
        
        return {"success": True, "message": "Feedback submitted successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

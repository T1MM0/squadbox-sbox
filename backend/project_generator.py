#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: project_generator.py
# Description: Main project generation orchestrator for Squadbox
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import json
import logging
import time
import shutil
from typing import List, Dict, Any, Optional
import zipfile

from ai_generator import AICodeGenerator
from template_manager import TemplateManager
from mmry_workflow_service import mmry_workflow_service

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ProjectGenerator:
    """
    Main orchestrator for project generation
    Combines template-based generation with AI-powered code generation
    """
    def __init__(self, projects_dir: str = "generated_projects", api_key: str = None, api_key_path: str = None):
        """
        Initialize with projects directory and optional API key options
        
        Args:
            projects_dir: Directory to store generated projects
            api_key: Direct API key for LLM provider (highest priority)
            api_key_path: Path to file containing API key (medium priority)
        """
        self.projects_dir = projects_dir
        self.template_manager = TemplateManager()
        
        # Use provided API key or path, or get from environment if available
        if not api_key and not api_key_path:
            api_key = os.environ.get("OPENAI_API_KEY")
            api_key_path = os.environ.get("OPENAI_API_KEY_PATH")
        
        # Determine which LLM provider to use
        provider_type = os.environ.get("LLM_PROVIDER")
            
        self.ai_generator = AICodeGenerator(api_key=api_key, api_key_path=api_key_path, provider_type=provider_type)
        
        os.makedirs(projects_dir, exist_ok=True)
    
    def create_project_id(self) -> str:
        """Generate a new project ID"""
        existing_projects = [d for d in os.listdir(self.projects_dir) 
                           if os.path.isdir(os.path.join(self.projects_dir, d))]
        
        # Find numeric directories and get the next ID
        numeric_dirs = [int(d) for d in existing_projects if d.isdigit()]
        next_id = str(max(numeric_dirs) + 1 if numeric_dirs else 0)
        
        return next_id
    
    def start_build(self, 
                   project_name: str, 
                   requirements: List[str], 
                   template_id: str = None,
                   project_type: str = "web") -> Dict[str, Any]:
        """
        Start a new project build
        
        Args:
            project_name: Name of the project
            requirements: List of requirements
            template_id: Optional template ID to use as base
            project_type: Type of project (web, api, mobile, etc.)
            
        Returns:
            Dict with project_id and status
        """
        project_id = self.create_project_id()
        project_path = os.path.join(self.projects_dir, project_id)
        os.makedirs(project_path, exist_ok=True)
        
        # Initialize build log
        log_path = os.path.join(project_path, "build.log")
        with open(log_path, "w") as logf:
            logf.write(f"Build started at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            logf.write(f"Project name: {project_name}\n")
            logf.write(f"Project type: {project_type}\n")
            logf.write("Requirements:\n")
            for req in requirements:
                logf.write(f"- {req}\n")
            
            if template_id:
                logf.write(f"\nUsing template: {template_id}\n")
        
        # Start build in a way that can be monitored
        self._initialize_build_manifest(project_id, project_name, requirements, template_id, project_type)
        
        return {
            "project_id": project_id,
            "status": "initializing"
        }
    
    def _initialize_build_manifest(self, project_id: str, project_name: str, 
                                 requirements: List[str], template_id: str = None,
                                 project_type: str = "web"):
        """Initialize the build manifest file to track progress"""
        manifest = {
            "project_id": project_id,
            "project_name": project_name,
            "requirements": requirements,
            "template_id": template_id,
            "project_type": project_type,
            "status": "initializing",
            "start_time": time.time(),
            "end_time": None,
            "files_generated": [],
            "errors": []
        }
        
        manifest_path = os.path.join(self.projects_dir, project_id, "build_manifest.json")
        with open(manifest_path, "w") as f:
            json.dump(manifest, f, indent=2)
    
    def execute_build(self, project_id: str) -> Dict[str, Any]:
        """
        Execute the build process for a project
        
        Args:
            project_id: ID of the project to build
            
        Returns:
            Dict with build status
        """
        project_path = os.path.join(self.projects_dir, project_id)
        log_path = os.path.join(project_path, "build.log")
        manifest_path = os.path.join(project_path, "build_manifest.json")
        
        try:
            # Load manifest
            with open(manifest_path, "r") as f:
                manifest = json.load(f)
            
            # Update status
            manifest["status"] = "generating"
            with open(manifest_path, "w") as f:
                json.dump(manifest, f, indent=2)
            
            # Apply template if specified
            if manifest.get("template_id"):
                with open(log_path, "a") as logf:
                    logf.write(f"\nApplying template {manifest['template_id']}...\n")
                
                template_result = self.template_manager.apply_template(
                    manifest["template_id"],
                    project_path,
                    manifest["project_name"],
                    manifest["requirements"]
                )
                
                if template_result["status"] == "success":
                    with open(log_path, "a") as logf:
                        logf.write("Template applied successfully.\n")
                        logf.write(f"Generated {len(template_result['files'])} files from template.\n")
                    
                    manifest["files_generated"].extend(
                        [os.path.relpath(f, project_path) for f in template_result["files"]]
                    )
                else:
                    with open(log_path, "a") as logf:
                        logf.write(f"Error applying template: {template_result['message']}\n")
                        logf.write("Continuing with AI generation...\n")
                    
                    manifest["errors"].append(f"Template error: {template_result['message']}")
            
            # Generate code with AI
            with open(log_path, "a") as logf:
                logf.write("\nGenerating code with AI...\n")
            
            try:
                ai_files = self.ai_generator.generate_project(
                    manifest["requirements"], 
                    manifest["project_type"]
                )
                
                # Write AI-generated files to disk
                for filename, content in ai_files.items():
                    file_path = os.path.join(project_path, filename)
                    
                    # Create subdirectories if needed
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    
                    # Don't overwrite template files unless it's a merge situation
                    if os.path.exists(file_path):
                        base_name, ext = os.path.splitext(filename)
                        new_filename = f"{base_name}.ai{ext}"
                        file_path = os.path.join(project_path, new_filename)
                    
                    with open(file_path, "w") as f:
                        f.write(content)
                    
                    rel_path = os.path.relpath(file_path, project_path)
                    manifest["files_generated"].append(rel_path)
                    
                    with open(log_path, "a") as logf:
                        logf.write(f"Generated: {rel_path}\n")
                
                # Store project files using MMRY compression
                project_files = []
                for root, _, filenames in os.walk(project_path):
                    for filename in filenames:
                        abs_path = os.path.join(root, filename)
                        rel_path = os.path.relpath(abs_path, project_path)
                        
                        # Read file content
                        with open(abs_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        project_files.append({
                            "name": rel_path,
                            "content": content,
                            "type": self._get_file_type(filename)
                        })
                
                # Store in MMRY vault with privacy protection
                user_id = manifest.get("user_id", "default_user")
                storage_result = mmry_workflow_service.store_project_files(
                    user_id=user_id,
                    project_id=project_id,
                    project_files=project_files
                )
                
                # Update manifest with storage info
                manifest["mmry_storage"] = storage_result
                
                # Log MMRY storage results
                with open(log_path, "a") as logf:
                    logf.write(f"\nMMRY Storage completed:\n")
                    logf.write(f"- Files stored: {storage_result['files_stored']}\n")
                    logf.write(f"- Original size: {storage_result['total_original_size']} bytes\n")
                    logf.write(f"- Compressed size: {storage_result['total_compressed_size']} bytes\n")
                    logf.write(f"- Compression ratio: {storage_result['compression_ratio']:.2f}\n")
                
                # Create zip file for download
                zip_path = os.path.join(self.projects_dir, f"{project_id}.zip")
                with zipfile.ZipFile(zip_path, "w") as zipf:
                    for root, _, filenames in os.walk(project_path):
                        for filename in filenames:
                            abs_path = os.path.join(root, filename)
                            rel_path = os.path.relpath(abs_path, project_path)
                            zipf.write(abs_path, rel_path)
                
                # Update manifest to complete
                manifest["status"] = "complete"
                manifest["end_time"] = time.time()
                
                with open(manifest_path, "w") as f:
                    json.dump(manifest, f, indent=2)
                
                with open(log_path, "a") as logf:
                    logf.write(f"\nBuild completed at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                    logf.write(f"Total files generated: {len(manifest['files_generated'])}\n")
                
                return {
                    "status": "complete",
                    "project_id": project_id,
                    "files_generated": len(manifest["files_generated"])
                }
                
            except Exception as e:
                logger.error(f"AI generation error: {str(e)}")
                
                # Update manifest with error
                manifest["status"] = "failed"
                manifest["end_time"] = time.time()
                manifest["errors"].append(f"AI generation error: {str(e)}")
                
                with open(manifest_path, "w") as f:
                    json.dump(manifest, f, indent=2)
                
                with open(log_path, "a") as logf:
                    logf.write(f"\nERROR: AI generation failed: {str(e)}\n")
                    logf.write(f"Build failed at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                
                return {
                    "status": "failed",
                    "project_id": project_id,
                    "error": str(e)
                }
                
        except Exception as e:
            logger.error(f"Build execution error: {str(e)}")
            
            try:
                with open(log_path, "a") as logf:
                    logf.write(f"\nCRITICAL ERROR: {str(e)}\n")
                    logf.write(f"Build failed at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
            except:
                pass
                
            return {
                "status": "failed",
                "project_id": project_id,
                "error": str(e)
            }
    
    def get_build_status(self, project_id: str) -> Dict[str, Any]:
        """
        Get the current build status for a project
        
        Args:
            project_id: ID of the project
            
        Returns:
            Dict with build status information
        """
        project_path = os.path.join(self.projects_dir, project_id)
        manifest_path = os.path.join(project_path, "build_manifest.json")
        
        if not os.path.exists(manifest_path):
            return {
                "project_id": project_id,
                "status": "unknown",
                "message": "Build manifest not found"
            }
        
        try:
            with open(manifest_path, "r") as f:
                manifest = json.load(f)
            
            # Count files in project directory
            file_count = 0
            for root, _, files in os.walk(project_path):
                file_count += len(files)
            
            return {
                "project_id": project_id,
                "status": manifest.get("status", "unknown"),
                "project_name": manifest.get("project_name", ""),
                "template_id": manifest.get("template_id"),
                "file_count": file_count,
                "files_generated": len(manifest.get("files_generated", [])),
                "start_time": manifest.get("start_time"),
                "end_time": manifest.get("end_time"),
                "duration": manifest.get("end_time") - manifest.get("start_time") if manifest.get("end_time") and manifest.get("start_time") else None,
                "errors": manifest.get("errors", [])
            }
            
        except Exception as e:
            logger.error(f"Error getting build status: {str(e)}")
            return {
                "project_id": project_id,
                "status": "unknown",
                "message": f"Error getting build status: {str(e)}"
            }
    
    def _get_file_type(self, filename: str) -> str:
        """Determine file type based on extension"""
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        
        if ext in ['js', 'jsx', 'ts', 'tsx']:
            return 'javascript'
        elif ext in ['html', 'htm']:
            return 'html'
        elif ext in ['css', 'scss', 'sass']:
            return 'css'
        elif ext in ['py']:
            return 'python'
        elif ext in ['json']:
            return 'json'
        elif ext in ['md', 'txt']:
            return 'text'
        elif ext in ['png', 'jpg', 'jpeg', 'gif', 'svg']:
            return 'image'
        else:
            return 'text'

# Example usage
if __name__ == "__main__":
    generator = ProjectGenerator()
    
    # Example: Start build
    # result = generator.start_build(
    #     "My Portfolio",
    #     ["Responsive design", "Contact form", "Project showcase"],
    #     template_id="portfolio_template"
    # )
    # print(result)
    
    # Execute build
    # build_result = generator.execute_build(result["project_id"])
    # print(build_result)
// BuildConsole.jsx
// Purpose: Display build logs and status for a project
// Last modified: 2024-11-03
// By: AI Assistant
// Completeness: 100

import React, { useState, useEffect } from 'react';
import './BuildConsole.css';

export default function BuildConsole({ src, projectId }) {
  const [logs, setLogs] = useState('Loading build logs...');
  const [status, setStatus] = useState({
    status: 'initializing',
    progress: 0,
    file_count: 0
  });
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Fetch logs
  useEffect(() => {
    if (!src) return;
    
    const fetchLogs = async () => {
      try {
        const res = await fetch(src);
        if (res.ok) {
          const text = await res.text();
          setLogs(text);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    
    return () => clearInterval(interval);
  }, [src]);
  
  // Fetch build status
  useEffect(() => {
    if (!projectId) return;
    
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/build-status/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    
    return () => clearInterval(interval);
  }, [projectId]);
  
  // Auto-scroll to bottom effect
  useEffect(() => {
    if (!autoScroll) return;
    
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
      consoleContent.scrollTop = consoleContent.scrollHeight;
    }
  }, [logs, autoScroll]);
  
  // Get status indicator color
  const getStatusColor = () => {
    switch(status.status) {
      case 'complete': return '#4CAF50'; // Green
      case 'failed': return '#F44336'; // Red
      case 'generating': return '#2196F3'; // Blue
      default: return '#FF9800'; // Orange for initializing/unknown
    }
  };
  
  return (
    <div className="build-console">
      <div className="console-header">
        <span>Build Console</span>
        <div className="console-controls">
          <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
            <span>{status.status}</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${status.progress}%`, backgroundColor: getStatusColor() }}
            ></div>
          </div>
          <span className="file-count">{status.file_count} files</span>
          <label className="auto-scroll">
            <input 
              type="checkbox" 
              checked={autoScroll} 
              onChange={() => setAutoScroll(!autoScroll)} 
            />
            Auto-scroll
          </label>
        </div>
      </div>
      <div id="console-content" className="console-content">
        <pre>{logs}</pre>
      </div>
    </div>
  );
}
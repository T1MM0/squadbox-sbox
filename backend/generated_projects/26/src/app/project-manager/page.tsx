import React from 'react';
import ProjectList from '../components/ProjectList';
import TeamCollaboration from '../components/TeamCollaboration';
import ContentCalendar from '../components/ContentCalendar';
import WorkflowStatus from '../components/WorkflowStatus';

export default function Project manager() {
  return (
    <div className="page project manager">
      <h1>Project Manager</h1>
      <ProjectList />
      <TeamCollaboration />
      <ContentCalendar />
      <WorkflowStatus />
    </div>
  );
}

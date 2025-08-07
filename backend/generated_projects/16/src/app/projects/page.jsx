import React from 'react';
import ProjectList from '../components/ProjectList';
import ProjectDetails from '../components/ProjectDetails';
import RelatedProjects from '../components/RelatedProjects';

export default function Projects() {
  return (
    <div className="page projects">
      <h1>Projects</h1>
      <ProjectList />
      <ProjectDetails />
      <RelatedProjects />
    </div>
  );
}

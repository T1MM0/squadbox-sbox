import React from 'react';
import Bio from '../components/Bio';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Testimonials from '../components/Testimonials';

export default function About() {
  return (
    <div className="page about">
      <h1>About</h1>
      <Bio />
      <Experience />
      <Education />
      <Testimonials />
    </div>
  );
}

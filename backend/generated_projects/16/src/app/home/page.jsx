import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import FeaturedProjects from '../components/FeaturedProjects';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <div className="page home">
      <h1>Home</h1>
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Contact />
    </div>
  );
}

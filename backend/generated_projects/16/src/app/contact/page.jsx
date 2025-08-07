import React from 'react';
import ContactForm from '../components/ContactForm';
import SocialLinks from '../components/SocialLinks';
import Location from '../components/Location';

export default function Contact() {
  return (
    <div className="page contact">
      <h1>Contact</h1>
      <ContactForm />
      <SocialLinks />
      <Location />
    </div>
  );
}

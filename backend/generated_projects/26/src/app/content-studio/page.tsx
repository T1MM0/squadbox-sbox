import React from 'react';
import ContentEditor from '../components/ContentEditor';
import AiSuggestions from '../components/AiSuggestions';
import TemplateLibrary from '../components/TemplateLibrary';
import BrandVoicePanel from '../components/BrandVoicePanel';

export default function Content studio() {
  return (
    <div className="page content studio">
      <h1>Content Studio</h1>
      <ContentEditor />
      <AiSuggestions />
      <TemplateLibrary />
      <BrandVoicePanel />
    </div>
  );
}

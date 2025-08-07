import React from 'react';
import VoiceTraining from '../components/VoiceTraining';
import StyleGuide from '../components/StyleGuide';
import CustomPrompts from '../components/CustomPrompts';
import IntegrationSettings from '../components/IntegrationSettings';

export default function Brand settings() {
  return (
    <div className="page brand settings">
      <h1>Brand Settings</h1>
      <VoiceTraining />
      <StyleGuide />
      <CustomPrompts />
      <IntegrationSettings />
    </div>
  );
}

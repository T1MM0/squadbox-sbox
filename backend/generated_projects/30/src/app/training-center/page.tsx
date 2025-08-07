import React from 'react';
import KnowledgeBase from '../components/KnowledgeBase';
import ConversationTraining from '../components/ConversationTraining';
import ModelTuning from '../components/ModelTuning';

export default function Training center() {
  return (
    <div className="page training center">
      <h1>Training Center</h1>
      <KnowledgeBase />
      <ConversationTraining />
      <ModelTuning />
    </div>
  );
}

import React from 'react';
import ChatWindow from '../components/ChatWindow';
import ConversationHistory from '../components/ConversationHistory';
import SettingsPanel from '../components/SettingsPanel';

export default function Chat interface() {
  return (
    <div className="page chat interface">
      <h1>Chat Interface</h1>
      <ChatWindow />
      <ConversationHistory />
      <SettingsPanel />
    </div>
  );
}

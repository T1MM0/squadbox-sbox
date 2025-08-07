import React from 'react';
import ConversationMetrics from '../components/ConversationMetrics';
import PerformanceStats from '../components/PerformanceStats';
import UserInsights from '../components/UserInsights';

export default function Analytics dashboard() {
  return (
    <div className="page analytics dashboard">
      <h1>Analytics Dashboard</h1>
      <ConversationMetrics />
      <PerformanceStats />
      <UserInsights />
    </div>
  );
}

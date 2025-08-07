import React from 'react';
import ContentPerformance from '../components/ContentPerformance';
import UsageMetrics from '../components/UsageMetrics';
import AiInsights from '../components/AiInsights';
import OptimizationTips from '../components/OptimizationTips';

export default function Analytics dashboard() {
  return (
    <div className="page analytics dashboard">
      <h1>Analytics Dashboard</h1>
      <ContentPerformance />
      <UsageMetrics />
      <AiInsights />
      <OptimizationTips />
    </div>
  );
}

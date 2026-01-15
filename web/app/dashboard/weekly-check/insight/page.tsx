/**
 * Weekly Check Insight Page
 * 
 * Display at most one insight and optional scope recommendation.
 * Calm, non-judgmental language.
 */

import { Suspense } from 'react';
import InsightClient from './InsightClient';

export default function WeeklyCheckInsightPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex items-center justify-center">
        <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">Loading...</p>
      </div>
    }>
      <InsightClient />
    </Suspense>
  );
}

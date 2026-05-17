'use client';

import { Suspense } from 'react';
import { usePageTracking } from '@/hooks/useAnalytics';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}

'use client';

import { usePageTracking } from '@/hooks/useAnalytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();
  return <>{children}</>;
}

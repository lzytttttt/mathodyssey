'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function AnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '');
    // Track page views via console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page view: ${url}`);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  );
}

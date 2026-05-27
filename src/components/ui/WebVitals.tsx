'use client';

import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Log Core Web Vitals in development
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric = entry as PerformanceEntry & { value?: number; rating?: string };
        console.log(
          `[Web Vitals] ${metric.name}: ${metric.value?.toFixed(2) ?? metric.startTime.toFixed(2)}ms`,
          metric.rating ? `(${metric.rating})` : ''
        );
      }
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // PerformanceObserver types not supported in all browsers
    }

    return () => observer.disconnect();
  }, []);

  return null;
}

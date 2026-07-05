'use client';

import * as React from 'react';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { timeOfDay, override, updateTimeOfDay } = useTimeOfDay();

  React.useEffect(() => {
    // Update time of day every minute to ensure we catch the transition
    const interval = setInterval(() => {
      updateTimeOfDay();
    }, 60000);

    return () => clearInterval(interval);
  }, [updateTimeOfDay]);

  React.useEffect(() => {
    const activeState = override || timeOfDay;
    document.documentElement.setAttribute('data-time-of-day', activeState);
    
    // Enable slow CSS transitions only after the first paint is complete
    // so the initial load doesn't slowly fade in from default colors
    const timeout = setTimeout(() => {
      document.documentElement.classList.add('theme-loaded');
    }, 50);

    return () => clearTimeout(timeout);
  }, [timeOfDay, override]);

  return <>{children}</>;
}

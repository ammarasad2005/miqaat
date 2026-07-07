'use client';

import * as React from 'react';
import { useTimeOfDay } from '@/lib/theme/useTimeOfDay';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

function useCelestialProgress() {
  const { timeOfDay, sunrise, sunset } = useTimeOfDay();
  const [progress, setProgress] = React.useState(0.5); // Default to peak

  React.useEffect(() => {
    if (!sunrise || !sunset) return;

    const updateProgress = () => {
      const now = new Date().getTime();
      const sr = sunrise.getTime();
      const ss = sunset.getTime();

      let currentProgress = 0.5;

      if (timeOfDay === 'day' || timeOfDay === 'dawn' || timeOfDay === 'golden') {
        // Daylight arc
        const totalDaylight = ss - sr;
        currentProgress = (now - sr) / totalDaylight;
      } else {
        // Nighttime arc
        if (now < sr) {
          // Past midnight, approaching today's sunrise. Base off yesterday's sunset.
          const yesterdaySunset = ss - 24 * 60 * 60 * 1000;
          const totalNight = sr - yesterdaySunset;
          currentProgress = (now - yesterdaySunset) / totalNight;
        } else {
          // After sunset, approaching tomorrow's sunrise.
          const tomorrowSunrise = sr + 24 * 60 * 60 * 1000;
          const totalNight = tomorrowSunrise - ss;
          currentProgress = (now - ss) / totalNight;
        }
      }
      
      // Clamp between -0.1 and 1.1 so it doesn't go too far off screen
      setProgress(Math.max(-0.1, Math.min(1.1, currentProgress)));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeOfDay, sunrise, sunset]);

  return progress;
}

export function CelestialArc() {
  const { timeOfDay } = useTimeOfDay();
  const progress = useCelestialProgress();
  const { reduceMotion } = useSettingsStore();

  const isNight = timeOfDay === 'night';
  
  // Calculate position along an elliptical path
  // viewBox is 100x50. Horizon is at y=50.
  // Center is x=50. Radius X is 50, Radius Y is 40.
  const angle = progress * Math.PI;
  const x = 50 - 50 * Math.cos(angle);
  const y = 50 - 40 * Math.sin(angle);

  const glowColor = isNight ? 'rgba(226, 232, 240, 0.4)' : 'rgba(251, 191, 36, 0.6)';
  const coreColor = isNight ? '#f8fafc' : '#fde68a';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50 mix-blend-screen">
      {/* We use a large div to contain the SVG so it scales properly but stays anchored to the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[70vh]">
        <svg 
          viewBox="0 0 100 50" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          {/* Subtle arc path */}
          <path 
            d="M 0 50 A 50 40 0 0 1 100 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.1" 
            className="text-foreground/20" 
            strokeDasharray="0.5 1" 
          />
          
          {/* The Sun / Moon */}
          <motion.g
            animate={{ x, y }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1, ease: "linear" }}
          >
            {/* Outer Glow */}
            <circle cx="0" cy="0" r="12" fill={glowColor} className="blur-xl" />
            <circle cx="0" cy="0" r="6" fill={glowColor} className="blur-md" />
            {/* Core */}
            <circle cx="0" cy="0" r="1.5" fill={coreColor} />
            
            {/* Moon craters (subtle detail if night) */}
            {isNight && (
              <>
                <circle cx="-0.5" cy="-0.5" r="0.3" fill="rgba(0,0,0,0.2)" />
                <circle cx="0.6" cy="0.2" r="0.4" fill="rgba(0,0,0,0.2)" />
              </>
            )}
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

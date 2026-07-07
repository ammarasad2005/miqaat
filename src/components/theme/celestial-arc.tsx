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
  // viewBox is 200x100 for better resolution of effects. Horizon is at y=100.
  // Center is x=100. Radius X is 100, Radius Y is 80.
  const angle = progress * Math.PI;
  const x = 100 - 100 * Math.cos(angle);
  const y = 100 - 80 * Math.sin(angle);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-60">
      <div className="absolute bottom-0 left-0 w-full h-[70vh]">
        <svg 
          viewBox="0 0 200 100" 
          preserveAspectRatio="none" 
          className="w-full h-full"
        >
          <defs>
            {/* Arc Path Gradient (fades at edges) */}
            <linearGradient id="arc-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="20%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="80%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>

            {/* Moon Shading & Texture */}
            <radialGradient id="moon-sphere" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="90%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            
            <filter id="craters">
              <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" result="noise" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
              <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
              <feBlend mode="multiply" in="texture" in2="SourceGraphic" />
            </filter>

            {/* Sun Shading & Rays */}
            <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            
            <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feGaussianBlur stdDeviation="15" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Elegant Arc Path */}
          <path 
            d="M 0 100 A 100 80 0 0 1 200 100" 
            fill="none" 
            stroke="url(#arc-glow)" 
            strokeWidth="0.3" 
            className="text-foreground/30" 
            strokeDasharray="1 3" 
          />
          
          {/* Celestial Body Container */}
          <motion.g
            animate={{ x, y }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1, ease: "linear" }}
          >
            {isNight ? (
              // 3D MOON
              <g>
                {/* Atmospheric Glow */}
                <circle cx="0" cy="0" r="16" fill="rgba(226, 232, 240, 0.1)" className="blur-xl" />
                <circle cx="0" cy="0" r="8" fill="rgba(226, 232, 240, 0.2)" className="blur-md" />
                
                {/* 3D Sphere */}
                <circle cx="0" cy="0" r="4" fill="url(#moon-sphere)" />
                {/* Texture Overlay */}
                <circle cx="0" cy="0" r="4" fill="white" filter="url(#craters)" />
              </g>
            ) : (
              // 3D SUN
              <g>
                {/* Intense Outer Corona */}
                <circle cx="0" cy="0" r="25" fill="rgba(251, 191, 36, 0.15)" className="blur-2xl" />
                <circle cx="0" cy="0" r="12" fill="rgba(245, 158, 11, 0.3)" className="blur-xl" />
                
                {/* Core and Inner Rays */}
                <circle cx="0" cy="0" r="8" fill="url(#sun-core)" filter="url(#sun-glow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
              </g>
            )}
          </motion.g>
        </svg>
      </div>
    </div>
  );
}

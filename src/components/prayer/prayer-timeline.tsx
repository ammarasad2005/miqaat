'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCurrentPrayer, PRAYER_SEQUENCE, PrayerName } from '@/lib/prayer/useCurrentPrayer';
import { useLocationStore } from '@/lib/store/locationStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { calculatePrayerTimes } from '@/lib/prayer/calculate';
import { LiveCountdown } from './live-countdown';
import { themeTransitionPreset } from '@/lib/theme/motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formatTime = (date: Date, is24h: boolean) => {
  return format(date, is24h ? 'HH:mm' : 'h:mm a');
};

const PRAYER_DISPLAY_NAMES: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export function PrayerTimeline() {
  const { lat, lng } = useLocationStore();
  const { calculationMethod, timeFormat } = useSettingsStore();
  const currentPrayerState = useCurrentPrayer();
  const [expandedNode, setExpandedNode] = React.useState<PrayerName | null>(null);

  // We need today's times to render the list.
  // We compute it once per render, which is fine since it's just local date math,
  // or we could memoize it.
  const todayTimes = React.useMemo(() => {
    if (lat === null || lng === null) return null;
    return calculatePrayerTimes({
      lat,
      lng,
      date: new Date(),
      method: calculationMethod,
    });
  }, [lat, lng, calculationMethod]);

  if (!todayTimes || !currentPrayerState) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground animate-pulse">
        Calculating times...
      </div>
    );
  }

  const { current, next } = currentPrayerState;
  const is24h = timeFormat === '24h';

  return (
    <div className="relative flex flex-col space-y-0 py-4 w-full max-w-sm mx-auto">
      {/* Central rail line */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-border -z-10" />

      {PRAYER_SEQUENCE.map((prayerName) => {
        const time = todayTimes[prayerName];
        const isCurrent = current.name === prayerName;
        const isNext = next.name === prayerName;
        const isPast = time.getTime() < currentPrayerState.now.getTime() && !isCurrent;
        
        return (
          <div 
            key={prayerName}
            className="relative flex items-start gap-6 py-4 cursor-pointer group"
            onClick={() => setExpandedNode(expandedNode === prayerName ? null : prayerName)}
          >
            {/* Node marker */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              {/* Outer Glow (Animated for Current) */}
              {isCurrent && (
                <motion.div
                  layoutId="current-glow"
                  className="absolute inset-0 rounded-full bg-primary/20 blur-md hidden sm:block motion-safe:block"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              
              {/* Node Circle */}
              <motion.div 
                layout
                className={cn(
                  "relative z-10 h-4 w-4 rounded-full border-2 transition-colors duration-500",
                  isCurrent ? "border-primary bg-primary shadow-[0_0_15px_var(--color-time-glow)]" : 
                  isPast ? "border-muted-foreground/30 bg-muted/50" : 
                  "border-muted-foreground/50 bg-card"
                )}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col pt-3 w-full">
              <div className="flex items-baseline justify-between">
                <motion.h3 
                  layout
                  className={cn(
                    "text-xl font-heading font-medium transition-colors",
                    isCurrent ? "text-primary" : isPast ? "text-muted-foreground/50" : "text-foreground"
                  )}
                >
                  {PRAYER_DISPLAY_NAMES[prayerName]}
                </motion.h3>
                
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isCurrent ? "text-primary" : isPast ? "text-muted-foreground/50" : "text-muted-foreground"
                )}>
                  {formatTime(time, is24h)}
                </span>
              </div>

              {/* Countdown & Expansion */}
              <AnimatePresence>
                {(isNext || expandedNode === prayerName) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={themeTransitionPreset}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border/50">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      {isNext ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">Next Prayer</span>
                          <LiveCountdown targetTime={next.time} />
                        </div>
                      ) : (
                        <span>Exact time: {format(time, is24h ? 'HH:mm:ss' : 'hh:mm:ss a')}</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}

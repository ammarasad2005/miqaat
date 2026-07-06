'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { generateCacheKey, getCachedReflection, setCachedReflection } from '@/lib/reflection/cache';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ReflectionPanel() {
  const { lat, lng } = useLocationStore();
  const [reflection, setReflection] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasRefreshed, setHasRefreshed] = React.useState(false);

  const fetchReflection = React.useCallback(async (forceRefresh = false) => {
    if (lat === null || lng === null) return;
    
    setIsLoading(true);
    
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const locationHash = `${lat.toFixed(2)},${lng.toFixed(2)}`;
    const cacheKey = generateCacheKey(dateStr, locationHash);
    
    if (!forceRefresh) {
      const cached = getCachedReflection(cacheKey);
      if (cached) {
        setReflection(cached.text);
        setIsLoading(false);
        return;
      }
    }
    
    try {
      const res = await fetch('/api/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateStr, lat, lng })
      });
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      
      if (data.text) {
        setReflection(data.text);
        setCachedReflection(cacheKey, {
          text: data.text,
          dateStr,
          locationHash
        });
      } else {
        throw new Error('Empty response');
      }
    } catch (e) {
      // Provide a graceful fallback if the network or API fails
      if (!reflection) {
        setReflection('Take a moment to pause and reflect on the beauty of the day. May your time be filled with purpose and peace.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [lat, lng, reflection]);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReflection();
  }, [fetchReflection]);

  if (lat === null || lng === null) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full bg-card/60 backdrop-blur-md border border-border/50 shadow-sm rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          <h3 className="text-sm font-medium uppercase tracking-wider">Daily Reflection</h3>
        </div>
        <button 
          onClick={() => {
            if (!hasRefreshed && !isLoading) {
              setHasRefreshed(true);
              fetchReflection(true);
            }
          }}
          disabled={hasRefreshed || isLoading}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            hasRefreshed ? "opacity-30 cursor-not-allowed" : "hover:bg-muted text-muted-foreground hover:text-foreground",
            isLoading && "animate-spin"
          )}
          aria-label="Refresh reflection"
          title={hasRefreshed ? "You can only refresh once per day" : "Refresh reflection"}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 min-h-[4rem] flex items-center">
        {isLoading && !reflection ? (
          <div className="space-y-2 w-full animate-pulse">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        ) : (
          <p className="text-foreground/90 leading-relaxed text-sm md:text-base font-medium">
            {reflection}
          </p>
        )}
      </div>
    </motion.div>
  );
}

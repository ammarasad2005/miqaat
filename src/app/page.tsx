'use client';

import * as React from 'react';
import { LocationSetup } from '@/components/prayer/location-setup';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import { useLocationStore } from '@/lib/store/locationStore';

export default function Home() {
  const { lat, lng } = useLocationStore();
  const hasLocation = lat !== null && lng !== null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 pt-12 md:p-24 relative z-10">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-2">Miqaat</h1>
          <p className="text-muted-foreground font-sans text-sm">
            Living Prayer Timeline
          </p>
        </div>

        {!hasLocation ? (
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg">
            <h2 className="text-xl font-heading font-semibold mb-4">Set your location</h2>
            <LocationSetup />
          </div>
        ) : (
          <div className="bg-card p-6 rounded-3xl border border-border shadow-lg">
            <PrayerTimeline />
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <LocationSetup />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

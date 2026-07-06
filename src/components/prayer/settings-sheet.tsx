'use client';

import * as React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { CALCULATION_METHODS, CalculationMethodId } from '@/lib/prayer/methods';
import { LocationSetup } from './location-setup';
import { NotificationSetup } from './notification-setup';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function SettingsSheet() {
  const { calculationMethod, setCalculationMethod, timeFormat, setTimeFormat } = useSettingsStore();

  return (
    <Sheet>
      <SheetTrigger 
        className="p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5 text-foreground" />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md" aria-describedby="settings-description">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-heading text-2xl">Settings</SheetTitle>
          <SheetDescription id="settings-description">
            Customize your location, calculation methods, and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-10 pb-12 px-2 sm:px-0">
          {/* Location Override */}
          <section>
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Location</h3>
            <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm">
              <LocationSetup />
            </div>
          </section>

          {/* Time Format */}
          <section>
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Time Format</h3>
            <div 
              className="relative flex p-1.5 rounded-2xl bg-muted/40 backdrop-blur-md border border-border/50 shadow-sm" 
              role="radiogroup" 
              aria-label="Time format selection"
            >
              {(['12h', '24h'] as const).map((format) => (
                <button
                  key={format}
                  role="radio"
                  aria-checked={timeFormat === format}
                  onClick={() => setTimeFormat(format)}
                  className={cn(
                    "relative flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10",
                    timeFormat === format 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {timeFormat === format && (
                    <motion.div
                      layoutId="timeFormatIndicator"
                      className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Reminders</h3>
            <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md p-5 shadow-sm">
              <NotificationSetup />
            </div>
          </section>

          {/* Calculation Method */}
          <section>
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3">Calculation Method</h3>
            <div className="space-y-3" role="radiogroup" aria-label="Prayer calculation method">
              {(Object.keys(CALCULATION_METHODS) as CalculationMethodId[]).map((methodId) => {
                const method = CALCULATION_METHODS[methodId];
                const isSelected = calculationMethod === methodId;
                
                return (
                  <div
                    key={methodId}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => setCalculationMethod(methodId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCalculationMethod(methodId);
                      }
                    }}
                    className={cn(
                      "relative flex flex-col p-4 rounded-2xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden",
                      isSelected 
                        ? "border-primary/50 shadow-sm" 
                        : "border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50 backdrop-blur-sm"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="calcMethodIndicator"
                        className="absolute inset-0 bg-primary/10 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={cn("font-medium mb-1", isSelected ? "text-primary" : "text-foreground")}>
                      {method.name}
                    </span>
                    <span className="text-sm text-muted-foreground leading-snug">
                      {method.regionDescription}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

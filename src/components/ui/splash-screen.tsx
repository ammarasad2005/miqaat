'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0 L60 30 L90 20 L75 45 L100 65 L70 70 L65 100 L45 75 L15 95 L25 65 L0 45 L30 35 L15 5 Z" fill="currentColor" className="text-primary opacity-80" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Miqaat</h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

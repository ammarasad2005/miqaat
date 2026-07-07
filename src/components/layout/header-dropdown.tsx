'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useCurrentPrayer } from '@/lib/prayer/useCurrentPrayer';

function StreetLampIndicator({ active }: { active: boolean }) {
  const { reduceMotion } = useSettingsStore();
  const currentPrayerState = useCurrentPrayer();
  const isNight = currentPrayerState?.isAfterIsha || currentPrayerState?.current.name === 'isha' || currentPrayerState?.current.name === 'maghrib' || currentPrayerState?.current.name === 'fajr';
  
  // Theme the glow based on time of day (warmer at night, more neutral/subtle in day)
  const glowColor = isNight ? 'rgba(251, 191, 36, 0.6)' : 'rgba(250, 204, 21, 0.4)';
  const bulbColor = isNight ? '#fde68a' : '#fef08a';

  return (
    <div className="relative w-4 h-6 flex items-center justify-center shrink-0 -ml-1">
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute">
        {/* Lamp Post Base */}
        <path d="M6 16V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground/60" />
        
        {/* Lamp Head Outline */}
        <path d="M3 6L4 2H8L9 6H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/80" />
        <path d="M4.5 2L6 0L7.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/80" />
        
        {/* Bulb/Light */}
        <path d="M5 4.5C5 3.67157 5.44772 3 6 3C6.55228 3 7 3.67157 7 4.5" stroke={active ? bulbColor : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" className={active ? '' : 'text-muted-foreground/30'} />
      </svg>
      
      {/* Glow Animation */}
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.7] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[3px] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full blur-sm"
          style={{ backgroundColor: glowColor }}
        />
      )}
    </div>
  );
}

export function HeaderDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/welcome', label: 'Welcome' },
    { href: '/settings', label: 'Settings' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex p-2.5 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
          isOpen && "bg-muted"
        )}
        aria-label="Navigation Menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-6 h-6 text-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg rounded-2xl overflow-hidden z-50 origin-top-right"
          >
            <div className="flex flex-col py-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/50",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <StreetLampIndicator active={isActive} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

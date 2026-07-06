'use client';

import * as React from 'react';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { cn } from '@/lib/utils';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotificationSetup() {
  const { notificationsEnabled, setNotificationsEnabled, notificationOffset, setNotificationOffset } = useSettingsStore();
  const [isSupported, setIsSupported] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(false);
    }
  }, []);

  const handleToggle = async () => {
    if (!notificationsEnabled) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotificationsEnabled(true);
          }
        } catch (error) {
          console.warn('Notification permission request failed', error);
        }
      } else {
        // If denied, maybe show an alert or just rely on the UI state not changing
        alert('Notifications are blocked by your browser settings. Please enable them to use this feature.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col space-y-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/80 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4" />
          Not Supported
        </div>
        <p>Your browser or device does not support background notifications.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 pr-4">
          <h4 className="font-medium text-foreground">Status</h4>
          <p className="text-sm text-muted-foreground leading-snug">
            Receive a native browser alert before each prayer time.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap overflow-hidden",
            notificationsEnabled 
              ? "text-primary-foreground shadow-md" 
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {notificationsEnabled && (
             <motion.div
               layoutId="notificationsToggleBg"
               className="absolute inset-0 bg-primary -z-10"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2 }}
             />
          )}
          {notificationsEnabled ? (
            <>
              <Bell className="w-4 h-4" />
              Enabled
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4" />
              Disabled
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Offset Time</h4>
        <div 
          className={cn(
            "relative flex p-1.5 rounded-2xl transition-all duration-300 backdrop-blur-md border border-border/50 shadow-sm", 
            notificationsEnabled ? "bg-muted/40" : "bg-muted/20 opacity-50 pointer-events-none"
          )} 
          role="radiogroup" 
          aria-label="Minutes before reminder"
        >
          {([5, 10, 15] as const).map((offset) => (
            <button
              key={offset}
              role="radio"
              aria-checked={notificationOffset === offset}
              onClick={() => setNotificationOffset(offset)}
              disabled={!notificationsEnabled}
              className={cn(
                "relative flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary z-10",
                notificationOffset === offset 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {notificationOffset === offset && (
                <motion.div
                  layoutId="notificationOffsetIndicator"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {offset} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogoMark } from '@/components/brand/logo-mark';
import { Code2, LayoutDashboard, Compass, Settings, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'HOME', icon: LayoutDashboard },
    { href: '/welcome', label: 'WELCOME', icon: Compass },
    { href: '/settings', label: 'SETTINGS', icon: Settings },
    { href: '/contact', label: 'CONTACT', icon: Mail },
  ];

  return (
    <footer className="relative py-12 md:py-16 px-6 border-t border-border/10 w-full mt-12 bg-background/50">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-12">
        
        {/* Navigation Dock (Pill) */}
        <nav className="relative flex items-center justify-center px-4 py-3 rounded-[2.5rem] bg-[#1a1a1a]/95 border border-amber-600/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden w-full max-w-[600px] overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between w-full min-w-[max-content] gap-2 sm:gap-4 px-2 relative z-10">
            {links.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={cn(
                    "relative flex flex-col items-center justify-center w-20 sm:w-24 h-20 rounded-2xl transition-colors duration-300",
                    isActive ? "text-white" : "text-muted-foreground/60 hover:text-muted-foreground"
                  )}
                >
                  {/* Spotlight Background */}
                  {isActive && (
                    <motion.div
                      layoutId="footer-spotlight"
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-[120%] pointer-events-none z-0"
                      style={{
                        width: '120px',
                        background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.25) 0%, transparent 100%)',
                        clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)'
                      }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Top glowing bar */}
                  {isActive && (
                    <motion.div
                      layoutId="footer-top-light"
                      className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-8 h-1.5 bg-amber-100 rounded-b-md shadow-[0_0_12px_rgba(251,191,36,0.8)] z-20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon & Label */}
                  <div className="relative z-10 flex flex-col items-center gap-2 mt-2">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                    <span className={cn(
                      "text-[10px] sm:text-xs font-medium tracking-widest",
                      isActive ? "text-white font-bold" : ""
                    )}>
                      {link.label}
                    </span>
                  </div>

                  {/* Bottom underline glow */}
                  {isActive && (
                    <motion.div
                      layoutId="footer-bottom-line"
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-amber-300/40 shadow-[0_0_8px_rgba(251,191,36,0.6)] z-20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            <a
              href="https://github.com/rauf17/miqaat"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative flex flex-col items-center justify-center w-20 sm:w-24 h-20 rounded-2xl transition-colors duration-300 text-muted-foreground/60 hover:text-muted-foreground"
              )}
            >
              <div className="relative z-10 flex flex-col items-center gap-2 mt-2">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                <span className="text-[10px] sm:text-xs font-medium tracking-widest">
                  SOURCE
                </span>
              </div>
            </a>
          </div>
        </nav>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <LogoMark className="w-6 h-6 text-foreground/40" />
            <span className="font-brand font-semibold text-foreground/40 tracking-widest uppercase text-xs">
              Miqaat
            </span>
          </div>
          <p className="text-xs text-muted-foreground/40 text-center">
            Made with purpose. Open source &amp; privacy-first.
          </p>
        </div>
      </div>
    </footer>
  );
}

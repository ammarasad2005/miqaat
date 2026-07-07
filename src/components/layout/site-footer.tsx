'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogoMark } from '@/components/brand/logo-mark';
import { Code2 } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="relative py-12 md:py-16 px-6 border-t border-border/30 w-full mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-3">
            <LogoMark className="w-8 h-8 text-foreground/60" />
            <span className="font-brand font-semibold text-foreground/60 tracking-widest uppercase text-sm">
              Miqaat
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center md:text-left mt-2">
            Made with purpose. Open source &amp; privacy-first.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link href="/welcome" className="hover:text-foreground transition-colors">
            Welcome
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <a
            href="https://github.com/rauf17/miqaat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Code2 className="w-4 h-4" />
            Source
          </a>
        </nav>
      </div>
    </footer>
  );
}

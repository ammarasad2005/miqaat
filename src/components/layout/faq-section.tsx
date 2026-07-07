'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    question: 'How are prayer times calculated?',
    answer:
      'We use the adhan.js library, which implements precise solar position algorithms used by major Islamic organizations worldwide. You can choose from multiple calculation methods (MWL, ISNA, Egyptian, Umm Al\u2011Qura, and Karachi) depending on your region.',
  },
  {
    question: 'Is my location data shared or stored on a server?',
    answer:
      'No. Your coordinates are stored only in your browser\u2019s localStorage. The only network request related to location is a one\u2011time reverse geocode call to display your city name \u2014 and even that is optional. We have no backend database and no user accounts.',
  },
  {
    question: 'What calculation methods do you support?',
    answer:
      'Muslim World League (MWL), Islamic Society of North America (ISNA), Egyptian General Authority of Survey, Umm Al\u2011Qura University (Makkah), and University of Islamic Sciences, Karachi. Switch any time in Settings.',
  },
  {
    question: 'Does this work offline?',
    answer:
      'Prayer times, Hijri calendar, and the Qibla compass work fully offline \u2014 they use mathematical algorithms running entirely in your browser. The weather widget and daily AI reflection require an internet connection.',
  },
  {
    question: 'Is this open source?',
    answer:
      'Yes, Miqaat is fully open source. You can inspect every line of code, verify our privacy claims, or contribute improvements. The repository link is in the footer below.',
  },
  {
    question: 'Why isn\u2019t there a native mobile app?',
    answer:
      'Miqaat is a Progressive Web App (PWA) \u2014 install it to your home screen on any device and it behaves like a native app. One codebase serves every platform, and updates ship instantly without app store reviews.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-60px' } as const,
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border-b border-border/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        aria-expanded={open}
      >
        <span className="text-lg font-heading font-medium text-foreground pr-8 group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300',
            open && 'rotate-180 text-primary'
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ id }: { id?: string }) {
  return (
    <section id={id} className="relative py-12 md:py-24 px-6 w-full">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-primary mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">
            Common questions
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="rounded-3xl bg-card/30 backdrop-blur-md border border-border/40 p-6 md:p-10"
        >
          {FAQS.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

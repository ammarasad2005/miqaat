# Miqaat

Miqaat is a premium, privacy-first Islamic daily companion designed around a simple philosophy: **Software that moves with the sky.**

Instead of static, utilitarian tables for prayer times, Miqaat uses a reactive, time-adaptive theme engine that continuously evolves throughout the day. It offers four distinct visual states (Dawn, Day, Golden, Night) that automatically shift based on the real-world time, creating a beautiful, ambient experience.

![Miqaat Preview](public/preview.png)

## Core Features

- **Living Theme Engine**: CSS variables driven by a time-adaptive React hook to shift colors, glows, and backgrounds.
- **Solar Calculations**: Prayer times powered by `adhan.js` using strictly offline mathematical algorithms.
- **Hijri Calendar**: Zero-dependency Hijri date conversions and month grid views using the native JavaScript `Intl` API (`islamic-umalqura`).
- **Qibla Compass**: A precision bearing to the Kaaba calculated from your exact coordinates.
- **Daily Reflection**: A curated rotation of authentic Quranic verses and Sahih Hadiths paired with safe, context-aware AI commentary.
- **Weather Context**: Real-time ambient weather conditions subtly integrated into the interface.
- **Complete Offline Privacy**: All settings and locations are saved entirely in your local browser storage using `zustand`. No login. No database.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, Static Generation)
- **Styling**: Tailwind CSS & Vanilla CSS Variables
- **Components**: Radix / shadcn/ui
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rauf17/miqaat.git
   cd miqaat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add the following variables to your `.env.local` file:
   - `GEOCODING_API_KEY`: Used in `/api/geocode` to reverse geocode coordinates to city names (e.g., Google Maps API Key).
   - `NEXT_PUBLIC_WEATHER_API_KEY`: Used to fetch weather conditions (e.g., WeatherAPI Key).
   - `GEMINI_API_KEY`: Required for the Daily Reflection AI commentary feature.

4. **Marketing Assets**
   To fully populate the `/welcome` marketing page, ensure you place the following screenshots in `public/marketing/`:
   - `timeline.webp`
   - `calendar.webp`
   - `qibla.webp`
   - `reflection.webp`

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the dashboard, or [http://localhost:3000/welcome](http://localhost:3000/welcome) for the marketing page.

## Deployment

Miqaat is optimized for Vercel and can be statically exported or deployed using the Edge runtime. 

Simply connect your GitHub repository and add your `GEOCODING_API_KEY`, `NEXT_PUBLIC_WEATHER_API_KEY`, and `GEMINI_API_KEY` to the Vercel Environment Variables panel.

```bash
npx vercel
```

**Live Demo**: [https://miqaat-beta.vercel.app/welcome](https://miqaat-beta.vercel.app/welcome)

# HabitFlow 🌱

A gamified micro-habit tracker that makes building daily routines actually fun. Track streaks, earn achievements, and watch your progress grow — all from your browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)

## What is this?

I kept forgetting to track my habits. Tried journals, tried notes apps, tried a bunch of habit trackers — most felt boring or way too complex. So I built this.

HabitFlow is a web app where you can:

- **Add habits** — pick from templates or create your own with custom icons and colors
- **One-tap daily tracking** — check off habits with a satisfying animation
- **Streak tracking** — see your 🔥 fire streak grow (with bonus XP for long streaks)
- **Stats & charts** — weekly/monthly completion charts to spot patterns
- **Calendar view** — browse past months and see what you completed when
- **Achievements** — unlock badges for milestones like "7-day streak" or "100 completions"
- **XP & leveling** — earn points and level up from Seedling to Legendary
- **Dark & light mode** — pink-tinted light theme because why not
- **Works offline** — PWA support, install it on your phone

Everything stays in your browser's localStorage — no accounts, no backend, no tracking.

## Tech Stack

| What | Why |
|------|-----|
| **Next.js 16** | App router, server components, great DX |
| **TypeScript** | Keeps things sane as the codebase grows |
| **Tailwind CSS 4** | Fast styling without fighting CSS files |
| **Framer Motion** | Smooth animations that don't feel janky |
| **Recharts** | Charts that actually look good |
| **Lucide Icons** | Clean, consistent icon set |
| **date-fns** | Date math without losing my mind |

## Getting Started

```bash
# clone it
git clone https://github.com/hridaydevkar/habit-tracker.git
cd habit-tracker

# install deps
npm install

# run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                   # Next.js app router pages
│   ├── page.tsx           # Today dashboard
│   ├── stats/             # Charts & analytics
│   ├── calendar/          # Monthly calendar view
│   ├── achievements/      # Badge collection
│   └── settings/          # Theme, sounds, data export
├── components/            # Reusable UI components
│   ├── HabitCard.tsx      # Individual habit card
│   ├── AddHabitModal.tsx  # Add habit (templates + custom)
│   ├── BottomNav.tsx      # Tab navigation
│   └── ...
├── lib/                   # Business logic & state
│   ├── HabitContext.tsx   # Global state (React Context)
│   ├── storage.ts         # localStorage persistence
│   ├── habitTemplates.ts  # Pre-built habit templates
│   └── ThemeProvider.tsx  # Theme management
└── types/                 # TypeScript type definitions
```

## Features in Detail

### Gamification

The whole point is making habit tracking feel rewarding. Every completion earns XP, longer streaks give bonus points, and there are 15+ achievements to unlock. The level system goes from "Seedling" to "Transcendent" — silly, but it works.

### Smart Nudges

The app shows contextual messages based on what's happening — streak warnings if you might break one, motivational quotes, and daily challenges. Can be turned off in settings if they get annoying.

### Data Portability

Everything's stored locally. You can export all your data as JSON from Settings and import it on another device. No vendor lock-in.

## Deploy

This is a standard Next.js app. Easiest way to deploy:

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Click deploy

It'll auto-detect Next.js and handle everything. Takes about 60 seconds.

## License

MIT — do whatever you want with it.

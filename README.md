# HabitFlow 🌱

A gamified micro-habit tracker that makes building daily routines actually fun. Track streaks, earn achievements, and watch your progress grow — all from your browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Live Demo

**[Try HabitFlow →](https://hridaydevkar.github.io/habit-tracker/)**

## ✨ What is this?

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

## 🛠 Tech Stack

| What | Why |
|------|-----|
| **Next.js 16** | App router, server components, great DX |
| **TypeScript** | Keeps things sane as the codebase grows |
| **Tailwind CSS 4** | Fast styling without fighting CSS files |
| **Framer Motion** | Smooth animations that don't feel janky |
| **Recharts** | Charts that actually look good |
| **Lucide Icons** | Clean, consistent icon set |
| **date-fns** | Date math without losing my mind |
| **DnD Kit** | Drag-and-drop habit reordering |

## 🚀 Getting Started

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
📦 Build for production

```bash
npm run build
npm start
```

### 🌐 Deploy to GitHub Pages

This project is configured for GitHub Pages deployment. Push to main branch and GitHub Actions will automatically deploy.

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The site will be available at `https://yourusername.github.io/habit-tracker/`

## 📁
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
│  🎯 Features in Detail

### 🎮 Gamification

The whole point is making habit tracking feel rewarding. Every completion earns XP, longer streaks give bonus points, and there are 15+ achievements to unlock. The level system goes from "Seedling" to "Transcendent" — silly, but it works.

### 💡 Smart Nudges

The app shows contextual messages based on what's happening — streak warnings if you might break one, motivational quotes, and daily challenges. Can be turned off in settings if they get annoying.

### 📊 Data Portability

Everything's stored locally. You can export all your data as JSON from Settings and import it on another device. No vendor lock-in.

### 🎨 Customization

- Choose from emerald, amber, or purple color themes for each habit
- 16+ icons to personalize habits
- Dark mode and light mode (with a cozy pink theme)
- Drag-and-drop to reorder habits

### 📱 Progressive Web App

Install HabitFlow on your phone or desktop like a native app. Works offline, sends reminders, and feels native.

## 🤝 Contributing

Contributions are welcome! Please check out the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

### Local Development Setup

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Create a branch: `git checkout -b feature/your-feature`
4. Make your changes and test thoroughly
5. Commit: `git commit -m "Add your feature"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

## 📄 License

MIT — do whatever you want with it. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with inspiration from:
- **Duolingo** - for streak psychology
- **Streaks** - for minimal iPhone design
- **Habitica** - for gamification ideas

## 📬 Contact

Created by [@hridaydevkar](https://github.com/hridaydevkar)

Found a bug? Have a feature request? [Open an issue](https://github.com/hridaydevkar/habit-tracker/issues)!

## ⭐ Star History

If you find this project useful, consider giving it a star! ⭐

---

**Made with 🌱 for building better habits**
This is a standard Next.js app. Easiest way to deploy:

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Click deploy

It'll auto-detect Next.js and handle everything. Takes about 60 seconds.

## License

MIT — do whatever you want with it.

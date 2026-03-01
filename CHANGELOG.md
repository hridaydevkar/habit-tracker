# Changelog

All notable changes to HabitFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-01

### 🎉 Initial Public Release

#### ✨ Features

**Core Functionality**
- One-tap habit completion with animated checkmark and confetti
- Streak tracking with fire emoji escalation (🔥 → 🔥🔥 → 🔥🔥🔥)
- XP and leveling system (Seedling → Transcendent)
- 15 pre-built habit templates across multiple categories
- Custom habit creation with 16+ icons and 3 color themes

**Visualization**
- Daily progress ring with contextual motivational messages
- Weekly and monthly completion charts (bar and area charts)
- Calendar view with color-coded completion dots
- Per-habit statistics and completion rates

**Gamification**
- 15+ achievement badges (bronze, silver, gold tiers)
- Streak bonus XP multipliers (7-day, 14-day, 30-day)
- Full-screen confetti celebrations on milestones
- Level progression with nature-based rank names

**User Experience**
- Dark mode and warm pink light mode
- Drag-and-drop habit reordering
- Swipe-to-complete on mobile
- Responsive design (320px to 1440px)
- PWA support (install as native app)
- Offline functionality

**Data Management**
- Local-first (all data in localStorage)
- JSON export/import for data portability
- No accounts, no backend, no tracking
- Cross-device data transfer via export

#### 🎨 Design
- Emerald, amber, and purple color system
- Framer Motion animations (200-700ms timing)
- Inter font family with 8px grid system
- Tailwind CSS 4 with custom configuration

#### 🔧 Technical
- Next.js 16 with App Router
- TypeScript for type safety
- React Context for state management
- Recharts for data visualization
- DnD Kit for drag-and-drop
- date-fns for date manipulation

#### 📱 Progressive Web App
- Installable on mobile and desktop
- Offline support with service worker
- Home screen icons (multiple sizes)
- Manifest.json configuration

#### ♿ Accessibility
- WCAG AA contrast ratios
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators on interactive elements
- 44×44px minimum touch targets

---

## [Unreleased]

### 🚀 Planned Features
- Habit groups/categories
- Weekly/monthly goals
- Browser notification reminders
- Habit notes and reflections
- More achievement types
- Additional chart visualizations
- Data sync (optional cloud backup)

### 🐛 Known Issues
None currently reported

---

## How to Update

HabitFlow is a client-side app, so updates are automatic when you refresh the page (or when PWA updates in background).

To check your version:
1. Open the app
2. Go to Settings
3. Scroll to bottom - version number is displayed

---

**Legend:**
- ✨ Features - New functionality
- 🐛 Bug Fixes - Fixed issues
- 🎨 Style - Visual/UI improvements
- ⚡ Performance - Speed improvements
- ♻️ Refactor - Code cleanup
- 📝 Docs - Documentation updates
- 🔧 Chore - Tooling/config changes
- 💥 Breaking - Breaking changes
- ♿ Accessibility - A11y improvements

---

[1.0.0]: https://github.com/hridaydevkar/habit-tracker/releases/tag/v1.0.0

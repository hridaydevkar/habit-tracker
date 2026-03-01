# Contributing to HabitFlow 🌱

Thanks for considering contributing to HabitFlow! This document will help you get started.

## 🎯 Ways to Contribute

- 🐛 **Report bugs** - Found something broken? Open an issue!
- ✨ **Suggest features** - Have an idea? We'd love to hear it!
- 📝 **Improve docs** - Typos, clarity, examples - all appreciated
- 💻 **Write code** - Bug fixes, new features, performance improvements
- 🎨 **Design** - UI/UX improvements, icons, animations

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- npm or yarn
- Git basics
- Familiarity with React/Next.js

### Local Setup

1. **Fork the repository**
   - Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/habit-tracker.git
   cd habit-tracker
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript** - Use TypeScript for all new code
- **Formatting** - Code is formatted with ESLint
- **Naming**:
  - Components: PascalCase (`HabitCard.tsx`)
  - Functions: camelCase (`calculateStreak`)
  - Constants: UPPER_SNAKE_CASE (`MAX_STREAK_BONUS`)

### Component Guidelines

```typescript
// ✅ Good
export function HabitCard({ habit, onToggle }: HabitCardProps) {
  return (
    <div className="rounded-2xl border p-5">
      {/* ... */}
    </div>
  );
}

// ❌ Avoid
export default function Card(props) {
  return <div style={{ borderRadius: '16px' }}>{/* ... */}</div>;
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add weekly goal setting
fix: streak calculation bug on timezone change
docs: update installation instructions
style: adjust button padding for mobile
refactor: extract habit validation logic
perf: optimize chart rendering for large datasets
test: add tests for achievement unlock logic
```

### Testing

Before submitting a PR:

1. **Test locally**
   - Create multiple habits
   - Mark as complete/incomplete
   - Check charts, calendar, achievements
   - Test on mobile viewport (Chrome DevTools)

2. **Test edge cases**
   - Empty state (no habits)
   - Long habit names (40+ characters)
   - Many habits (50+)
   - Past dates (time zones)

3. **Accessibility**
   - Keyboard navigation works
   - Screen reader friendly (use ARIA labels)
   - Color contrast meets WCAG AA standards

## 🔧 Project Structure

```
src/
├── app/                   # Next.js pages (Today, Stats, Calendar, etc.)
├── components/            # Reusable UI components
├── lib/                   # Business logic & utilities
│   ├── HabitContext.tsx   # Global state management
│   ├── storage.ts         # LocalStorage wrapper
│   └── habitTemplates.ts  # Pre-built habit templates
└── types/                 # TypeScript definitions
```

### Key Files

- `HabitContext.tsx` - All habit state and operations
- `storage.ts` - Data persistence layer
- `HabitCard.tsx` - Individual habit UI
- `AddHabitModal.tsx` - Habit creation modal

## 🐛 Reporting Bugs

**Before opening an issue:**
- Search existing issues to avoid duplicates
- Test in the latest version
- Try in a different browser if possible

**Include in your bug report:**
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos (if applicable)
- Browser/OS version
- Console errors (F12 → Console tab)

Example:
```markdown
**Bug**: Streak counter doesn't update after midnight

**Steps**:
1. Complete a habit at 11:50 PM
2. Wait until 12:05 AM (next day)
3. Refresh the page
4. Streak shows same number instead of incrementing

**Expected**: Streak should be +1
**Actual**: Streak stays the same

**Browser**: Chrome 120, macOS Sonoma
**Console**: No errors
```

## ✨ Suggesting Features

**Good feature requests include:**
- Clear use case (why is this needed?)
- Proposed solution (how would it work?)
- Alternatives considered
- Mockups/wireframes (if UI-related)

## 🔀 Pull Request Process

1. **Keep PRs focused**
   - One feature/fix per PR
   - Avoid mixing refactoring + new features

2. **Update documentation**
   - README if user-facing changes
   - Code comments for complex logic

3. **Describe your changes**
   ```markdown
   ## What
   Added weekly goal setting feature
   
   ## Why
   Users requested the ability to set weekly targets instead of just daily
   
   ## How
   - Added `weeklyGoal` field to Habit type
   - Updated HabitCard to show weekly progress
   - Added goal input in AddHabitModal
   
   ## Testing
   - Tested with goals of 3, 5, 7 days
   - Progress bar animates correctly
   - Saves/loads from localStorage
   
   ## Screenshots
   [Include screenshot if UI changes]
   ```

4. **Wait for review**
   - Address feedback promptly
   - Be open to suggestions
   - PRs are typically reviewed within 2-3 days

## 💡 Feature Ideas

Not sure what to work on? Here are some ideas:

### Beginner-Friendly
- [ ] Add more habit templates (study, skincare, etc.)
- [ ] More achievement badges
- [ ] Additional chart types
- [ ] Custom streak emoji (not just 🔥)
- [ ] Habit notes/journal integration

### Intermediate
- [ ] Habit groups/categories
- [ ] Weekly/monthly goals
- [ ] Data export to CSV
- [ ] Habit reminders (browser notifications)
- [ ] Habit archiving instead of deletion

### Advanced
- [ ] Habit sharing via URL
- [ ] Backend sync (Firebase/Supabase)
- [ ] Mobile app (React Native)
- [ ] AI habit suggestions
- [ ] Social features (optional, privacy-first)

## 📜 Code of Conduct

### Our Standards

- **Be respectful** - Everyone's learning
- **Be constructive** - Critique ideas, not people
- **Be patient** - Maintainers are volunteers
- **Be inclusive** - Welcome all skill levels

### Unacceptable Behavior

- Harassment, trolling, personal attacks
- Spam, advertising, self-promotion
- Publishing private information without permission

**Enforcement**: Violations may result in a warning, temporary ban, or permanent ban.

## ❓ Questions?

- **Discord**: [Join our community](https://discord.gg/habitflow) (if you create one)
- **Discussions**: Use [GitHub Discussions](https://github.com/hridaydevkar/habit-tracker/discussions)
- **Email**: Open an issue instead (maintainers respond faster there)

## 🙏 Thank You!

Every contribution, no matter how small, makes HabitFlow better. Thanks for being part of the community! 🌱

---

**Happy coding!** 🚀

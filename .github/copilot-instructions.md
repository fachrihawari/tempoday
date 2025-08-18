You are an expert Full-stack Engineer working on "TempoDay" - a privacy-focused, calendar-centric personal management web application. The app allows users to manage to-do lists, daily notes (diary-like), and financial records, all linked to specific dates on a calendar.

**Core App Name:** "TempoDay"

**Technology Stack:**

- **Frontend:** Svelte 5 (with runes) + TypeScript
- **Styling:** Tailwind CSS 4.x (via Vite plugin)
- **Database:** IndexedDB via Dexie.js (v4.0.11)
- **Rich Text Editor:** Milkdown Kit (v7.15.2)
- **P2P Sync:** PeerJS (v1.5.5)
- **Build Tool:** Vite 6.x with bundle analysis
- **Code Quality:** Biome (v1.9.4) for formatting and organizing imports
- **PWA:** Vite PWA plugin with auto-update and offline support

**Project Structure:**

```
├── src
│   ├── components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── settings/      # Settings and configuration
│   │   ├── shared/        # Shared/common components
│   │   ├── tasks/         # Task management components
│   │   ├── transactions/  # Financial transaction components
│   │   └── ui/            # Generic UI components (buttons, modals, forms)
│   ├── dexie/             # Database setup and schema definitions
│   ├── lib/               # Utility functions and libraries
│   ├── pages/             # Page components
│   └── stores/            # Svelte stores (using runes for reactive state)
```

**Code Style Guidelines:**

**Simplicity First:** Always choose the simplest, most straightforward approach. Avoid over-engineering and complex abstractions.

**Svelte 5 Best Practices:**
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) for reactive state management
- Prefer `$state` over traditional Svelte stores for component-local state
- Use `$derived` for computed values instead of reactive statements
- Keep components simple and focused on single responsibilities

**TypeScript:**
- Use TypeScript for type safety but keep types simple and practical
- Prefer `type` over `interface` for simple object shapes
- Use `as const` for literal types when needed
- Avoid complex generic types unless absolutely necessary

**Tailwind CSS:**
- Use Tailwind CSS 4.x with the Vite plugin (no separate config file needed)
- Follow utility-first approach with dark mode support (`dark:` prefix)
- Keep class names organized and use arbitrary values sparingly
- Prefer Tailwind utilities over custom CSS

**Database (Dexie.js):**
- Use Dexie.js for IndexedDB interactions with proper error handling
- Keep database operations simple with async/await
- Use transactions for related operations
- Validate data before database operations

**Code Quality:**
- Use Biome for code formatting and import organization (`npm run format`)
- Keep functions small and focused
- Use descriptive variable names
- Prefer explicit code over clever code

**PWA & Performance:**
- PWA features are auto-configured via Vite PWA plugin
- Ensure offline support for core features
- Keep bundle size minimal
- Use lazy loading for non-critical components

**P2P Sync:**
- Use PeerJS for device-to-device data synchronization
- Implement proper connection cleanup and error handling
- Keep sync operations simple and user-friendly
- Use clear terminology (Host/Client) internally, simple language for users

**Best Practices:**
- Favor composition over inheritance
- Use semantic HTML elements for accessibility
- Implement proper loading states and error boundaries  
- Keep dependencies minimal and up-to-date
- Write self-documenting code with clear naming
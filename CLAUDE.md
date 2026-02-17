# CLAUDE.md

> Keep this file concise. Prune stale info regularly. Max ~80 lines.

## Project

AI-Dash: React/TypeScript UX prototype for an AI-powered analytics dashboard. Uses mock pattern-matching (no real LLM). CRA-based, no backend.

## Tech Stack

- React 19 + TypeScript (CRA, react-scripts 5)
- Recharts 3 (line, bar, area, pie, custom funnel charts)
- lucide-react (icons), html2canvas (PNG export), date-fns (formatting)

## Commands

- `npm start` - dev server on :3000
- `npm run build` - production build
- `npm test` - jest tests (38 tests across 9 suites)
- `npm run lint` - ESLint
- `npm run format` - Prettier
- `npm run typecheck` - TypeScript type check

## Structure

```
src/
  components/   - 8 React components (UI layer + ErrorBoundary)
  data/         - 4 JSON mock datasets (sales, customers, inventory, analytics)
  hooks/        - Custom hooks (useSessionManager, useViewManager, useQueryHandler, useDarkMode, useKeyboardShortcuts, useLocalStorage)
  services/     - mockAI.ts (query pattern-matching engine, 20+ patterns)
  types/        - index.ts (all TypeScript interfaces)
  utils/        - id.ts (shared generateId)
  App.tsx       - Root component, composes hooks
  App.css       - All styles with CSS custom properties, dark mode support
```

## Architecture

- **State**: Custom hooks (`useSessionManager`, `useViewManager`, `useQueryHandler`) manage state
- **Flow**: QueryInput -> ViewTab.handleSubmit -> useQueryHandler -> mockAI.processQuery -> ResponseCard -> ChartRenderer
- **Sessions**: Multi-session, multi-tab (views). Persisted to localStorage (debounced)
- **Responses**: type='chart'|'text'|'mixed', each has optional chart/text/explanation/interpretation
- **IDs**: Generated via shared `src/utils/id.ts`
- **Dark mode**: CSS custom properties + `data-theme="dark"` attribute, toggle via `useDarkMode`
- **Keyboard shortcuts**: Cmd+N (new session), Cmd+T (new view)

## Key Types (src/types/index.ts)

- `ChatSession` > `View[]` > `ConversationMessage[]` > `ResponseMessage`
- `ChartData`: type, `Record<string, string | number>[]`, xKey, yKey, title

## Docs

- **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)** — 5-phase improvement roadmap (all phases implemented)

## Working Agreements

- **Always update this file** when making structural changes. Keep it under ~80 lines.

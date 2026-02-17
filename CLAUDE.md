# CLAUDE.md

> Keep this file concise. Prune stale info regularly. Max ~80 lines.

## Project

AI-Dash: Pluggable AI-powered analytics dashboard. Supports mock pattern-matching and real LLM providers (OpenAI, Anthropic). CRA-based, no backend. First-run setup wizard configures LLM + data source.

## Tech Stack

- React 19 + TypeScript (CRA, react-scripts 5)
- Recharts 3 (line, bar, area, pie, scatter, stackedBar, treemap, funnel, KPI, table)
- lucide-react (icons), html2canvas (PNG export), date-fns (formatting)
- papaparse (CSV), xlsx (Excel, dynamic import), fetch-based LLM providers

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
  adapters/     - Data source adapters (json, upload, api)
  components/   - 17 React components (UI, SetupWizard, CommandPalette, FileUpload, PinnedPanel, DataStory, etc.)
  config/       - App config, LLM provider interface, provider adapters (openai, anthropic), data sources, theme
  data/         - 4 JSON mock datasets (sales, customers, inventory, analytics)
  hooks/        - Custom hooks (useSessionManager, useViewManager, useQueryHandler, useTheme, useKeyboardShortcuts, useLocalStorage, useSetupState, useCommandPalette)
  services/     - mockAI.ts (25+ patterns), aiService.ts (async LLM abstraction)
  types/        - index.ts (all TypeScript interfaces)
  utils/        - id.ts, fileParsing.ts, conversationIO.ts, storyGenerator.ts, workflowIO.ts
  widget/       - Embeddable AIDashWidget component + config
  App.tsx       - Root component, composes hooks
  App.css       - All styles with CSS custom properties, dark mode support
```

## Architecture

- **State**: Custom hooks (`useSessionManager`, `useViewManager`, `useQueryHandler`) manage state
- **Flow**: QueryInput -> ViewTab.handleSubmit -> useQueryHandler -> aiService.processQueryAsync -> LLMProvider -> ResponseCard -> ChartRenderer
- **LLM Config**: `src/config/` — env vars + localStorage runtime config (setup wizard). Provider factory creates mock/openai/anthropic
- **Sessions**: Multi-session, multi-tab (views). Persisted to localStorage (debounced). Export/import as JSON/Markdown
- **Responses**: type='chart'|'text'|'mixed', each has optional chart/text/explanation/interpretation/followUpSuggestions
- **IDs**: Generated via shared `src/utils/id.ts`
- **Theming**: CSS custom properties + `data-theme="dark"` + optional `public/theme.json` for branding, managed by `useTheme`
- **Keyboard shortcuts**: Cmd+N (new session), Cmd+T (new view), Cmd+K (command palette)
- **Data sources**: Adapter pattern (json, upload, api). CSV/Excel upload with column type inference
- **Pinned charts**: Side panel with pinned chart comparisons per view

## Key Types (src/types/index.ts)

- `ChatSession` > `View[]` > `ConversationMessage[]` > `ResponseMessage`
- `ChartData`: type (line|bar|area|pie|funnel|scatter|kpi|stackedBar|table|treemap), data[], xKey, yKey, title
- `UploadedDataset`, `PinnedChart`, `DataStory`, `Workflow`, `ViewContext`

## Docs

- **[docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md)** — 5-phase improvement roadmap (all phases implemented)

## Working Agreements

- **Always update this file** when making structural changes. Keep it under ~80 lines.

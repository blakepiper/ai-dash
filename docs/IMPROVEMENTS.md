# AI-Dash Improvement Roadmap

> Prioritized, 5-phase plan. Phases 1–3–5 are sequential; Phase 4 runs in parallel after Phase 2.

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 5
                │
                └──► Phase 4 (parallel)
```

---

## Phase 1: Bug Fixes & Quick Wins (~1–2 days)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | CSV export corrupts fields containing commas, quotes, or newlines | `ResponseCard.tsx:26-41` | Wrap each field in `"…"`, escape inner quotes as `""`, guard against empty `data[]` |
| 2 | `URL.createObjectURL` memory leak | `ResponseCard.tsx:39` | Call `URL.revokeObjectURL(url)` after triggering the download |
| 3 | Broken default test | `App.test.tsx` | Tests for "learn react" text that doesn't exist — rewrite to render without crashing |
| 4 | Wrong metadata | `public/index.html`, `public/manifest.json` | Title says "React App", manifest says "Create React App Sample" — update to "AI-Dash" |
| 5 | Deprecated `.substr()` | `App.tsx:9`, `mockAI.ts:12` | Replace with `.substring()` |
| 6 | `@types/jest` version mismatch | `package.json` | Update from `^27` to `^29` to match Jest 29 shipped with CRA 5 |

---

## Phase 2: Code Quality & Architecture (~3–5 days)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | Duplicated `generateId()` | `App.tsx`, `mockAI.ts` | Extract to `src/utils/id.ts`, import in both files |
| 2 | `any[]` in `ChartData.data` | `types/index.ts:7` | Replace with `Record<string, string \| number>[]` |
| 3 | Race condition: session-name update and message add are separate `setSessions` calls | `App.tsx:147-172` | Merge into a single `setSessions` updater callback |
| 4 | Near-duplicate chart iteration handlers (~90% identical) | `mockAI.ts:315-399` | Extract a factory function that takes chart type + label |
| 5 | Magic color values repeated everywhere | `App.css` (`#667eea` ×17, `#e0e0e0` ×9, `#333` ×7) | Add `:root` CSS custom properties, replace hardcoded values |
| 6 | Monolithic state in `App.tsx` | `App.tsx` | Extract custom hooks: `useSessionManager`, `useViewManager`, `useQueryHandler` |
| 7 | No error boundaries | — | Add `ErrorBoundary` component wrapping `ViewTab` and `ChartRenderer` |

---

## Phase 3: UX Polish (~4–6 days)

| # | Area | Details |
|---|------|---------|
| 1 | Loading state | Add thinking/typing animation while `processQuery` runs |
| 2 | Destructive action confirmation | Confirm before delete-session and close-tab-with-messages |
| 3 | Message animations | CSS entrance animations for new conversation messages |
| 4 | Mobile sidebar | Collapsible with hamburger menu below 768px |
| 5 | Responsive charts | Replace hardcoded `height={300}` (5 places) with responsive container |
| 6 | Touch delete button | Delete button is hover-only (`App.css:137`) — unreachable on touch devices; add visible alternative |
| 7 | Accessibility | See table below |

### Accessibility sub-items (Phase 3.7)

| Item | Fix |
|------|-----|
| Sidebar | Add `role="listbox"` + `role="option"` to session list |
| Tab bar | Add `role="tablist"` / `role="tab"` / `role="tabpanel"` |
| Query input | Add `<label>` or `aria-label` to textarea |
| Send button | Add `aria-label="Send query"` |
| Color contrast | `#999` on `#1e1e1e` background fails WCAG AA — lighten text to at least `#b0b0b0` |

---

## Phase 4: Testing & CI (~3–4 days, parallel after Phase 2)

| # | Task | Details |
|---|------|---------|
| 1 | `mockAI.ts` unit tests | Cover all 12+ patterns, iteration ("make it a bar chart"), and fallback |
| 2 | Component render tests | Smoke-render all 7 components with minimal props |
| 3 | Integration test | Full query → response flow in `App.test.tsx` |
| 4 | ESLint + Prettier | Add `.eslintrc.json`, `.prettierrc`, `eslint-plugin-jsx-a11y` |
| 5 | Pre-commit hooks | `husky` + `lint-staged` for lint and format on commit |
| 6 | GitHub Actions CI | Workflow: lint → type-check → test → build |

---

## Phase 5: Feature Enhancements (~5–8 days)

| # | Feature | Details |
|---|---------|---------|
| 1 | Session persistence | Save to `localStorage` with debounced writes; handle `Date` serialization |
| 2 | Dark mode | Toggle using CSS custom properties (depends on Phase 2.5) |
| 3 | Keyboard shortcuts | `Cmd+Enter` submit, `Cmd+N` new session, `Cmd+T` new tab |
| 4 | Fuzzy query matching | Token-scoring instead of brittle regex in `mockAI.ts` |
| 5 | More AI patterns | Target 20+: multi-metric, YoY comparison, retention trends, cohort analysis |
| 6 | Empty states | Polished empty-state cards with quick-start suggestions |

---

## Summary

| Phase | Effort | Depends on | Key outcome |
|-------|--------|------------|-------------|
| 1 — Bug Fixes | ~1–2 days | — | Working CSV, no leaks, passing test |
| 2 — Code Quality | ~3–5 days | Phase 1 | Clean types, CSS vars, custom hooks |
| 3 — UX Polish | ~4–6 days | Phase 2 | Mobile-ready, accessible, animated |
| 4 — Testing & CI | ~3–4 days | Phase 2 | Automated quality gates |
| 5 — Features | ~5–8 days | Phase 3 | Persistence, dark mode, shortcuts |

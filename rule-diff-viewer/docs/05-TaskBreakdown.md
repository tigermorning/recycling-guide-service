# Rule Diff Viewer - Task Breakdown

**Version:** 0.1.0

---

## Epic 0: Project Setup

| # | Task | Est. | Depends |
|---|------|------|---------|
| 0.1 | Initialize Vite project with React + TypeScript template | 0.5h | — |
| 0.2 | Install `tshet-uinh` and `tshet-uinh-deriver-tools` | 0.5h | 0.1 |
| 0.3 | Install `zustand`, `purecss` | 0.25h | 0.1 |
| 0.4 | Configure `tsconfig.json` (strict mode, matching ecosystem) | 0.5h | 0.1 |
| 0.5 | Configure ESLint + Prettier | 0.5h | 0.1 |
| 0.6 | Create `src/` directory structure | 0.25h | 0.1 |
| 0.7 | Create placeholder `App.tsx`, verify `pnpm dev` works | 0.5h | 0.2, 0.3 |
| 0.8 | Create `docs/` directory, move planning docs | 0.25h | — |

---

## Epic 1: Script Loader

| # | Task | Est. | Depends |
|---|------|------|---------|
| 1.1 | Create `lib/systems.ts` with system metadata (ID, name, CDN path, category) | 0.5h | — |
| 1.2 | Create `types/index.ts` with `CompiledDeriver`, `SystemId` types | 0.5h | — |
| 1.3 | Implement `engine/loader.ts`: `fetchScript(id)` - fetch from CDN with error handling | 1h | 1.1, 1.2 |
| 1.4 | Implement `engine/loader.ts`: `compileScript(source)` - `new Function` + `推導方案` | 1h | 1.3 |
| 1.5 | Implement `engine/loader.ts`: `createDeriver(id)` - full pipeline, returns `CompiledDeriver` | 0.5h | 1.4 |
| 1.6 | Add script caching (avoid re-fetching on re-comparison) | 0.5h | 1.5 |
| 1.7 | Write unit test: load `tupa.js`, verify output for known position | 1h | 1.5 |
| 1.8 | Write unit test: load `baxter.js`, verify output for known position | 1h | 1.5 |

---

## Epic 2: Comparison Engine

| # | Task | Est. | Depends |
|---|------|------|---------|
| 2.1 | Create `types/index.ts`: `ComparisonResult`, `DifferenceRow` types | 0.5h | 1.2 |
| 2.2 | Implement `engine/comparer.ts`: iterate all positions from `資料.iter音韻地位()` | 0.5h | 2.1 |
| 2.3 | Implement `engine/comparer.ts`: run both derivers, collect results | 0.5h | 2.2 |
| 2.4 | Implement `engine/comparer.ts`: collect representative characters via `資料.query音韻地位()` | 0.5h | 2.3 |
| 2.5 | Implement `engine/comparer.ts`: filter to differences, return `ComparisonResult` | 0.5h | 2.4 |
| 2.6 | Add chunked execution (`setTimeout` chunking) to avoid UI blocking | 1h | 2.5 |
| 2.7 | Verify: compare `tupa` vs `baxter` matches manual deriver comparison | 1h | 2.6, 1.5 |

---

## Epic 3: State Management

| # | Task | Est. | Depends |
|---|------|------|---------|
| 3.1 | Create `store/useStore.ts` with Zustand store skeleton | 0.5h | 2.1 |
| 3.2 | Add system selection state (`systemA`, `systemB`, setters) | 0.25h | 3.1 |
| 3.3 | Add comparison state (`status`, `result`, `error`, `compare` action) | 0.5h | 3.1, 2.6 |
| 3.4 | Add filter state (`filters`, `setFilter`, `resetFilters`) | 0.5h | 3.1 |
| 3.5 | Add derived `filteredRows` selector | 0.5h | 3.3, 3.4 |

---

## Epic 4: UI Components

| # | Task | Est. | Depends |
|---|------|------|---------|
| 4.1 | Implement `App.tsx` layout (header, main content area) | 0.5h | 0.7 |
| 4.2 | Implement `SystemSelector.tsx`: two dropdowns populated from `lib/systems.ts` | 0.5h | 3.2 |
| 4.3 | Implement `CompareButton.tsx`: triggers comparison, shows loading state | 0.5h | 3.3 |
| 4.4 | Implement `StatusBar.tsx`: shows "Showing X of Y positions" | 0.25h | 3.3 |
| 4.5 | Implement `DifferenceTable.tsx`: renders table from `filteredRows` | 1h | 3.5 |
| 4.6 | Implement `FilterBar.tsx`: five dropdowns + reset button | 1h | 3.4 |
| 4.7 | Populate filter options dynamically from comparison result | 0.5h | 4.6, 2.5 |
| 4.8 | Add proper font stacks (Charis SIL for IPA, Noto Serif CJK for Chinese) | 0.5h | 4.5 |

---

## Epic 5: Export

| # | Task | Est. | Depends |
|---|------|------|---------|
| 5.1 | Implement `engine/exporter.ts`: `toCSV(rows, systemNames)` | 1h | 2.1 |
| 5.2 | Implement `ExportButton.tsx`: triggers CSV download | 0.5h | 5.1 |
| 5.3 | Test CSV in Excel and Google Sheets with CJK + IPA characters | 0.5h | 5.2 |

---

## Epic 6: Error Handling & Polish

| # | Task | Est. | Depends |
|---|------|------|---------|
| 6.1 | Add CDN fetch error handling with retry | 0.5h | 1.3 |
| 6.2 | Add script compilation error display | 0.5h | 1.4 |
| 6.3 | Add derivation runtime error handling (skip + count) | 0.5h | 2.5 |
| 6.4 | Add loading spinner/text states | 0.25h | 4.3 |
| 6.5 | Responsive layout for mobile (< 768px) | 1h | 4.1 |
| 6.6 | Cross-browser testing (Chrome, Firefox, Safari) | 1h | 6.5 |

---

## Epic 7: Documentation

| # | Task | Est. | Depends |
|---|------|------|---------|
| 7.1 | Write `README.md` with setup and usage instructions | 0.5h | — |
| 7.2 | Add LICENSE file (MIT, matching ecosystem) | 0.25h | — |
| 7.3 | Add `package.json` description, keywords, repository URL | 0.25h | — |

---

## Task Count Summary

| Epic | Tasks | Total Hours |
|------|-------|-------------|
| 0: Setup | 8 | 3.25h |
| 1: Script Loader | 8 | 6.0h |
| 2: Comparison Engine | 7 | 4.0h |
| 3: State Management | 5 | 2.25h |
| 4: UI Components | 8 | 4.75h |
| 5: Export | 3 | 2.0h |
| 6: Polish | 6 | 3.75h |
| 7: Documentation | 3 | 1.0h |
| **Total** | **48** | **27.0h** |

---

## Critical Path

```
0.1 → 0.2 → 1.1 → 1.3 → 1.4 → 1.5 → 2.2 → 2.5 → 2.6 → 3.3 → 4.3 → 4.5
```

The comparison engine is the critical path. All UI features depend on having a working comparison result to display.

## Risk Areas

| Risk | Mitigation |
|------|-----------|
| `tshet-uinh-deriver-tools` API undocumented | Read source code, test with minimal cases |
| Script compilation fails for some systems | Test each system individually in Phase 1 |
| IPA characters render incorrectly | Use proven font stack from deriver tool |
| 3,800 positions slow on mobile | Chunked execution, test on real devices |

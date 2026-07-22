# Rule Diff Viewer - Development Roadmap

**Version:** 0.1.0

---

## Phase 0: Project Scaffolding (Day 1)

**Goal:** Empty project that builds and runs.

- Initialize Vite + React + TypeScript project
- Install dependencies: `tshet-uinh`, `tshet-uinh-deriver-tools`, `zustand`, `purecss`
- Configure TypeScript, ESLint, Prettier (matching ecosystem conventions)
- Create basic `App.tsx` with placeholder text
- Verify: `pnpm dev` serves the app

**Deliverable:** Blank app running at `localhost:5173`

---

## Phase 1: Script Loader (Day 1-2)

**Goal:** Fetch and compile reconstruction scripts from CDN.

- Implement `engine/loader.ts`:
  - Fetch script from jsDelivr CDN
  - Compile with `new Function()`
  - Wrap in `推導方案`
  - Extract options (for display only, use defaults)
  - Return compiled deriver function
- Create system metadata registry (`lib/systems.ts`)
- Verify: Can load `tupa.js` and `baxter.js`, call each with test positions

**Deliverable:** Two scripts load and produce correct output

---

## Phase 2: Comparison Engine (Day 2-3)

**Goal:** Compare all phonological positions.

- Implement `engine/comparer.ts`:
  - Iterate all positions from `資料.iter音韻地位()`
  - Run both derivers on each position
  - Collect representative characters
  - Filter to differences
  - Return structured `ComparisonResult`
- Implement chunked execution to avoid UI blocking
- Verify: Results match manual comparison in the existing deriver tool

**Deliverable:** Comparison produces correct difference list

---

## Phase 3: UI - Selection and Controls (Day 3-4)

**Goal:** Users can select systems and trigger comparison.

- Create Zustand store
- Implement `SystemSelector` (two dropdowns)
- Implement `CompareButton`
- Implement `StatusBar` (row count)
- Wire to engine: loading → comparison → results
- Verify: Full flow works end-to-end

**Deliverable:** Select systems, click Compare, see results in console

---

## Phase 4: UI - Difference Table (Day 4-5)

**Goal:** Display differences in a table.

- Implement `DifferenceTable` component
- Columns: 代表字, 音韻地位, System A result, System B result
- Proper CJK font handling
- IPA font support (Charis SIL or fallback)
- Verify: Table renders correctly with all differences

**Deliverable:** Formatted table of all differences

---

## Phase 5: Filtering (Day 5)

**Goal:** Filter differences by phonological attributes.

- Implement `FilterBar` component
- Five filter dropdowns: 聲母, 韻, 等, 開合, 聲
- Populate filter options from the difference data
- Apply filters to table rows
- Dynamic row count update
- Verify: Filters correctly reduce visible rows

**Deliverable:** Interactive filtering works correctly

---

## Phase 6: Export (Day 5-6)

**Goal:** Export filtered results as CSV.

- Implement `engine/exporter.ts`
- CSV with UTF-8 BOM
- Proper field quoting
- Download trigger via `Blob` + `URL.createObjectURL`
- Verify: CSV opens correctly in Excel and Google Sheets

**Deliverable:** CSV export produces valid files

---

## Phase 7: Polish and Testing (Day 6-7)

**Goal:** Production-ready quality.

- Error handling for all failure modes
- Loading states
- Responsive layout (mobile)
- Cross-browser testing
- Verify all comparison results against manual deriver output
- README with setup instructions

**Deliverable:** First release candidate

---

## Timeline Summary

| Phase | Days | Key Milestone |
|-------|------|---------------|
| 0 | 1 | Project runs |
| 1 | 1-2 | Scripts load from CDN |
| 2 | 2-3 | Comparison engine works |
| 3 | 3-4 | UI controls work |
| 4 | 4-5 | Table displays results |
| 5 | 5 | Filtering works |
| 6 | 5-6 | CSV export works |
| 7 | 6-7 | Release candidate |

**Total: ~7 working days for MVP**

# Rule Diff Viewer - System Architecture

**Version:** 0.1.0

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser (SPA)                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  UI Layer │  │  State   │  │  Comparison   │  │
│  │ (React)   │──│ (Zustand)│──│    Engine     │  │
│  └──────────┘  └──────────┘  └───────┬───────┘  │
│                                       │          │
│  ┌────────────────────────────────────┴───────┐  │
│  │           tshet-uinh Ecosystem Layer       │  │
│  │                                             │  │
│  │  ┌─────────┐ ┌────────────┐ ┌───────────┐  │  │
│  │  │tshet-   │ │ tshet-uinh-│ │  tshet-   │  │  │
│  │  │uinh-js  │ │ deriver-   │ │  uinh-    │  │  │
│  │  │ (data + │ │ tools      │ │ examples  │  │  │
│  │  │  API)   │ │ (推導方案) │ │ (CDN)     │  │  │
│  │  └─────────┘ └────────────┘ └───────────┘  │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build Tool | Vite 6 | Fast HMR, native ESM, TypeScript support |
| UI Framework | React 19 | Matches existing ecosystem (tshet-uinh-deriver) |
| Language | TypeScript 5.9 | Type safety, matches ecosystem |
| State Management | Zustand | Lightweight, no boilerplate |
| Styling | PureCSS + minimal custom CSS | Matches ecosystem, research-oriented aesthetic |
| Testing | Vitest + Testing Library | Fast, Vite-native |
| Package Manager | pnpm | Fast, strict dependency resolution |

## 3. Dependency Architecture

### 3.1 Direct Dependencies

```
tshet-uinh              ^0.15.0   ← Core library (音韻地位, data iteration, expressions)
tshet-uinh-deriver-tools ^0.2.0   ← 推導方案 class (script compiler/wrapper)
react                   ^19.0.0   ← UI framework
react-dom               ^19.0.0   ← DOM renderer
zustand                 ^5.0.0   ← State management
```

### 3.2 CDN Dependencies (fetched at runtime)

```
tshet-uinh-examples     @main    ← Reconstruction scripts (via jsDelivr CDN)
```

### 3.3 Why This Split

- **npm packages** (tshet-uinh, tshet-uinh-deriver-tools): These are the computation core. They must be bundled and versioned.
- **CDN scripts** (tshet-uinh-examples): These are the reconstruction rules themselves. Loading from CDN means:
  - No need to bundle third-party scripts
  - Users always get the latest versions
  - Each script is loaded on demand

## 4. Module Structure

```
rule-diff-viewer/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component
│   │
│   ├── components/
│   │   ├── SystemSelector.tsx      # Two dropdowns for system A/B
│   │   ├── CompareButton.tsx       # Trigger comparison
│   │   ├── FilterBar.tsx           # Filter controls
│   │   ├── DifferenceTable.tsx     # Results table
│   │   ├── ExportButton.tsx        # CSV export
│   │   └── StatusBar.tsx           # Row count, loading state
│   │
│   ├── engine/
│   │   ├── loader.ts               # Script fetching & compilation
│   │   ├── comparer.ts             # Core comparison logic
│   │   └── exporter.ts             # CSV/LaTeX generation
│   │
│   ├── store/
│   │   └── useStore.ts             # Zustand store
│   │
│   ├── types/
│   │   └── index.ts                # Shared type definitions
│   │
│   └── lib/
│       ├── systems.ts              # System metadata (ID, name, CDN path)
│       └── format.ts               # Text formatting utilities
│
├── docs/
│   ├── 01-PRD.md
│   ├── 02-Architecture.md          # (this file)
│   ├── 03-Wireframe.md
│   ├── 04-Roadmap.md
│   └── 05-TaskBreakdown.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 5. Core Engine Design

### 5.1 Script Loader (`engine/loader.ts`)

```typescript
interface CompiledDeriver {
  id: string;
  name: string;
  derive: (position: 音韻地位) => string;
}

async function loadDeriver(systemId: string): Promise<CompiledDeriver>
```

**Process:**
1. Fetch script source from CDN: `https://cdn.jsdelivr.net/gh/nk2028/tshet-uinh-examples@main/{id}.js`
2. Compile: `new Function("選項", "音韻地位", "字頭", "require", source)`
3. Wrap in `推導方案(rawDeriver)`
4. Call with default options to get derive function
5. Return a function that takes `音韻地位` and returns a plain string

**Key decision:** We flatten `CustomNode[]` results to plain strings for comparison. This is simpler and sufficient for the MVP. The comparison is string-equality based.

### 5.2 Comparison Engine (`engine/comparer.ts`)

```typescript
interface ComparisonResult {
  totalPositions: number;
  differences: DifferenceRow[];
}

interface DifferenceRow {
  position: string;          // e.g. "幫一東平"
  representativeChar: string; // e.g. "東"
  initial: string;           // e.g. "幫"
  rhyme: string;             // e.g. "東"
  division: string;          // e.g. "一"
  openness: string | null;   // e.g. null (labial)
  tone: string;              // e.g. "平"
  resultA: string;           // e.g. "pung"
  resultB: string;           // e.g. "puwng"
}

async function compare(
  systemA: CompiledDeriver,
  systemB: CompiledDeriver,
): Promise<ComparisonResult>
```

**Process:**
1. Get all positions: `Array.from(資料.iter音韻地位())`
2. For each position:
   a. Run both derivers
   b. Get representative character: `資料.query音韻地位(position)`
   c. If results differ, add to differences array
3. Return `ComparisonResult`

**Optimization:** Run comparison in chunks using `requestIdleCallback` or `setTimeout` to avoid blocking the UI thread. Yield every 500 positions.

### 5.3 Filter Engine (inline in store)

Filtering is applied post-computation. The full comparison result is stored, and filters reduce the visible rows:

```typescript
function filterDifferences(
  differences: DifferenceRow[],
  filters: FilterState
): DifferenceRow[]
```

No re-computation needed when filters change.

### 5.4 CSV Exporter (`engine/exporter.ts`)

```typescript
function toCSV(rows: DifferenceRow[]): string
```

- UTF-8 BOM prefix (`\uFEFF`)
- Proper quoting of fields containing commas
- Header row with: 代表字, 音韻地位, 聲母, 韻, 等, 開合, 聲, [System A Name], [System B Name]

## 6. State Management

```typescript
// Zustand store shape
interface AppState {
  // System selection
  systemA: string;           // System ID
  systemB: string;           // System ID
  setSystemA: (id: string) => void;
  setSystemB: (id: string) => void;

  // Comparison state
  status: 'idle' | 'loading' | 'comparing' | 'done' | 'error';
  result: ComparisonResult | null;
  error: string | null;
  compare: () => Promise<void>;

  // Filters
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;

  // Derived
  filteredRows: DifferenceRow[];
}
```

## 7. Error Handling

| Error | Handling |
|-------|----------|
| CDN fetch failure | Retry once, then show "Failed to load system" with retry button |
| Script compilation error | Show "System X failed to compile" with details |
| Derivation runtime error | Skip that position, continue, report count of errors |
| Empty results | Show "No differences found" message |

## 8. Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1s |
| Script load time | < 3s (CDN) |
| Comparison execution | < 5s (3,800 positions × 2 systems) |
| Filter response | < 50ms |
| Bundle size (gzip) | < 300KB |

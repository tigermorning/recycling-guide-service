# Rule Diff Viewer - Product Requirements Document

**Version:** 0.1.0 (MVP)
**Date:** 2026-07-20
**Status:** Draft - Pending Approval

---

## 1. Problem Statement

Historical phonologists studying Middle Chinese regularly compare multiple reconstruction systems (Baxter, Pan Wuyun, unt, Karlgren, etc.). Currently, this comparison is performed manually:

- Running each reconstruction system separately in the existing deriver tool
- Visually scanning through 3,000+ phonological positions to find differences
- Copying results into spreadsheets for analysis
- No way to systematically identify which phonological categories produce divergent results

This workflow wastes weeks of researcher time per project and introduces human error.

## 2. Goal

Build a focused web application that automatically compares two reconstruction systems across all Middle Chinese phonological positions, displays only the differences, and supports filtering and export for academic use.

## 3. Non-Goals

- Generating new reconstructions
- Editing reconstruction rules
- Displaying full reconstruction results (only differences)
- Supporting user-defined custom scripts (MVP)
- Collaboration features
- Backend/server infrastructure

## 4. Target Users

- Graduate students writing theses on Middle Chinese phonology
- Historical linguists comparing reconstruction frameworks
- Researchers preparing publications that reference multiple systems

## 5. Functional Requirements

### FR-1: Reconstruction System Selector

**Description:** Two dropdown selectors allow users to choose reconstruction systems for comparison.

**Available systems (hardcoded from tshet-uinh-examples CDN):**

| ID | Display Name | Category | Source File |
|----|-------------|----------|-------------|
| `tupa` | Tshet-uinh Pinyin (切韻拼音) | Romanization | `tupa.js` |
| `baxter` | Baxter (1992/2014) | Romanization | `baxter.js` |
| `unt` | unt (当代拟音) | Reconstruction | `unt.js` |
| `panwuyun` | Pan Wuyun (潘悟雲) | Reconstruction | `panwuyun.js` |
| `karlgren` | Karlgren (高本漢) | Reconstruction | `karlgren.js` |
| `wangli` | Wang Li (王力) | Reconstruction | `wangli.js` |
| `msoeg_v8` | msoeg (V8) | Reconstruction | `msoeg_v8.js` |

**Behavior:**
- System A defaults to `tupa`; System B defaults to `baxter`
- Users cannot select the same system for both A and B
- Each system's options are set to defaults (no custom configuration in MVP)

### FR-2: Compare

**Description:** When the user triggers comparison, the application:

1. Loads both reconstruction scripts from CDN
2. Compiles them with default parameters
3. Iterates all phonological positions from `tshet-uinh` data
4. Runs both derivers on each position
5. Filters to positions where results differ
6. Displays the difference table

**Trigger:** Click the "Compare" button.

**Performance requirement:** Complete within 5 seconds on a modern browser for all ~3,800 positions.

### FR-3: Difference Table

**Description:** A table showing only positions where the two systems produce different results.

**Columns:**

| Column | Content | Example |
|--------|---------|---------|
| 代表字 | Representative character (from Guangyun) | 東 |
| 音韻地位 | Phonological position description | 幫一東平 |
| System A | Reconstruction result | `pung` |
| System B | Reconstruction result | `puwng` |

**Sorting:** By phonological position (ascending, canonical order).

**Row count:** Displayed above the table (e.g., "Found 847 differences out of 3,842 positions").

### FR-4: Filtering

**Description:** Users can filter the difference table by phonological attributes.

**Filter controls (one row of dropdowns above the table):**

| Filter | Options | Default |
|--------|---------|---------|
| 聲母 (Initial) | All 38 initials + "All" | All |
| 韻 (Rhyme) | All ~60 rhymes + "All" | All |
| 等 (Division) | 一, 二, 三, 四, All | All |
| 開合 (Openness) | 開, 合, 中立, All | All |
| 聲 (Tone) | 平, 上, 去, 入, All | All |

**Behavior:**
- Filters are AND-combined
- Changing any filter immediately updates the table (no re-computation needed)
- A "Reset" button clears all filters
- Row count updates dynamically

### FR-5: Export

**Description:** Export the currently displayed (filtered) table.

**Formats:**
- **CSV** (required): Comma-separated values with UTF-8 BOM for Excel compatibility
- **LaTeX** (optional, stretch goal): `tabular` environment with IPA-safe encoding

**Trigger:** "Export CSV" button above the table.

## 6. Non-Functional Requirements

### NFR-1: Accuracy

All reconstruction results must exactly match the output of the original scripts when called with default parameters. No linguistic rules may be invented or modified.

### NFR-2: Offline Support

After initial load, the application should function offline if scripts have been cached by the browser.

### NFR-3: Accessibility

- Keyboard navigable
- Screen reader compatible table headers
- High contrast mode support

### NFR-4: Browser Support

- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+

## 7. Data Flow

```
CDN (jsDelivr)                    Browser
─────────────                    ───────
tshet-uinh-examples/*.js ──────→ Script compilation (new Function)
                                     │
tshet-uinh (npm bundle) ─────────→ 音韻地位 iteration (~3,800 positions)
                                     │
                                     ├→ Derive System A (per position)
                                     ├→ Derive System B (per position)
                                     ├→ Compare results
                                     ├→ Filter differences
                                     └→ Render table / Export CSV
```

## 8. Success Criteria

- Researcher can load the app and compare two systems within 30 seconds
- All differences are correctly identified (verified against manual deriver comparison)
- CSV export opens correctly in Excel with proper UTF-8 encoding
- Total bundle size under 500KB (gzipped)

## 9. Out of Scope for MVP

- Custom script loading
- More than 2 systems compared simultaneously
- Sound correspondence visualization
- Diachronic analysis
- Project/save functionality

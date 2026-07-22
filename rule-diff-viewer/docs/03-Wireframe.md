# Rule Diff Viewer - UI Wireframe

**Version:** 0.1.0

---

## Design Principles

- **No animations.** Everything is instant.
- **No unnecessary graphics.** No logos, no decorative elements.
- **Research-oriented.** Dense information display, minimal whitespace.
- **Monochrome.** Black text on white background. Minimal color usage.
- **Keyboard-first.** All operations accessible via keyboard.

---

## Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│  Rule Diff Viewer                                            │
│                                                              │
│  System A: [▼ Tshet-uinh Pinyin (切韻拼音)    ]             │
│  System B: [▼ Baxter (1992/2014)               ]             │
│                                                              │
│  [ Compare ]                                                 │
│                                                              │
│  ─────────────────────────────────────────────────────────── │
│                                                              │
│  Filter: 聲母 [▼ All]  韻 [▼ All]  等 [▼ All]              │
│          開合 [▼ All]  聲 [▼ All]              [Reset]       │
│                                                              │
│  Showing 847 of 3,842 positions                              │
│  [ Export CSV ]                                              │
│                                                              │
│  ┌──────┬───────────┬──────────────┬──────────────┐          │
│  │ 字   │ 音韻地位   │ 切韻拼音      │ Baxter       │          │
│  ├──────┼───────────┼──────────────┼──────────────┤          │
│  │ 東   │ 幫一東平   │ pung         │ puwng        │          │
│  │ 冬   │ 幫一冬平   │ pung         │ puwng        │          │
│  │ 鐘   │ 幫三鍾平   │ pyung        │ pjuwng       │          │
│  │  ...  │    ...     │    ...       │    ...       │          │
│  └──────┴───────────┴──────────────┴──────────────┘          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Layout (Mobile)

```
┌──────────────────────┐
│  Rule Diff Viewer    │
│                      │
│  A: [▼ Tshet-uinh]  │
│  B: [▼ Baxter    ]  │
│                      │
│  [ Compare ]         │
│                      │
│  ──────────────────  │
│                      │
│  聲母 [▼ All]       │
│  韻   [▼ All]       │
│  等   [▼ All]       │
│  開合 [▼ All]       │
│  聲   [▼ All]       │
│  [Reset]             │
│                      │
│  847 / 3,842        │
│  [Export CSV]        │
│                      │
│  ┌────────┬───────┐ │
│  │ 字     │ 東    │ │
│  │ 地位   │ 幫一東平│ │
│  │ A      │ pung  │ │
│  │ B      │ puwng │ │
│  ├────────┼───────┤ │
│  │ ...    │ ...   │ │
│  └────────┴───────┘ │
└──────────────────────┘
```

## Component Specifications

### Header

- **Text:** "Rule Diff Viewer" in system font, no decoration
- **Font size:** 1.25rem
- **Border-bottom:** 1px solid #ccc

### System Selectors

- Two `<select>` elements, full width on mobile
- Label above each: "System A" / "System B" in small text
- Disabled state: grayed out during comparison

### Compare Button

- Standard button, primary color (#0078e7)
- Text: "Compare"
- During loading: text changes to "Comparing..." (no spinner animation)
- Disabled while loading

### Filter Bar

- Horizontal row of `<select>` elements on desktop
- Stacked on mobile
- Each filter labeled with Chinese phonological term
- "Reset" button to clear all filters
- Filters apply instantly on change (no apply button)

### Difference Table

- Standard HTML `<table>`
- Sticky header row
- Columns: 代表字 | 音韻地位 | [System A Name] | [System B Name]
- Monospace font for reconstruction results (IPA safety)
- Alternating row colors (light gray / white) for readability
- Clicking a row header sorts by that column (stretch goal)

### Status Bar

- Text line: "Showing X of Y positions"
- Below filters, above table
- Minimal styling

### Export Button

- Text: "Export CSV"
- Positioned above the table, right-aligned
- Triggers browser download of `.csv` file

---

## Typography

| Element | Font | Size |
|---------|------|------|
| Title | System sans-serif | 1.25rem |
| Labels | System sans-serif | 0.875rem |
| Table headers | System sans-serif | 0.875rem, bold |
| Table body | System sans-serif | 0.875rem |
| IPA/Reconstructions | Charis SIL, Noto Sans, monospace | 0.875rem |
| CJK characters | Noto Serif CJK, Source Han Serif | 1rem |

## Color Palette

| Element | Color |
|---------|-------|
| Background | `#ffffff` |
| Text | `#333333` |
| Border | `#cccccc` |
| Button primary | `#0078e7` |
| Button text | `#ffffff` |
| Table alternating row | `#f8f8f8` |
| Filter highlight | `#fff3cd` (optional) |

## Interaction States

| State | Visual Treatment |
|-------|-----------------|
| Loading | Button text changes, table hidden, status shows "Loading scripts..." |
| Error | Red text message below the button area |
| Empty (no differences) | Text: "No differences found." |
| Normal | Table displayed with results |

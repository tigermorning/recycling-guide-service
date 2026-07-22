# UX Workflow

This document describes the user experience design for qieyun-compare, including the rationale behind every UX decision.

---

## Design Philosophy

The UX follows three principles:

1. **Researcher-first.** Every design decision is evaluated from the perspective of a historical phonologist, not a software engineer.
2. **Immediate value.** The user should see useful results within 3 seconds of opening the application.
3. **Progressive disclosure.** Basic use requires no configuration. Advanced features are available but not forced.

---

## Primary Workflow

```
Open application
    ↓
Enter a character (or phonological position)
    ↓
Immediately see:
    - Phonological position
    - Comparison table with default systems
    - Visual highlighting of differences
    ↓
(Optional) Adjust comparison systems
    ↓
(Optional) Expand "other characters" section
    ↓
Copy citation / share URL
```

### Why this order?

This workflow was derived from analyzing how researchers actually work:

1. **Researchers begin with a question, not a configuration.** "What is the reconstruction of 東?" not "Let me set up a comparison between Baxter and Pan."
2. **Default systems should be pre-configured.** Most researchers compare the same 3-5 systems repeatedly. Defaults eliminate repetitive setup.
3. **Configuration is a secondary action.** Users change systems only when the defaults are insufficient.

### Rejected alternative: "Choose systems first"

Originally considered: "Select reconstruction systems → Enter character → View comparison."

Rejected because:
- It forces the user to configure before they can see anything.
- It assumes the user knows which systems they want to compare.
- It delays the first moment of value.

---

## Screen Layout

### Screen 1: Search

```
┌──────────────────────────────────────────────┐
│                                              │
│          qieyun-compare                      │
│                                              │
│    ┌──────────────────────────────┐          │
│    │  Enter a character...        │          │
│    └──────────────────────────────┘          │
│                                              │
│    ☐ Karlgren (1926)                         │
│    ☑ Baxter (1992)                           │
│    ☑ Pan (2000)                              │
│    ☑ Zhengzhang (2002)                       │
│    ☑ Baxter-Sagart (2014)                    │
│    ☐ unt (2018)                              │
│    ☐ msoeg (2021)                            │
│                                              │
│    [Compare]                                 │
│                                              │
└──────────────────────────────────────────────┘
```

**Design notes:**
- The search field is the dominant element.
- System checkboxes are visible but secondary.
- Default systems are pre-checked.
- The "Compare" button is present but the results should also update live as the user types.

### Screen 2: Results

```
┌──────────────────────────────────────────────┐
│                                              │
│  東                                          │
│  音韻地位: 平聲 東韻 一等 合口                │
│  (Source: tshet-uinh dataset)                │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │          Baxter   Pan     Zhengzhang   │  │
│  │ 聲母      t        t       t           │  │
│  │ 韻母      uwng     uŋ      oŋ          │  │
│  │ 성조      平       平       平          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ▶ 이 음운 위치의 다른 문자들 (13개)          │
│                                              │
│  ────────────────────────────────────────    │
│                                              │
│  References:                                 │
│  Baxter (1992): A Handbook of 'Phags-pa...   │
│  Pan (2000): 漢語歷史音韻學...                │
│  Zhengzhang (2002): 上古音系...              │
│                                              │
│  [Copy BibTeX]  [Share URL]                  │
│                                              │
└──────────────────────────────────────────────┘
```

**Design notes:**
- Phonological position is displayed prominently, above the comparison table.
- The comparison table uses visual highlighting for differences.
- "Other characters" section is collapsed by default.
- References are always visible (not hidden behind a link).
- BibTeX copy and URL sharing are one-click actions.

---

## Comparison Table Design

### Visual Highlighting

When most systems show the same value and one or two differ, the differences are highlighted:

```
              Baxter   Pan     Zhengzhang
──────────────────────────────────────────
聲母            t        t       t
韻母            uwng     uŋ      oŋ        ← highlighted
성조            平       平       平
```

**Why this approach instead of a Consensus Score?**

- Visual highlighting requires no algorithm.
- The researcher immediately sees the pattern without needing to understand a scoring system.
- It is honest: it shows what is there, without interpretation.
- A formal Consensus Score could be misleading if the definition of "agreement" is ambiguous.

### Horizontal Scrolling

When many systems are selected (e.g., 9), the table becomes wide. The recommended behavior:
- The first column (feature names) is sticky (does not scroll).
- The system columns scroll horizontally.
- A subtle scroll indicator shows that more columns are available.

---

## Phonological Position Display

The phonological position is displayed as a **primary element**, not a tooltip or footnote.

**Why?**
- Researchers care about the phonological position more than the character.
- The phonological position tells the researcher what the character "means" in phonological terms.
- It is the basis for comparison across characters.

**Format:**

```
東
音韻地位: 平聲 東韻 一等 合口
(Source: tshet-uinh dataset)
```

The source attribution ("According to tshet-uinh dataset") is important for academic honesty. The tool does not claim to determine the phonological position; it reports the dataset's classification.

---

## Other Characters Section

**Behavior:** Collapsed by default. Expands on click.

**Why collapsed?**
- Not every researcher needs to see all characters in a phonological position.
- Showing 13 characters immediately adds visual noise.
- Researchers who need this information will look for it and find it.

**When expanded:**

```
▶ 이 음운 위치의 다른 문자들 (13개)
  東 同 銅 童 桐 瞳 筒 彤 筍 中 衷 忠 衆
```

Each character is clickable. Clicking reloads the comparison for that character.

---

## Default Systems

### Why these defaults?

| System | Year | Why included as default |
|--------|------|------------------------|
| Baxter | 1992 | Most cited in English-language papers |
| Pan | 2000 | Most cited in Chinese-language papers |
| Zhengzhang | 2002 | Major independent Chinese system |
| Baxter-Sagart | 2014 | Latest major system; increasingly cited |

These 4 systems represent the current "core" of Middle Chinese reconstruction scholarship. A researcher who compares only these 4 systems is covering the most influential perspectives.

### Customization

Users can change defaults via a settings panel. Custom defaults are stored in browser local storage. No account is required.

---

## URL Sharing

Comparison results should be shareable via URL:

```
https://qieyun-compare.example.com/?char=東&systems=baxter,pan,zhengzhang,baxter-sagart
```

**Why?**
- Researchers share results with colleagues.
- Papers can include links to specific comparisons.
- Conference presentations can demonstrate the tool with pre-built examples.

---

## Error States

### Character not found

```
"동" was not found in the dataset.
This may be because:
- The character is not in the Guangyun
- The character is a variant form (try the standard form)
```

### No data for a system

```
Baxter-Sagart (2014): No data available for this phonological position.
This may be because the reconstruction does not cover this position.
```

### Ambiguous reading

```
行 has multiple readings:
1. 平聲 庚韻 二等 開口 (háng - "row")
2. 去聲 映韻 二等 開口 (xíng - "walk")

Please select which reading you want to compare.
```

---

## Accessibility Considerations

- Color is not the only way to indicate differences (use bold text or symbols as well).
- The comparison table is keyboard-navigable.
- Screen reader support for the phonological position display.
- Sufficient color contrast for highlighting.

---

## Mobile Considerations (Post-MVP)

The MVP is desktop-first. However, the design should not preclude mobile adaptation:

- The comparison table should be responsive (stack vertically on small screens).
- The search field should be prominent on mobile.
- Touch-friendly targets for system selection.

---

## Unresolved UX Questions

1. **Live search vs. button press.** Should results update as the user types, or only after pressing Enter/Compare? Live search is more responsive but may cause performance issues with large datasets.

2. **Pagination for phonological positions.** When browsing by phonological position (not character), how should large result sets be paginated?

3. **Export formats.** Beyond BibTeX, what export formats would researchers find useful? CSV? LaTeX table? HTML?

4. **Dark mode.** Is dark mode important for academic users who work late? Probably not a priority, but should not be precluded by the design.

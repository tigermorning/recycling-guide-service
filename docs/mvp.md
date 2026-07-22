# MVP — Minimum Viable Product

This document describes the philosophy, scope, and design of the qieyun-compare MVP.

---

## MVP Philosophy

The MVP follows three principles:

1. **Solve one problem extremely well.** The problem is: "How do multiple reconstruction systems reconstruct this phonological position?"

2. **Do not solve adjacent problems.** Rule graphs, timelines, AI analysis, and research databases are separate future projects.

3. **Data quality over feature quantity.** A tool with 4 accurately represented reconstruction systems is more valuable than a tool with 9 poorly represented systems.

---

## What the MVP Does

When a user opens the application:

1. They see a search field.
2. They enter a Chinese character (or phonological position).
3. They immediately see:
   - The phonological position of that character (e.g., 平聲 東韻 一等 合口)
   - A comparison table showing how each selected reconstruction system reconstructs that position
   - Visual highlighting of differences
   - Source/citation information

4. Optionally, they can:
   - Change which reconstruction systems are compared
   - Expand a collapsible section showing other characters in the same phonological position
   - Configure default comparison systems for future visits

---

## What the MVP Does NOT Do

| Feature | Why excluded |
|---------|-------------|
| Rule Graph | Different tool, different repository |
| Timeline Explorer | Different tool, different repository |
| AI Analysis | Different tool, different repository |
| Automatic Consensus Score | Too complex for MVP; visual highlighting achieves 80% of the value |
| Adjacent phonological navigation | Nice-to-have; can be added after initial release |
| Mobile optimization | Desktop-first for academic use |
| User accounts | Not needed for initial release; local storage for preferences |

---

## Input Design

### Primary Input: Character

The most natural entry point for researchers. A text field accepting a single Chinese character.

### Alternative Input: Phonological Position

For researchers who want to explore a phonological position without a specific character in mind. Dropdown selectors for:
- 聲母 (initial)
- 韻母 (final/rhyme)
- 等 (division)
- 開合 (open/closed mouth)
- 聲調 (tone)

This is a secondary input mode, not the default.

### Why character-first?

Researchers typically begin with a specific character. The question "What is the reconstruction of 東?" is more common than "Show me all characters in 東韻." The phonological position selectors are available for the latter use case but are not the primary interface.

---

## Output Design

### Phonological Position Display

Displayed prominently above the comparison table:

```
東
音韻地位: 平聲 東韻 一等 合口
(Source: tshet-uinh dataset)
```

This is not a footnote. It is a primary piece of information.

### Comparison Table

Each column represents one reconstruction system. Each row represents one phonological feature.

```
              Karlgren   Wang Li   Baxter   Pan      Zhengzhang   B-S
─────────────────────────────────────────────────────────────────────
聲母 (Initial)  t          t        t        t        t            t
韻母 (Final)    uŋ         uŋ       uwng     uŋ       oŋ           uŋ
聲調 (Tone)     平         平       平       平        平           平
```

Differences are highlighted visually (e.g., colored background, bold text).

### Why this format?

- Each system is a column: allows horizontal comparison
- Each feature is a row: allows vertical comparison within a system
- Visual highlighting: researcher immediately sees where systems disagree
- No summary score: avoids the complexity of defining "agreement"

### Source/Reference Information

Below the comparison table, each system's citation is displayed:

```
Baxter (1992): A Handbook of 'Phags-pa Chinese. Leiden: Brill.
Pan (2000): 漢語歷史音韻學. Shanghai: Shanghai Jiaoyu Chubanshe.
```

BibTeX block available for copy-paste into LaTeX documents.

### Same-Phonological-Position Characters (Collapsible)

```
▶ 이 음운 위치의 다른 문자들 (13개)
  東 同 銅 童 桐 瞳 筒 彤 筍 中 衷 忠 衆
```

Collapsed by default. Expands on click. Each character is clickable (reloads comparison).

---

## Default Reconstruction Systems

When the user first opens the application, the following systems are pre-selected:

| System | Year | Rationale for inclusion |
|--------|------|------------------------|
| Baxter | 1992 | Most widely cited in English-language scholarship |
| Pan Wuyun | 2000 | Most widely cited in Chinese-language scholarship |
| Zhengzhang Shangfang | 2002 | Major independent Chinese system |
| Baxter-Sagart | 2014 | Latest major English-language system |

These defaults represent the current scholarly consensus on which systems are most commonly cited in academic papers.

Users can customize defaults via a settings panel. Custom defaults are stored in browser local storage.

---

## Unresolved MVP Questions

1. **How to handle 多音字?** When a character has multiple readings, should the tool show all readings, the most common reading, or prompt the user to select? Recommendation: show all readings with labels, let the user select.

2. **Horizontal scrolling behavior.** When many systems are selected, the table becomes wide. Should it scroll horizontally, wrap to multiple rows, or use a different layout? Needs UX testing.

3. **Error states.** What should the tool show when:
   - The character is not in the dataset?
   - A reconstruction system has no data for this phonological position?
   - The phonological position is ambiguous?

4. **Loading performance.** How quickly should results appear? Target: under 2 seconds for a character lookup.

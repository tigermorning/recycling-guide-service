# Roadmap

This document describes the project roadmap across three phases: Project 0 (Data Audit), Project 1 (qieyun-compare MVP), and Future Companion Projects.

Each phase is clearly separated. Do not mix them.

---

## Phase Overview

```
Project 0: Data Audit          (Weeks 1-4)
Project 1: qieyun-compare MVP  (Weeks 3-10)
Future:    Companion Projects   (After MVP success)
```

Project 0 and Project 1 overlap slightly. The Data Audit for core systems finishes before MVP development begins, but the audit continues for additional systems during MVP development.

---

## Project 0: Data Audit

**Duration:** 2-4 weeks (core), then continuous
**Deliverable:** Structured data repository with verified reconstruction datasets
**Visibility:** Internal (not published as a standalone tool)

### Purpose

Before writing any code, investigate every candidate reconstruction system to determine:

- Whether digital data exists
- The source of the data
- Legal reuse status
- Data completeness
- Conversion feasibility to IPA
- Relationship to existing datasets (tshet-uinh)

### Scope

**Core systems (must be audited before MVP):**

| System | Year | Priority | Rationale |
|--------|------|----------|-----------|
| Baxter | 1992 | Critical | Most widely cited English-language system |
| Pan Wuyun | 2000 | Critical | Most widely cited Chinese-language system |
| Zhengzhang Shangfang | 2002 | Critical | Major independent Chinese system |
| Baxter-Sagart | 2014 | Critical | Latest major English-language system |

**Extended systems (audit during MVP development):**

| System | Year | Priority | Rationale |
|--------|------|----------|-----------|
| Karlgren | 1915-26 | High | Historical significance (first modern reconstruction) |
| Wang Li | 1957 | High | Foundational Chinese-language system |
| Pulleyblank | 1984 | Medium | Influential intermediate system |
| unt | 2018 | Medium | Recent computational approach |
| msoeg | 2021 | Low | Most recent; may have limited data |

### Deliverable Structure

```
qieyun-compare-data/
├── README.md
├── audit/
│   ├── baxter-1992.md
│   ├── pan-2000.md
│   ├── zhengzhang-2002.md
│   ├── baxter-sagart-2014.md
│   └── ...
├── metadata/
│   └── systems.json
├── reconstruction/
│   ├── baxter-1992.csv
│   ├── pan-2000.csv
│   └── ...
└── sources/
    └── references.bib
```

### Success Criteria

Project 0 is complete for the MVP when:

- At least 4 core systems have verified, digitized IPA data
- Each system's metadata is documented (scholar, year, publication, data availability)
- IPA conversion rules are established and documented
- The data is in a format consumable by the comparison engine

---

## Project 1: qieyun-compare MVP

**Duration:** 4-8 weeks (starting after core data audit is complete)
**Deliverable:** A functional web-based comparison tool
**Visibility:** Public (GitHub repository + hosted web application)

### MVP Scope

The MVP does exactly one thing: compare reconstruction systems for a given phonological position.

**Included in MVP:**

1. Character input (or phonological position input)
2. Automatic phonological position display (using tshet-uinh data)
3. Comparison of any number of selected reconstruction systems
4. Visual highlighting of differences
5. Source/citation information for each reconstruction
6. Configurable default comparison systems
7. Same-phonological-position characters (collapsible)

**Explicitly excluded from MVP:**

- Rule Graph visualization
- Timeline Explorer
- AI-assisted analysis
- Automatic Consensus Score calculation
- Controversy Map
- Adjacent phonological position navigation
- User accounts or saved preferences (initially)
- Mobile-optimized layout (initially)

### MVP Feature Details

**Character Input:**
- Text field accepting a Chinese character
- Alternative: phonological position selectors (聲母, 韻母, 等, 開合, 聲調)

**Phonological Position Display:**
- Automatically determined from tshet-uinh dataset
- Displayed prominently (not as a footnote)
- Source attribution: "According to tshet-uinh dataset"

**Comparison Table:**
- Each column = one reconstruction system
- Rows = phonological features (initial, final, tone)
- Differences highlighted visually
- Scrollable horizontally if many systems selected

**Reference Information:**
- For each system: scholar, year, publication, data source
- BibTeX citation block for each system
- Data availability status (complete, partial, unavailable)

**Default Systems:**
- Pre-configured: Baxter (1992), Pan (2000), Zhengzhang (2002), Baxter-Sagart (2014)
- User can customize defaults (stored in browser local storage)
- URL parameters for sharing specific comparisons

**Same-Phonological-Position Characters:**
- Collapsible section below the comparison table
- Lists all characters sharing the same phonological position
- Clicking a character reloads the comparison for that character

### MVP Success Criteria

The MVP is successful when:

- A graduate student can enter a character and immediately see a multi-system comparison
- The comparison data is accurate and properly cited
- The tool loads in under 2 seconds
- The interface is clear enough that no documentation is needed for basic use

---

## Future Companion Projects

These are explicitly **not** part of qieyun-compare. Each will be a separate repository.

### qieyun-explorer

**Concept:** Browse and explore reconstruction systems beyond comparison. Includes metadata, scholar information, publication history, and reconstruction families.

**Depends on:** Project 0 data layer (shared with qieyun-compare)

### qieyun-rulegraph

**Concept:** Visualize reconstruction rules as graphs. Show how phonological features map to IPA across systems.

**Depends on:** Project 0 data layer + rule extraction from reconstruction data

### qieyun-timeline

**Concept:** Interactive timeline of Middle Chinese reconstruction research. Show how the field evolved from Karlgren to the present.

**Depends on:** Project 0 metadata + historical bibliography

### qieyun-ai

**Concept:** AI-assisted analysis of reconstruction systems. Identify patterns, suggest research questions, analyze disagreements.

**Depends on:** All of the above + machine learning infrastructure

### qieyun-korean

**Concept:** Korean scholarship related to Middle Chinese. Sino-Korean readings, Dongguk Jeongun, comparative studies using Korean evidence.

**Depends on:** Korean scholarship data (currently mostly in print, not digital)

### When to start future projects

Each future project should be started only when:

1. The previous project has been published and received positive feedback
2. There is demonstrated demand from the research community
3. The required data has been audited and is available

---

## Timeline Summary

```
Week 1-2:  Data Audit (core 4 systems)
Week 3-4:  Data Audit continues + MVP design finalization
Week 5-8:  MVP development
Week 9-10: Testing, feedback collection, documentation
Week 11+:  Public release + continued data audit for additional systems
```

This timeline assumes a single developer working part-time. Adjust for team size.

# Architecture

This document describes the system architecture of qieyun-compare and the reasoning behind every architectural decision.

---

## Design Philosophy

The architecture follows three principles:

1. **Data before software.** The quality of the comparison tool depends entirely on the quality of the reconstruction data. No amount of UI polish can compensate for inaccurate data.

2. **Separation of data and presentation.** Reconstruction data is stored independently of the UI. This allows multiple tools (comparison, explorer, rule graph) to share the same data source in the future.

3. **Progressive complexity.** The system starts simple and grows only when the foundation is solid. Every new feature must prove its value before being added.

---

## Conceptual Model

The core conceptual model is:

```
Character → Phonological Position → Comparison of Reconstruction Systems
```

### Why this model?

During early design discussions, we considered a simpler model:

```
Character → Comparison of Reconstruction Systems
```

However, this was rejected because:

- Researchers do not primarily compare individual characters. They compare **phonological positions**.
- A character is merely the **entry point** to a phonological position. For example, 東 is the entry point to the phonological position `平聲 東韻 一等 合口`.
- Every character belonging to the same phonological position shares the same reconstruction across all systems. Therefore, comparing characters is meaningless; comparing phonological positions is meaningful.
- The character → phonological position → comparison model allows the tool to show not just the input character, but all other characters sharing the same position. This dramatically increases the research value.

### Implications for architecture

- The system must maintain a mapping from characters to phonological positions. This mapping comes from the tshet-uinh dataset.
- The comparison engine operates on phonological positions, not characters.
- The UI presents results at the phonological position level, with the character as the navigational anchor.

---

## Data Architecture

### Project 0: Data Audit

Before any software is built, a Data Audit investigates every reconstruction system to determine:

- Whether digital data exists
- The source of the data (publication, repository, dataset)
- Legal status (public domain, CC-BY, fair use, etc.)
- Data completeness (initials only, or initials + finals + tones?)
- Format compatibility (can it be converted to IPA?)
- Relationship to existing datasets (does tshet-uinh already contain it?)

The deliverable is a structured repository (see `data-audit.md`).

### Data Flow

```
Source Publications
    ↓ (manual extraction / conversion)
Reconstruction Data (CSV/JSON per system)
    ↓ (normalization)
Unified Data Layer
    ↓ (consumed by)
Comparison Engine
    ↓ (rendered by)
UI
```

### Why separate data from software?

- Multiple future tools (comparison, explorer, rule graph) will consume the same data. Storing data independently avoids duplication.
- Data can be validated independently of the UI. Academic accuracy is verified at the data layer.
- Data can be version-controlled separately. When a reconstruction is updated, only the data file changes.

---

## Reference Architecture

```
qieyun-compare/
├── docs/                          ← This documentation
├── src/
│   ├── components/                ← UI components
│   ├── lib/
│   │   ├── comparison-engine.ts   ← Core comparison logic
│   │   ├── phonological-map.ts    ← Character → phonological position mapping
│   │   └── data-loader.ts         ← Loads reconstruction data
│   └── data/
│       ├── systems.json           ← Metadata for all reconstruction systems
│       └── reconstructions/       ← IPA data per system (CSV)
├── public/
└── package.json
```

The `data/` directory within the source tree is a **consumer copy**. The **canonical data** lives in the Data Audit repository (Project 0). When data is updated in Project 0, it is copied or symlinked into the comparison tool.

---

## Relationship to tshet-uinh

The comparison tool **relies on** tshet-uinh for phonological position data but **does not modify** it.

### What tshet-uinh provides

- Character → phonological position mapping
- The phonological classification system (聲母, 韻母, 等, 開合, 聲調)
- Data validation (consistency checks)

### What qieyun-compare provides independently

- Reconstruction IPA data for each system
- The comparison engine
- Visual highlighting of differences
- Reference/citation information

### Why this separation?

- We do not want to duplicate tshet-uinh's data.
- We do not want to fork or modify tshet-uinh's codebase.
- We want to position this project as a **companion tool**, not a competitor.
- If tshet-uinh changes its phonological position definitions, our tool should adapt, not break.

---

## Future Architecture Expansion

Each future tool will be an independent repository that consumes the shared data layer:

```
Data Layer (Project 0)
├── qieyun-compare      ← Comparison tool
├── qieyun-explorer     ← Reconstruction explorer (future)
├── qieyun-rulegraph    ← Rule graph visualization (future)
└── qieyun-ai           ← AI-assisted analysis (future)
```

This architecture was chosen because:

- Each tool has a distinct user base and use case.
- Independent repositories allow independent versioning, issue tracking, and citation.
- GitHub search treats each repository separately, increasing discoverability.
- Researchers can cite specific tools in academic papers.

---

## Unresolved Architectural Questions

1. **IPA normalization.** Each reconstruction system uses its own transcription conventions. Converting all systems to a unified IPA representation requires careful scholarly judgment. This must be resolved during the Data Audit.

2. **Multiple readings.** Some characters have multiple phonological positions (多音字). How should the UI handle this? Options: show all readings, show the most common reading, or let the user select.

3. **Data freshness.** When a reconstruction system is updated (e.g., a scholar publishes a revision), how quickly should the tool reflect the change? This depends on the data update workflow, which has not yet been designed.

---

## See Also

- [Decision Log](decision-log.md) for the reasoning behind each decision
- [Data Audit](data-audit.md) for the data collection methodology
- [MVP](mvp.md) for the initial feature set
- [UX Workflow](ux-workflow.md) for user interface design

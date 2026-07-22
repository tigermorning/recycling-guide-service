# GitHub Strategy

This document describes the GitHub positioning, discoverability strategy, and ecosystem integration for qieyun-compare.

---

## Positioning

qieyun-compare is positioned as a **companion tool** for the tshet-uinh ecosystem created by nk2028.

### What this means

- We do not compete with nk2028's tools.
- We do not duplicate their work.
- We build tools that their ecosystem does not yet provide.
- We integrate with their data and libraries as dependencies.

### What this does NOT mean

- We are not a fork of nk2028's repositories.
- We are not officially part of the nk2028 organization.
- We do not speak for nk2028 or represent their views.

### How companionship is expressed

1. **README statement:** "This tool works with data from nk2028/tshet-uinh-js."
2. **Dependency:** npm dependency on `tshet-uinh` package.
3. **Topics:** Shared GitHub Topics (`middle-chinese`, `qieyun`, `historical-linguistics`).
4. **Future:** Request nk2028 to list our tool under "Related Projects" in their README.

---

## Repository Naming Convention

All repositories in this project follow the `qieyun-{function}` pattern:

| Repository | Function |
|-----------|----------|
| qieyun-compare | Comparison tool |
| qieyun-explorer | Exploration tool (future) |
| qieyun-rulegraph | Rule graph visualization (future) |
| qieyun-ai | AI-assisted analysis (future) |
| qieyun-korean | Korean scholarship (future) |

### Why `qieyun-` prefix?

- Connects to the `qieyun` namespace already used by nk2028 (qieyun-restored, qieyun-search).
- Immediately communicates that this is about the Qieyun phonological system.
- Creates natural discoverability: searching "qieyun" on GitHub reveals all our tools alongside nk2028's tools.

---

## GitHub Topics

### Recommended Topics

```
middle-chinese
qieyun
historical-phonology
comparative-linguistics
digital-humanities
sino-korean
```

### Why these 6?

| Topic | Purpose |
|-------|---------|
| `middle-chinese` | Core domain; matches nk2028's Topics |
| `qieyun` | Specific phonological system; connects to existing namespace |
| `historical-phonology` | Academic field; standard search term |
| `comparative-linguistics` | Methodology; differentiates from descriptive tools |
| `digital-humanities` | Broader field; increases visibility beyond linguistics |
| `sino-korean` | Signals Korean scholarship inclusion; targets Korean researchers |

### Why not more?

GitHub search considers Topics as relevance signals. Fewer, highly relevant Topics are better than many loosely relevant ones. Each Topic should be a strong descriptor.

---

## Discoverability Strategy

### How researchers find the project

**Path 1: Direct search**
- Researcher searches "middle chinese comparison" → finds qieyun-compare
- Researcher searches "qieyun" → finds both nk2028 and our tools

**Path 2: Through nk2028**
- Researcher visits nk2028/tshet-uinh-deriver → reads README → follows "Related Projects" link → finds qieyun-compare

**Path 3: Academic citation**
- Researcher reads a paper citing qieyun-compare → visits repository

**Path 4: GitHub Topics**
- Researcher browses `middle-chinese` or `qieyun` Topics → finds our repository

### How to strengthen discoverability

1. **Contribute to nk2028's "Related Projects" section.** Request that our tool be listed.
2. **Cite in academic papers.** Every paper that cites the tool increases its visibility.
3. **Present at conferences.** Academic conferences in historical phonology and digital humanities.
4. **Blog posts.** Write about the tool on academic blogs or forums.

---

## README Strategy

The README is the most important page for discoverability. Its structure:

```markdown
# qieyun-compare

A tool for comparing Middle Chinese phonological reconstruction systems.

## What This Does

[1-2 sentences: enter a character, see how multiple scholars reconstruct it]

## Relation to tshet-uinh

This tool uses the tshet-uinh library for phonological position data.
It is a companion tool for the nk2028 ecosystem.

## Quick Start

[3-line quick start guide]

## Supported Reconstruction Systems

[List of systems with year and citation]

## Academic Citation

[BibTeX block]

## Related Projects

[nk2028 repositories]

## Contributing

[Guide for contributors]

## License

MIT
```

### Why this structure?

- First 3 lines: GitHub search result preview. Must contain "Middle Chinese phonological reconstruction."
- Relation to tshet-uinh: signals legitimacy as a companion tool.
- BibTeX: enables academic citation, which increases adoption.
- Related Projects: creates a bridge to nk2028's ecosystem.

---

## Relationship with nk2028

### Collaboration model

- **Asymmetric:** We depend on them; they do not depend on us.
- **Contributions:** We contribute improvements back (data corrections, bug reports).
- **Communication:** We inform them of our project and request feedback.
- **Independence:** We maintain our own repository, issues, and release cycle.

### What we should NOT do

- Fork their repositories without good reason.
- Duplicate their data without attribution.
- Position ourselves as a replacement for their tools.
- Use their name or branding without permission.

### What we SHOULD do

- Credit them prominently in our README.
- Use their libraries as dependencies (not copies).
- Report data issues we discover.
- Contribute improvements when possible.

---

## Future: GitHub Organization

When should this project transition from a personal account to a GitHub Organization?

| Criterion | Threshold |
|-----------|-----------|
| Number of repositories | 3+ |
| External contributors | 1+ |
| Academic citations | 1+ |
| Team members | 2+ |

When the project reaches any of these thresholds, consider creating a GitHub Organization (e.g., `qieyun-tools` or `qieyun-lab`).

### Why an Organization?

- Signals community ownership, not personal project.
- Allows multiple maintainers with different permissions.
- More professional appearance for academic collaboration.
- Easier to manage multiple repositories.

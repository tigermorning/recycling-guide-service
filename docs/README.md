# qieyun-compare Documentation

This directory contains the complete design documentation for the qieyun-compare project. It serves as the project's Source of Truth.

**Every future implementation decision should reference these documents.** When implementation conflicts with the documentation, the documentation is reviewed and updated first.

---

## Document Index

### Core Design

| Document | Purpose |
|----------|---------|
| [architecture.md](architecture.md) | System architecture and design rationale |
| [decision-log.md](decision-log.md) | Historical record of all design decisions |
| [mvp.md](mvp.md) | MVP scope, features, and philosophy |

### Planning

| Document | Purpose |
|----------|---------|
| [roadmap.md](roadmap.md) | Project phases: Data Audit → MVP → Future projects |
| [data-audit.md](data-audit.md) | Data Audit methodology and deliverables |

### Strategy

| Document | Purpose |
|----------|---------|
| [github-strategy.md](github-strategy.md) | GitHub positioning, discoverability, ecosystem integration |
| [tshet-uinh-integration.md](tshet-uinh-integration.md) | Relationship with the nk2028 tshet-uinh ecosystem |

### UX and Research

| Document | Purpose |
|----------|---------|
| [ux-workflow.md](ux-workflow.md) | User experience design and workflow rationale |
| [research-notes.md](research-notes.md) | Academic ideas and future possibilities |
| [korean-scholarship.md](korean-scholarship.md) | Korean scholarship investigation and future plans |

---

## How to Use This Documentation

### For developers (human or AI)

1. Read [architecture.md](architecture.md) first to understand the system design.
2. Read [decision-log.md](decision-log.md) to understand why decisions were made.
3. Read [mvp.md](mvp.md) to understand what to build.
4. Reference [ux-workflow.md](ux-workflow.md) for UI decisions.

### For researchers

1. Read [roadmap.md](roadmap.md) to understand the project timeline.
2. Read [data-audit.md](data-audit.md) to understand data quality standards.
3. Read [research-notes.md](research-notes.md) for academic context.

### For contributors

1. Read all documents in this directory.
2. Follow the architectural patterns described in [architecture.md](architecture.md).
3. Log any new decisions in [decision-log.md](decision-log.md) following the existing format.

---

## Document Maintenance

- These documents are the **Source of Truth** for the project.
- Implementation should follow the documentation, not the other way around.
- When a design change is needed, update the documentation first, then implement.
- The [decision-log.md](decision-log.md) should be updated for every significant decision.
- Review these documents at the start of each development phase.

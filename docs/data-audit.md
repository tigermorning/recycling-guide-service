# Data Audit (Project 0)

This document describes the Data Audit methodology, its purpose, and its deliverables.

---

## Purpose

The Data Audit investigates every candidate reconstruction system before software implementation begins. Its purpose is to answer one question:

**"Can we build a reliable comparison tool with the data that currently exists?"**

If the answer is no, the project must wait until data becomes available or until we can create the data ourselves (with appropriate scholarly rigor).

---

## Why Data Before Software

The sentence that changed the project's direction:

> "If there is no data, there is no tool."

A comparison tool is only as good as its data. If the IPA data for a reconstruction system is:
- Inaccurate → the comparison is misleading
- Incomplete → the comparison is partial
- Unverifiable → the comparison is untrustworthy
- Legally restricted → the tool cannot be published

No amount of UI polish can compensate for bad data. Therefore, the Data Audit is the most important phase of the project.

---

## Audit Questions

For each candidate reconstruction system, the audit answers:

### 1. Does digital data exist?

| Status | Meaning |
|--------|---------|
| Full digital data | IPA or convertible-to-IPA data available in digital form |
| Partial digital data | Some features (e.g., initials only) are digitized |
| Print only | Data exists only in printed publications |
| No data | No systematic reconstruction data available |

### 2. What is the source?

- Academic publication (book, journal article)
- Digital repository (GitHub, institutional database)
- Supplementary material of a paper
- Personal communication with the author

### 3. Is the data public?

| Status | Meaning |
|--------|---------|
| Public | Freely available online |
| Restricted | Requires purchase or institutional access |
| embargoed | Not yet published |
| Unknown | Could not determine |

### 4. Can it legally be reused?

- Public domain / CC0
- CC-BY (attribution required)
- CC-BY-SA (share-alike required)
- Fair use (academic, non-commercial)
- Unknown / requires permission

### 5. Is it complete?

For each reconstruction system, completeness is assessed across:

| Feature | What it means |
|---------|--------------|
| 聲母 (Initials) | All initials are reconstructed with IPA values |
| 韻母 (Finals) | All finals are reconstructed with IPA values |
| 聲調 (Tones) | Tone values are specified |
| 等 (Divisions) | All 4 divisions are covered |
| 開合 (Open/Closed) | Both open and closed mouth variants are covered |

### 6. Is it compatible with tshet-uinh?

- Does the system use the same phonological position classification?
- Are there differences in how initials/finals are categorized?
- Can the data be mapped to tshet-uinh's classification?

### 7. What format is it in?

- Structured (CSV, JSON, database)
- Semi-structured (HTML tables, spreadsheet)
- Unstructured (narrative text in papers)

---

## Audit Deliverable: systems.json

Each audited system produces an entry in `systems.json`:

```json
{
  "id": "baxter-1992",
  "name": "Baxter",
  "fullName": "Baxter's Middle Chinese Reconstruction",
  "year": 1992,
  "scholar": "William H. Baxter",
  "publication": "A Handbook of 'Phags-pa Chinese",
  "publisher": "Brill",
  "language": "English",
  "dataAvailability": "public",
  "license": "fair-use",
  "completeness": {
    "initials": true,
    "finals": true,
    "tones": true,
    "divisions": true,
    "openClosed": true
  },
  "digitalFormat": "csv",
  "dataSource": "derived-from-publication",
  "tshetUinhCompatible": true,
  "notes": "Data extracted from Baxter (1992) appendix. IPA conversion validated against published examples."
}
```

---

## Audit Deliverable: Audit Markdown Files

Each system also has a narrative audit document (e.g., `audit/baxter-1992.md`):

```markdown
# Baxter (1992) — Data Audit

## Source
Baxter, William H. (1992). A Handbook of 'Phags-pa Chinese. Leiden: Brill.

## Data Location
- Appendix B: Middle Chinese readings (pp. 355-398)
- Format: Romanized transcription (not IPA)

## IPA Conversion
- Conversion script needed: Romanization → IPA
- Conversion rules documented in [link]
- Validated against 50 manually checked entries

## Completeness
- Initials: Complete (36 initials)
- Finals: Complete (206 finals)
- Tones: Complete (4 tones)

## Legal Status
- Data extracted from published academic book
- Fair use for academic/research purposes
- Attribution required

## Issues
- Some entries have ambiguous readings
- Tone notation differs from other systems
- Conversion from Baxter's romanization to IPA requires care

## Recommendation
Suitable for MVP inclusion.
```

---

## Audit Workflow

```
1. Select a reconstruction system
2. Locate the primary source (publication)
3. Determine if digital data exists
4. If yes: assess format, completeness, legality
5. If no: assess if manual extraction is feasible
6. Convert to IPA if needed
7. Validate against known examples
8. Write audit document
9. Create structured data file (CSV)
10. Add metadata to systems.json
```

---

## Validation

Every data file must be validated before inclusion in the tool:

1. **Automated validation:** Check that every entry has required fields (IPA for initial, final, tone).
2. **Manual validation:** Spot-check 50 random entries against the original publication.
3. **Cross-validation:** Compare against tshet-uinh's phonological position data for consistency.
4. **Expert review:** If possible, have a domain expert review the data before public release.

---

## Relationship to tshet-uinh Data

The Data Audit should investigate how tshet-uinh's existing data can be leveraged:

- **tshet-uinh-data:** Contains machine-readable data from ancient Qieyun documents. This is the source for phonological position classification.
- **tshet-uinh-js:** The JavaScript library providing character → phonological position mapping. The comparison tool will use this as a dependency.
- **tshet-uinh-examples:** Example derivation scripts. May contain useful reference data.

The comparison tool should NOT duplicate tshet-uinh's data. It should consume it as a dependency and add only the reconstruction IPA data that tshet-uinh does not provide.

---

## Continuous Audit

The Data Audit is not a one-time event. It continues throughout the project's life:

- New reconstruction systems are published periodically. Each new system should be audited before inclusion.
- Existing data may need correction. Audit findings should be version-controlled.
- The audit repository should be updated alongside the comparison tool.

---

## Open Questions

1. **Manual extraction feasibility.** For systems with print-only data, how much effort is required to digitize? This should be estimated during the audit.

2. **IPA conversion accuracy.** How confident can we be in automated romanization → IPA conversion? Manual validation of 50 entries may not be sufficient for systems with complex transcription rules.

3. **Copyright of extracted data.** Extracting IPA values from a published book may be considered a derivative work. Legal review may be needed for commercial use (though academic use is likely fair use).

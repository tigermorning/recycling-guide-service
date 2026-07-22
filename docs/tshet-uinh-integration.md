# tshet-uinh Integration

This document describes how qieyun-compare relates to and integrates with the tshet-uinh ecosystem created by nk2028.

---

## The tshet-uinh Ecosystem

nk2028 is a GitHub Organization dedicated to computational linguistics with a focus on CJKV historical linguistics. Their tshet-uinh (切韻) suite provides:

| Repository | Stars | Function |
|-----------|-------|----------|
| tshet-uinh-js | 53 | Core JavaScript library for the Qieyun system |
| tshet-uinh-deriver | 61 | Online tool for generating phonological reconstructions |
| tshet-uinh-data | 28 | Machine-readable data from ancient Qieyun documents |
| tshet-uinh-examples | 55 | Example derivation scripts |
| tshet-uinh-tools | 7 | Utility tools |
| tshet-uinh-fanqie | 10 | Automated fanqie tool |

**Total:** 201 followers, 65+ repositories, well-maintained MIT-licensed ecosystem.

---

## Our Relationship

qieyun-compare is a **companion tool**, not a competitor.

### What we use from tshet-uinh

| What | How | Why |
|------|-----|-----|
| Character → phonological position mapping | npm dependency on `tshet-uinh` | Avoids maintaining our own database |
| Phonological position classification | Reads tshet-uinh's classification | Ensures consistency with the established standard |
| Data validation | Cross-checks against tshet-uinh's data | Improves data quality |

### What we provide independently

| What | Why independent |
|------|----------------|
| Reconstruction IPA data | tshet-uinh does not provide multi-system IPA comparison |
| Comparison engine | tshet-uinh-deriver generates reconstructions; it does not compare them |
| Citation metadata | tshet-uinh does not provide scholarly reference information |
| Visual highlighting | tshet-uinh-deriver's UI is different from a comparison-focused UI |

---

## Integration Pattern

```
tshet-uinh-js (npm package)
    │
    ├── Provides: character → phonological position mapping
    ├── Provides: phonological classification system
    └── Provides: data validation
    │
    ↓ (consumed by)
    │
qieyun-compare
    │
    ├── Adds: reconstruction IPA data (Baxter, Pan, etc.)
    ├── Adds: comparison engine
    ├── Adds: visual highlighting
    └── Adds: citation metadata
```

### Why not fork tshet-uinh?

- Forking creates a maintenance burden (keeping up with upstream changes).
- Forking implies competition, not companionship.
- Using as a dependency means we benefit from their updates automatically.

### Why not contribute comparison features to tshet-uinh-deriver?

- tshet-uinh-deriver's primary function is **generating** reconstructions, not **comparing** them.
- Adding comparison features to the deriver would change its scope.
- A separate tool allows independent versioning and release cycles.
- Researchers who only need comparison should not need to install the full deriver.

---

## API Dependencies

The comparison tool depends on tshet-uinh-js for:

1. **Character lookup:** Given a character, return its phonological position.
2. **Phonological position enumeration:** Given a phonological position, return all characters belonging to it.
3. **Data consistency:** Validate that phonological positions are correctly classified.

### Risk: API changes

If tshet-uinh-js makes breaking API changes, the comparison tool must adapt.

**Mitigation:**
- Pin to a specific version of tshet-uinh-js.
- Monitor tshet-uinh releases.
- Test compatibility with each new release.

---

## Future Collaboration

We hope to establish a collaborative relationship with nk2028:

1. **Inform them of our project.** Introduce qieyun-compare via GitHub Discussions or email.
2. **Request feedback.** Ask if our approach aligns with their ecosystem's goals.
3. **Contribute improvements.** Report data issues, contribute corrections.
4. **Mutual linking.** Add "Related Projects" sections to both READMEs.

---

## Academic Attribution

When citing qieyun-compare, users should also cite tshet-uinh:

```
@software{qieyun-compare,
  title = {qieyun-compare: A Tool for Comparing Middle Chinese
           Phonological Reconstruction Systems},
  year = {2026},
  url = {https://github.com/[owner]/qieyun-compare}
}

@software{tshet-uinh-js,
  title = {TshetUinh.js: A JavaScript Library for the Qieyun System},
  author = {{nk2028}},
  year = {2026},
  url = {https://github.com/nk2028/tshet-uinh-js}
}
```

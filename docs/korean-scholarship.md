# Korean Scholarship

This document records the investigation into Korean scholarship on Middle Chinese historical phonology and the decision to defer Korean scholarship integration to future phases.

---

## Background

We investigated whether Korean scholars have contributed Middle Chinese reconstruction systems or datasets that could be included in qieyun-compare.

---

## Key Korean Scholars

### Kwon Hyok-jun (권혁준)

- **Affiliation:** Korea University, Department of Chinese Language and Literature
- **Specialization:** Chinese historical phonology (중국고대음운학)
- **Key contributions:**
  - Research on the phonological system of Late Middle Chinese
  - Comparison of Dongguk Jeongun (東國正韻) with Guwen Huijuyao (古今韻會擧要)
  - Translation of Pan Wuyun's Chinese historical phonology textbook into Korean (2014)
  - Extensive research on Jin dynasty (晉代) phonological systems
- **Publications:** Over 40 papers in Chinese-language and Korean-language journals
- **Digital data availability:** Research is primarily in print publications. No publicly available digital reconstruction dataset found.

### Kwon In-han (권인한)

- **Affiliation:** Sungkyunkwan University
- **Specialization:** Middle Sino-Korean phonology
- **Key contributions:**
  - 《中世韓國漢字音의 分析的 硏究》(2009) — Analytical study of Middle Korean Chinese character pronunciation
  - 《中世韓國漢字音訓集成》(2009) — Comprehensive collection of Middle Korean Chinese character pronunciation data
  - Research on ancient Korean phonology through 口訣 (gugyeol) materials
- **Digital data availability:** Publications are primarily in print. The 《訓集成》 may contain structured data, but it is not digitally available.

### Jang Junik (장준익)

- **Key contribution:** Research on aspiration patterns in Korean Chinese character pronunciation across historical strata
- **Finding:** Korean Chinese character pronunciation reflects different layers of Chinese phonological influence, with aspiration distinction developing at different rates for different consonant groups

### Other Notable Researchers

- **Han Kyung-ho (한경호):** Research on 魚韻 in Middle Sino-Korean
- **Lee Eun-il (이은일):** Korean Chinese character pronunciation studies
- **Lee Jun-hwan (이준환):** Co-translator of Hirayama Hisao's Middle Chinese phonology

---

## Korean Datasets

### Publicly Available

| Dataset | Description | Availability |
|---------|-------------|-------------|
| WikiHan (Chang et al., 2022) | Comparative Sinitic dataset from Wiktionary, includes Korean data | Public (GitHub: cmu-llab/wikihan) |
| Korean entries in Wiktionary | Chinese character pronunciations in Korean | Public |

### Not Publicly Available

| Dataset | Description | Availability |
|---------|-------------|-------------|
| Kwon In-han's 訓集成 | Comprehensive Middle Korean Chinese character pronunciation | Print only |
| Korean Historical Phonology databases | Various academic databases | Institutional access |
| Korean Language Institute corpora | Historical Korean texts | Korean institutional access |

---

## Key Finding

**Korean scholarship on Middle Chinese is primarily about Sino-Korean adaptation, not independent Middle Chinese reconstruction.**

The distinction:

- **Middle Chinese reconstruction:** "What did Middle Chinese sound like?" (Karlgren, Baxter, Pan, etc.)
- **Sino-Korean adaptation:** "How was Middle Chinese pronunciation borrowed into Korean?" (Kwon In-han, etc.)

Korean scholars have contributed enormously to understanding the second question. However, the first question — which is what qieyun-compare addresses — has been primarily addressed by Chinese, European, and American scholars.

---

## Decision

Korean scholarship is **deferred to future extensions**, not included in the MVP.

### Reasoning

1. No publicly available digital reconstruction datasets from Korean scholars.
2. Korean scholarship focuses on a different question (adaptation, not reconstruction).
3. Including Korean scholarship would expand scope beyond the project's core mission.
4. The `sino-korean` GitHub Topic provides discoverability for Korean researchers without requiring Korean data in the tool.

### Future Possibility

Korean scholarship could become a separate companion project (`qieyun-korean`) when:

1. Digital datasets from Korean scholars become available.
2. A Korean research group expresses interest in collaboration.
3. The main comparison tool is established and stable.
4. The project scope explicitly expands to include "East Asian scholarship on Middle Chinese."

### What could be included in the MVP

Even without full Korean reconstruction data, the MVP could include a note:

```
Note: Korean scholarship on Middle Chinese is an important area of research.
For Korean adaptation data, see [WikiHan](https://github.com/cmu-llab/wikihan).
```

This provides a bridge to Korean researchers without requiring us to host Korean data.

---

## References

- Kwon Hyok-jun (권혁준), various publications on Chinese historical phonology, Korea University
- Kwon In-han (권인한), 《中世韓國漢字音의 分析的 硏究》(2009), Sungkyunkwan University
- Chang et al. (2022), "WikiHan: A New Comparative Dataset for Chinese Languages," COLING 2022
- Jang Junik (장준익), "역사 층위 분석을 통해 본 한국 한자음의 유무기음 수용 양상"

# Research Notes

This document preserves academic ideas and research observations that emerged during project planning. These are not part of the MVP but may inform future development.

---

## The Value of Interactive Comparison

Academic papers can only compare a few examples due to page limitations. When a paper compares Baxter, Pan, and Karlgren for the 東 rhyme, it shows selected examples, not the complete picture.

An interactive tool can compare **all** phonological positions across **all** selected systems simultaneously. This is something a printed paper cannot provide.

The key distinction: **static comparison** (papers) vs. **interactive comparison** (tool). The tool's value is not in replacing papers but in providing an exploration medium that papers cannot offer.

---

## Consensus Score — Research Indicator

A Consensus Score (e.g., "8/9 systems agree") could serve as more than a visual indicator. It could become a **research indicator**:

- **High consensus (8/9):** This phonological position is relatively stable. Less research value in re-examining it.
- **Low consensus (3/9):** This position remains controversial. High research value. Potential thesis topic for a graduate student.

### Evolution: Controversy Map

In the future, this idea could evolve into a "Controversy Map" that allows researchers to explore the phonological positions where reconstruction systems disagree the most:

- "Show the Top 20 most controversial phonological positions."
- "Which phonological positions have the largest IPA distance between systems?"
- "Which systems disagree the most with the scholarly consensus?"

Graduate students often ask: "Which area should I study?" A Controversy Map could naturally reveal areas where scholarly disagreement is greatest.

### Why postponed?

- Requires accurate phonological position judgment first.
- "Agreement" is difficult to define rigorously (IPA identity vs. phonetic similarity vs. structural similarity).
- Visual highlighting achieves 80% of the value without algorithmic complexity.
- Should be validated with actual researchers before implementation.

---

## Korean Scholarship — Unexplored Potential

Korean scholars have made significant contributions to understanding Middle Chinese, particularly:

- How Middle Chinese was adapted into Korean (Sino-Korean readings)
- Historical Korean phonology as evidence for Middle Chinese reconstruction
- The Dongguk Jeongun (東國正韻, 1449) as a Korean perspective on Chinese phonology

### Key Korean scholars

| Scholar | Affiliation | Contribution |
|---------|------------|--------------|
| Kwon Hyok-jun (권혁준) | Korea University | Chinese historical phonology; Late Middle Chinese phonological system; comparison of Dongguk Jeongun with Guwen Huijuyao |
| Kwon In-han (권인한) | Sungkyunkwan University | Middle Sino-Korean phonology; analysis of ancient Korean Chinese character pronunciation |
| Jang Junik (장준익) | — | Aspiration patterns in Korean Chinese character pronunciation across historical strata |

### Why Korean scholarship is deferred

- Most Korean scholarship is in print, not digitally available.
- Korean studies focus on Sino-Korean adaptation, not independent Middle Chinese reconstruction.
- Very few publicly available digital datasets exist from Korean researchers.
- Including Korean scholarship would expand scope beyond "reconstruction comparison."

### Future possibility

Korean scholarship could become a separate companion project (`qieyun-korean`) when:
- Digital datasets from Korean scholars become available.
- A Korean research group expresses interest in collaboration.
- The main comparison tool is established and stable.

---

## Data Quality as Academic Credibility

The most important insight from the planning phase:

> The success of this project depends not on technical sophistication but on **data accuracy and scholarly rigor**.

A comparison tool with beautiful UI but inaccurate data is worse than useless — it is misleading. A tool with plain UI but verified data is genuinely valuable.

### Implications

1. Every data file must be validated against original publications.
2. Every reconstruction system must have traceable references.
3. Data errors must be correctable via a clear process.
4. The tool should not make claims that the data cannot support.

---

## Phonological Position Complexity

Phonological position judgment is not always straightforward:

- **Multiple readings (多音字):** Some characters have multiple phonological positions. The tool must handle this gracefully.
- **重紐 (chongniu) problem:** The distinction between 重紐 I and 重紐 II divisions is debated among scholars.
- **Source dataset disagreements:** Different sources (Guangyun, Qieyun, Yunjing) may classify the same character differently.

The MVP handles this by deferring to the source dataset (tshet-uinh) and not making independent claims about phonological position.

---

## The "Character as Entry Point" Insight

During UX discussions, we realized that the character is not the object being compared — it is the **entry point** to the phonological position.

This insight has implications:

- The tool should display the phonological position prominently, not as a footnote.
- The tool should show other characters in the same phonological position.
- The comparison operates on phonological positions, not characters.

This insight transformed the conceptual model from "Character → Comparison" to "Character → Phonological Position → Comparison."

---

## The Role of nk2028's tshet-uinh-js

The tshet-uinh-js library provides the character → phonological position mapping. This means:

- We do not need to maintain our own phonological position database.
- We benefit from tshet-uinh's ongoing maintenance and corrections.
- If tshet-uinh updates its data, our tool automatically benefits.

However, this also means:

- We are dependent on tshet-uinh's API stability.
- If tshet-uinh makes breaking changes, our tool must adapt.
- We should monitor tshet-uinh releases and test compatibility.

---

## Future Questions to Explore

1. **Can we quantify the "distance" between two reconstruction systems?** For example, how different are Baxter and Pan across all phonological positions? This could be a simple metric: percentage of positions where they agree.

2. **Can we identify "influence patterns"?** Does one system consistently follow another? For example, does Baxter-Sagart follow Baxter for initials but diverge for finals?

3. **Can we use Wiktionary data?** The WikiHan dataset (Chang et al., 2022) contains comparative Chinese data including Middle Chinese. Can this complement our reconstruction data?

4. **Can we integrate with existing phonological databases?** The CJK Dictionary Institute's phonetic database, the Phonological Database of Chinese Dialects, etc.

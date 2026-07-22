# Decision Log

This document records every significant design decision made during the project's planning phase. Each entry includes the context, alternatives considered, the decision, the reasoning, consequences, and any unresolved questions.

The purpose of this log is to ensure that future contributors (human or AI) can understand **why** the project is designed the way it is, without needing access to the original conversations.

---

## D1: Repository Strategy — Single vs. Multiple Repositories

**Date:** Initial planning phase

**Context:** The project aims to develop multiple research tools for Middle Chinese historical phonology. We needed to decide whether to create one repository containing all tools or separate repositories for each tool.

**Alternatives considered:**

| Alternative | Description |
|------------|-------------|
| **A: Single repository** | One repository (e.g., `qieyun-lab`) containing all tools as subdirectories |
| **B: Multiple repositories** | Separate repositories (e.g., `qieyun-compare`, `qieyun-explorer`, `qieyun-rulegraph`) |

**Decision:** Alternative B — Multiple repositories.

**Reasoning:**

1. **Citation in academic papers.** Researchers need to cite specific tools. A dedicated repository with a clear name is far easier to cite than a subdirectory in a monorepo.
2. **GitHub search discoverability.** Each repository is indexed separately by GitHub search. Multiple repositories increase the number of entry points for discovery.
3. **Independence.** Each tool has its own issue tracker, version history, and release cycle. This is important for a project that will grow over many years.
4. **Alignment with the nk2028 ecosystem.** The existing tshet-uinh ecosystem uses the same pattern (tshet-uinh-js, tshet-uinh-deriver, tshet-uinh-examples as separate repositories). Following this convention makes our project a natural companion.
5. **Lower learning curve.** A researcher looking for "comparison tools" should find one focused repository, not a large monorepo that also contains rule graphs and AI tools.

**Counterargument addressed:** GitHub stars are distributed across repositories. However, experience from successful open-source ecosystems (Vercel/Next.js/SWC/Turborepo, rust-lang/rustup/cargo) shows that distributed stars across a coherent ecosystem are more valuable than concentrated stars in a single repository.

**Consequences:**
- Each repository must be self-contained with its own README and documentation.
- A shared data layer (Project 0) must be designed to serve multiple repositories.
- Repository naming must follow a consistent convention.

**Future reconsideration:** If the number of repositories exceeds 6-7, consider whether a GitHub Organization is needed to unify them.

---

## D2: Repository Naming — "qieyun-compare"

**Date:** Initial planning phase

**Context:** We needed a name for the first tool (the comparison tool).

**Alternatives considered:**

| Name | Pros | Cons |
|------|------|------|
| `qieyun-diff` | Short; familiar to developers | "diff" is primarily a software engineering term. Humanities researchers may not associate it with comparison. |
| `qieyun-compare` | "Compare" is universal; matches academic terminology (comparative analysis); immediately understood by non-developers | Slightly longer |
| `qieyun-comparison` | Clear | Too long for a repository name |
| `qieyun-vs` | Implies comparison | Too informal; implies only two-system comparison |

**Decision:** `qieyun-compare`

**Reasoning:**

- The target audience is historical phonologists and humanities researchers, not software developers.
- "Compare" is a standard academic term (comparative analysis, comparative reconstruction).
- Researchers searching GitHub would naturally search for "compare reconstruction" or "compare phonology," not "diff reconstruction."
- The name `qieyun-compare` immediately communicates the tool's purpose to anyone familiar with Middle Chinese studies.

**Rejected alternative: `qieyun-diff`**

Initially recommended, but challenged during discussion. The term "diff" comes from Unix/Git culture. While it is universally understood by developers, it creates an unnecessary barrier for the actual target audience — humanities researchers who may never have used Git. The principle of "speak the user's language, not your own" applies here.

**Consequences:**
- All future repositories should follow the `qieyun-{function}` pattern (e.g., `qieyun-explorer`, `qieyun-rulegraph`).
- The naming convention implicitly associates the project with the `qieyun` namespace, creating a natural connection to the tshet-uinh ecosystem.

**Future reconsideration:** If the project eventually serves a broader audience (e.g., general linguistics, not just Middle Chinese), the `qieyun-` prefix might become limiting. At that point, renaming would be disruptive, so this should be reconsidered if the scope ever expands beyond the Qieyun system.

---

## D3: GitHub Topics

**Date:** Initial planning phase

**Context:** We needed to decide which GitHub Topics (tags) to assign to the repository for discoverability.

**Alternatives considered:**

| Approach | Topics | Pros | Cons |
|----------|--------|------|------|
| **Broad** | 10+ topics including `phonology`, `chinese-linguistics`, `historical-linguistics`, `comparative-linguistics`, `digital-humanities`, `computational-linguistics`, etc. | Maximum search entry points | Dilutes relevance signal; some topics too vague |
| **Focused** | 5-6 highly relevant topics | Clear signal; each topic is a strong descriptor | Fewer entry points |

**Decision:** Focused approach with 6 topics:

```
middle-chinese
qieyun
historical-phonology
comparative-linguistics
digital-humanities
sino-korean
```

**Reasoning:**

- GitHub search considers Topics as relevance signals. Having many loosely relevant Topics is worse than having fewer highly relevant ones.
- Each Topic should be a strong descriptor that a researcher in the field would search for.
- `sino-korean` was added to signal that Korean scholarship is included, which increases discoverability for Korean researchers.
- `computational-linguistics` was considered but ultimately excluded from the initial set to keep the focus tight. It can be added later if the project expands to include computational analysis.

**Consequences:**
- The repository will appear in searches for `middle-chinese`, `qieyun`, and `historical-phonology` alongside nk2028 repositories, creating a natural discoverability path.
- Korean researchers searching for `sino-korean` will also find the project.

**Future reconsideration:** If the project's scope expands (e.g., to include AI-assisted analysis), adding `computational-linguistics` or `machine-learning` may be appropriate.

---

## D4: Positioning as a Companion Tool

**Date:** Initial planning phase

**Context:** The nk2028 ecosystem already provides excellent Middle Chinese tools (tshet-uinh-js, tshet-uinh-deriver, tshet-uinh-data, etc.). We needed to decide how our project relates to this ecosystem.

**Alternatives considered:**

| Positioning | Description |
|------------|-------------|
| **Competitor** | Build an alternative ecosystem that replaces nk2028's tools |
| **Extension** | Fork nk2028's repositories and add features directly |
| **Companion** | Build independent tools that integrate with nk2028's data and libraries |

**Decision:** Companion positioning.

**Reasoning:**

1. **nk2028's ecosystem is excellent.** There is no reason to duplicate or replace it. Their libraries (tshet-uinh-js), data (tshet-uinh-data), and tools (tshet-uinh-deriver) are well-maintained and widely used.
2. **Complementary, not competitive.** nk2028 provides reconstruction generation (deriver). Our tool provides reconstruction comparison. These serve different needs.
3. **Integration via dependency, not fork.** We use tshet-uinh's data and libraries as dependencies, not by forking. This means we benefit from their updates without maintaining a copy.
4. **Academic etiquette.** Positioning as a companion respects the work of the nk2028 team and fosters collaboration rather than competition.

**How companionship manifests:**
- README explicitly states: "This tool works with data from nk2028/tshet-uinh-js."
- npm dependency on `tshet-uinh` package.
- GitHub Topics overlap with nk2028's Topics, creating shared discoverability.
- Future: nk2028's README could list our tool under "Related Projects."

**Consequences:**
- We must track tshet-uinh's API changes and ensure compatibility.
- We should contribute improvements back to tshet-uinh when possible (e.g., reporting data issues, contributing phonological position corrections).
- We must not position ourselves as a replacement for tshet-uinh-deriver.

**Future reconsideration:** If nk2028 adds a comparison feature to tshet-uinh-deriver (which they have not announced), we would need to reassess our positioning. However, even in that case, a specialized comparison tool with advanced features (consensus scoring, controversy mapping) would remain valuable.

---

## D5: Conceptual Model — Character → Phonological Position → Comparison

**Date:** After initial UX discussions

**Context:** We originally imagined the workflow as: "Choose systems → Enter character → View comparison." We later changed it to: "Enter character → View comparison → Adjust systems." However, we identified a deeper issue: the intermediate concept of "phonological position" was missing.

**Alternatives considered:**

| Model | Description |
|-------|-------------|
| **Character → Comparison** | Direct mapping from character to IPA comparison |
| **Character → Phonological Position → Comparison** | Character is the entry point; phonological position is the object being compared |

**Decision:** Character → Phonological Position → Comparison.

**Reasoning:**

- Researchers do not compare characters. They compare **phonological positions**. A character is merely an entry point to a phonological position.
- Multiple characters share the same phonological position. For example, 東, 同, 銅, 童, 桐 all belong to `平聲 東韻 一等 合口`. Their reconstructions are identical across all systems because they share the same phonological position.
- The tool should display not just the input character, but the phonological position and all other characters sharing it.
- This model makes the tool educational: a graduate student entering 東 learns not just its reconstruction, but its phonological classification.

**Consequences:**
- The system must maintain a character → phonological position mapping (provided by tshet-uinh).
- The comparison engine operates on phonological positions, not characters.
- The UI must display the phonological position prominently, not as a footnote.

---

## D6: Workflow Order — Character First, Then Systems

**Date:** UX design phase

**Context:** We originally imagined: "Choose reconstruction systems → Enter character → View comparison." We realized this was backwards.

**Alternatives considered:**

| Workflow | Description |
|----------|-------------|
| **Systems first** | User selects which systems to compare, then enters a character |
| **Character first** | User enters a character, sees comparison with default systems, then adjusts |

**Decision:** Character first.

**Reasoning:**

- Researchers begin with a specific research question about a character or phonological position, not with "I want to compare these specific systems."
- The most common scenario: "What is the reconstruction of 東?" not "Compare Baxter and Pan for 東."
- Default systems should be pre-configured, so the user sees results immediately without configuration.
- System adjustment is a secondary action, done only when the defaults are insufficient.

**Consequences:**
- The UI must have a prominent search/input field.
- Default comparison systems must be configurable.
- The initial view should show results immediately, not require configuration.

---

## D7: Multiple Reconstruction Systems from the Start

**Date:** Architecture phase

**Context:** We needed to decide whether the MVP should support comparing only two systems (simpler) or any number of systems (more complex but more useful).

**Alternatives considered:**

| Approach | Pros | Cons |
|----------|------|------|
| **Two systems only** | Simpler data model, simpler UI | Artificial limitation; researchers need to compare more |
| **Any number of systems** | Matches real research workflow; no future restructuring needed | Slightly more complex UI |

**Decision:** Any number of systems from the start.

**Reasoning:**

- The data model difference between "two systems" and "N systems" is negligible if designed correctly from the beginning.
- Restructuring from 2 to N later would require significant refactoring.
- Researchers genuinely compare more than two systems. Limiting to two would feel artificial.
- The UI can start simple (a table that grows horizontally) and become more sophisticated later (filters, grouping).

**Consequences:**
- The comparison table must be designed to expand horizontally without becoming unusable.
- We need to consider how to handle tables with many columns (scrolling, sticky columns, etc.).

---

## D8: Historical Ordering of Reconstruction Systems

**Date:** UX design phase

**Context:** We needed to decide the default ordering of reconstruction systems in the comparison table.

**Alternatives considered:**

| Ordering | Pros | Cons |
|----------|------|------|
| **Alphabetical** | Universal; easy to find a specific system | Hides the historical development of the field |
| **By year of publication** | Reflects the evolution of reconstruction research; educational | Systems published in the same year need a secondary sort |
| **By citation count** | Shows the most influential systems first | Citation data may not be available or up-to-date |

**Decision:** By year of publication (chronological).

**Reasoning:**

- The history of reconstruction research is itself valuable. Researchers are interested not only in "what" but in "how the understanding evolved."
- Chronological order naturally tells the story: Karlgren → Wang Li → Pulleyblank → Baxter → Pan → Zhengzhang → Baxter-Sagart → unt → msoeg.
- Each system builds upon or reacts to its predecessors. Chronological order makes these relationships visible.
- An optional sort by other criteria (citation count, alphabetical) can be added later, but chronological should be the default.

**Consequences:**
- Each reconstruction system must have a `year` field in its metadata.
- Systems published in the same year are sorted alphabetically as a tiebreaker.

---

## D9: Data Before Software — The Data Audit

**Date:** Architecture review phase

**Context:** We initially planned to start with qieyun-compare implementation. A critical review identified that the biggest risk is not technical but **data-related**: if the reconstruction data is inaccurate or unavailable, the tool is worthless.

**Alternatives considered:**

| Approach | Description |
|----------|-------------|
| **Build first, collect data incrementally** | Start coding immediately; gather data as needed |
| **Data Audit first, then build** | Investigate data availability before writing any code |
| **Parallel (recommended)** | Short Data Audit (2-4 weeks) for core systems, then build MVP with confirmed data while continuing audit |

**Decision:** Parallel approach — short Data Audit for core systems, then MVP development with confirmed data, while continuing audit for additional systems.

**Reasoning:**

- Pure "data first" risks analysis paralysis and loss of motivation.
- Pure "build first" risks building on incomplete or inaccurate data.
- The parallel approach provides:
  - Quick validation that the project is feasible (Data Audit)
  - Visible results early (MVP)
  - Iterative improvement (continuous audit)

**Consequences:**
- The MVP will include only systems whose data has been verified.
- Additional systems are added as their data is audited.
- The Data Audit is a continuous process, not a one-time event.

---

## D10: Consensus Score — Postponed

**Date:** Feature design phase

**Context:** We originally proposed a "Consensus Score" (e.g., "8/9 systems agree") as a key feature. After critical review, we identified significant difficulties.

**Problems identified:**

1. **Definition of "agreement" is ambiguous.** Does IPA identity count? Phonetic similarity? Structural similarity?
2. **Requires accurate phonological position judgment first.** If the position is uncertain, the score is meaningless.
3. **Adds complexity without proven value.** The feature sounds useful in theory but has not been validated with actual researchers.

**Decision:** Postpone automatic Consensus Score. Use visual highlighting instead.

**What the MVP does instead:**
- Visually highlight differences in the comparison table.
- Researchers can see patterns (e.g., "8 systems show -uŋ, 1 shows -oŋ") without a formal algorithm.

**Future evolution:**
- If the comparison engine proves reliable, a formal Consensus Score can be added.
- This could eventually evolve into a "Controversy Map" showing the most disputed phonological positions.
- Graduate students could use this to identify research questions: "Which phonological positions have the most scholarly disagreement?"

**Reasoning for postponement:**
- The MVP should focus on the core value: accurate comparison.
- Visual highlighting achieves 80% of the value with 20% of the complexity.
- The Consensus Score algorithm requires scholarly judgment about what "agreement" means, which should be informed by actual user feedback, not designed in advance.

---

## D11: Phonological Position — Source Dataset Definition

**Date:** Architecture review phase

**Context:** Phonological position judgment can be academically complicated (multiple readings, 重紐 issues, different scholarly interpretations). We needed to decide how the MVP handles this complexity.

**Decision:** Use the phonological position as defined by the underlying source dataset (tshet-uinh / Guangyun), not by the software's own judgment.

**What this means:**
- The software says: "According to this dataset, 東 belongs to 平聲 東韻 一等 合口."
- It does NOT say: "東 belongs to 平聲 東韻 一等 合口."
- Academic disagreements about phonological position are deferred to future extensions.

**Reasoning:**
- The MVP cannot resolve scholarly disagreements about phonological classification.
- Deferring to the source dataset is academically honest.
- It avoids the tool making claims it cannot defend.

**Consequences:**
- The tshet-uinh dataset becomes the authoritative source for phonological positions.
- Any errors in phonological position are tshet-uinh's responsibility, not ours.
- We should contribute corrections to tshet-uinh if we discover errors.

---

## D12: Showing Other Characters — Collapsible Section

**Date:** UX design phase

**Context:** We discussed showing all characters belonging to the same phonological position (e.g., 東, 同, 銅, 童...). However, showing them immediately could make the interface crowded.

**Decision:** Make the "other characters" section collapsible (expand on demand).

**Reasoning:**
- Not every researcher needs to see all characters in a phonological position.
- Showing them immediately adds visual noise for users who only care about the input character.
- Making them collapsible respects both use cases: quick lookup vs. deep exploration.

---

## D13: Project Scope — Focused Comparison Tool

**Date:** After scope expansion discussion

**Context:** The original vision expanded from "comparison tool" to "research platform" (comparison + metadata + timeline + rule graph + AI). After critical review, we decided to reverse this expansion.

**Decision:** Remain a focused comparison tool. All other features (rule graph, timeline, AI) become independent future projects.

**Reasoning:**
- "Platform" projects rarely succeed. Most successful open-source projects start with one thing done well.
- Scope creep is the #1 killer of research software projects.
- A focused comparison tool that works reliably is more valuable than an ambitious platform that is never finished.
- Each future feature can be an independent repository, following the same multi-repository strategy (D1).

**Consequences:**
- The MVP must be extremely focused: character input → phonological position → comparison.
- Future features are explicitly documented as "future projects" in the roadmap, not as "future features" of this repository.

---

## D14: README Strategy

**Date:** GitHub strategy phase

**Context:** The README is the first thing researchers see. It must maximize discoverability and trust.

**Decision:** README should include:

1. Clear one-line description with keywords
2. What the tool does (1-2 sentences)
3. Relation to tshet-uinh ecosystem
4. Quick start guide
5. Academic citation (BibTeX)
6. Related projects (link to nk2028)
7. Contributing guide
8. License (MIT, matching nk2028)

**Reasoning:**
- The first 3 lines of README appear in GitHub search results.
- "Middle Chinese phonological reconstruction" must appear in the opening.
- BibTeX citation block increases academic adoption.
- Explicit relation to tshet-uinh signals that this is a legitimate companion tool.

---

## D15: Korean Scholarship — Deferred to Future

**Date:** Research investigation phase

**Context:** We investigated whether Korean scholarship on Middle Chinese could be included in the project.

**Findings:**
- Korean scholars (e.g., Kwon Hyok-jun at Korea University, Kwon In-han at Sungkyunkwan University) have contributed significantly to understanding how Middle Chinese was adapted into Korean.
- However, these are primarily studies of **Sino-Korean adaptation**, not independent Middle Chinese reconstruction systems.
- Very few publicly available digital datasets exist from Korean scholarship.
- The most relevant dataset is WikiHan (CMU), which includes Korean data and was co-authored by a Korean researcher.

**Decision:** Defer Korean scholarship to future extensions. Include a `sino-korean` GitHub Topic for discoverability by Korean researchers.

**Reasoning:**
- Including Korean scholarship would require collecting data that is mostly in print, not digital.
- The scope would expand beyond "reconstruction comparison" to "East Asian scholarship overview."
- The project should first establish credibility with well-documented, publicly available reconstruction systems.

**Future consideration:**
- Korean scholarship could become a separate companion project (e.g., `qieyun-korean`).
- As Korean scholars publish more digital datasets, they can be gradually integrated.

---

## Unresolved Decisions

The following questions remain open and should be revisited during implementation:

1. **How to handle 多音字 (characters with multiple readings).** Options: show all readings, show the most common, or let the user select. Requires user testing.

2. **IPA normalization rules.** Each reconstruction system uses slightly different transcription conventions. Unified rules must be established during the Data Audit.

3. **Default comparison systems for new users.** Which systems should be pre-selected? Currently proposed: Baxter (1992), Pan (2000), Zhengzhang (2002), Baxter-Sagart (2014). Needs validation.

4. **URL sharing format.** How should comparison state be encoded in URLs for sharing? (e.g., `?char=東&systems=baxter,pan,zhengzhang`)

5. **License.** MIT is proposed (matching nk2028). Confirm during implementation.

6. **Hosting.** GitHub Pages? Netlify? Vercel? Depends on whether server-side rendering is needed.

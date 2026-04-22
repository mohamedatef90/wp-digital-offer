# Audit Report — Offer Page Hero Section
**Date:** 2026-04-22
**File audited:** `src/components/proposal/HeroSection.jsx`
**Supporting:** `src/index.css` (`.gradient-text`, `fadeUp` animation)

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | Gradient text fails WCAG contrast measurement; decorative span not hidden |
| 2 | Performance | 3/4 | Dead stacking context from removed blobs; no easing refinement |
| 3 | Responsive Design | 3/4 | Solid overall; 320px viewport marginally tight |
| 4 | Theming | 3/4 | Tokens used consistently; gradient-text violates design ban |
| 5 | Anti-Patterns | 1/4 | 4 AI-slop tells: gradient text, hero metric cards, all-centered, generic copy |
| **Total** | | **12/20** | **Acceptable — significant work needed** |

---

## Anti-Patterns Verdict

**Does this look AI-generated? Yes, immediately.**

Four distinct tells present:

1. **Gradient text headline** — The client name renders with `background-clip: text` + `linear-gradient(135deg, #38bdf8, #679a41)`. This is the single most recognizable AI design tell of 2024–2025. It directly contradicts the design principle: *"the proposal you'd be proud to forward to your CFO"* — no CFO-bound document uses gradient-filled text.

2. **Hero metric stat cards** — Two identical cards, each with a large number + small uppercase label. This is the textbook "hero metric template" that every AI-generated dashboard and landing page produces. It adds no persuasive value for a CFO evaluating a proposal.

3. **100% centered layout** — Every element is `text-center` with `mx-auto`. The entire hero defaults to the "safe center everything" pattern called out explicitly in the design principles. No asymmetry, no intentional composition.

4. **Generic eyebrow + decorative line** — Colored horizontal line → uppercase tracking label (a pattern so overused it reads as a template). The eyebrow carries no information beyond what's already in the heading.

---

## Executive Summary

- **Audit Health Score: 12/20** (Acceptable — significant work needed)
- **Total issues: 9** (P1: 3, P2: 4, P3: 2)
- **Top critical issues:**
  1. Gradient text on `<h1>` — absolute ban violation, major trust signal failure
  2. Hero metric stat cards — banned template, adds noise not signal
  3. Generic body copy — zero brand differentiation, undermines authority
  4. Decorative `<span>` line not hidden from screen readers
  5. `<section>` has no accessible landmark label

---

## Detailed Findings

### P1 — Major (fix before release)

---

**[P1] Gradient text on primary heading**
- **Location:** `HeroSection.jsx:34` — `<span className="gradient-text">{clientName}</span>`; `index.css:43-48` — `.gradient-text` definition
- **Category:** Anti-Pattern + Accessibility
- **Impact:** Two simultaneous failures. (1) Visually: the most immediate AI-slop tell — destroys the enterprise/authority positioning the brief demands. A CFO receiving this will read "generated template" before reading the client name. (2) Technically: gradient text uses `-webkit-text-fill-color: transparent`; WCAG 1.4.3 cannot measure contrast on transparent fills. Screen readers receive the text correctly, but automated contrast checkers flag it as a fail.
- **WCAG:** 1.4.3 Contrast (Minimum) — unmeasurable/non-conformant
- **Recommendation:** Replace `.gradient-text` with a solid high-contrast color. The client name is the most important word on the page — it should be `text-text-primary` (`#eef2f7`) or brand white. Weight and size provide the emphasis. The `.gradient-text` class should be removed from the codebase entirely — it's used only here.
- **Suggested command:** `/polish`

---

**[P1] Hero metric stat cards**
- **Location:** `HeroSection.jsx:42-55`
- **Category:** Anti-Pattern
- **Impact:** The "big number / small label" card pair is explicitly called out as a banned template. More importantly, it's *persuasively useless* — a CFO does not need to be reminded that they're viewing a 36-month contract with 1 line item. This information is prominent in the pricing table below. Here it reads as filler that pads the hero to look like a real proposal without adding substance.
- **Recommendation:** Remove the stat cards entirely, or replace with a single, more deliberate signal (e.g., proposal validity countdown inline with the heading, or a subtle "36-month term" annotation in the proposal label line). The hero should create anticipation for what's below, not front-load data already visible in the pricing section.
- **Suggested command:** `/distill`

---

**[P1] Generic body copy with zero differentiation**
- **Location:** `HeroSection.jsx:37-40`
- **Category:** Anti-Pattern
- **Impact:** *"We've prepared a tailored proposal for your review. Explore the details below and let us know if you have any questions."* This copy could be from a used car dealership or a law firm. It signals nothing about WorldPosta's value — no regional compliance expertise, no MENA authority, no specific differentiation. Design principle: "Authority through restraint — every element must earn its place." This paragraph earns nothing.
- **Recommendation:** Either remove entirely (the heading "Prepared for {ClientName}" already sets context) or replace with a single, specific trust signal tied to WorldPosta's brand: e.g., *"This proposal reflects WorldPosta's regional compliance commitments — NCA, NESA, and ISO 27001-certified infrastructure, built for the MENA enterprise."*
- **Suggested command:** `/clarify`

---

### P2 — Minor (fix in next pass)

---

**[P2] Decorative `<span>` line not hidden from assistive technology**
- **Location:** `HeroSection.jsx:7` — `<span className="w-[18px] h-0.5 bg-brand-green rounded-sm block" />`
- **Category:** Accessibility
- **Impact:** Screen readers encounter this element as an empty inline node. Some AT will announce it as a blank content area, interrupting the reading of "Proposal · WPC-2026-00111". Minor but unnecessary friction for AT users.
- **WCAG:** 1.3.1 Info and Relationships
- **Recommendation:** Add `aria-hidden="true"` to the decorative span.
- **Suggested command:** `/polish`

---

**[P2] `<section>` landmark has no accessible name**
- **Location:** `HeroSection.jsx:3` — `<section className="...">`
- **Category:** Accessibility
- **Impact:** `<section>` elements only become landmarks (announced as "region") when they have an accessible name. Without one, the element degrades to a generic container in the accessibility tree. The ProposalPage has multiple `<section>` elements — without names, screen reader users navigating by landmarks cannot distinguish them.
- **WCAG:** 4.1.2 Name, Role, Value; ARIA Landmark Regions best practice
- **Recommendation:** Add `aria-label="Proposal overview"` to the `<section>`.
- **Suggested command:** `/polish`

---

**[P2] Dead stacking context — orphaned `z-[1]` and `overflow-hidden`**
- **Location:** `HeroSection.jsx:3` (`overflow-hidden` on `<section>`) and `HeroSection.jsx:5` (`z-[1]` on content div)
- **Category:** Performance
- **Impact:** The `z-[1]` creates an unnecessary stacking context. `overflow-hidden` on the section clips nothing (there are no overflowing children). These are residue from a previous version that had background blobs or decorative elements. They add CSS complexity and stacking context overhead with no visual benefit.
- **Recommendation:** Remove `overflow-hidden` from `<section>` and `relative z-[1]` from the content div (keep `relative` only if needed for absolute children — it isn't currently).
- **Suggested command:** `/polish`

---

**[P2] Client logo placeholder shown to screen readers**
- **Location:** `HeroSection.jsx:20-28`
- **Category:** Accessibility
- **Impact:** The placeholder `div` has `aria-label="Client logo placeholder"`. When no client logo is provided, a screen reader announces "Client logo placeholder" — which is confusing noise. A user doesn't need to know the logo is missing; they need the company name, which they already have from the heading.
- **WCAG:** 1.3.1 Info and Relationships
- **Recommendation:** Replace `aria-label="Client logo placeholder"` with `aria-hidden="true"` since the element is purely decorative when no logo exists.
- **Suggested command:** `/polish`

---

### P3 — Polish (nice to fix)

---

**[P3] Animation easing is browser default, not exponential**
- **Location:** `index.css:21-24` — `@keyframes fadeUp` and `.animate-fade-up { animation: fadeUp 0.55s both; }`
- **Category:** Performance / Motion
- **Impact:** The `fadeUp` animation has no explicit easing, falling back to the browser's `ease` (cubic-bezier(0.25, 0.1, 0.25, 1)). The design guidelines call for exponential easing (`ease-out-quart` or similar) for natural deceleration. The current easing works but doesn't feel as polished as it could.
- **Recommendation:** Add `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo equivalent) to the animation definition: `animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both`.
- **Suggested command:** `/animate`

---

**[P3] Barlow font declared but not loaded**
- **Location:** `index.css:4` — `font-family: 'Barlow', -apple-system, ...`
- **Category:** Performance / Theming
- **Impact:** `Barlow` is referenced as the primary font but there is no `@font-face` rule, no `<link>` to Google Fonts in `index.html`, and no self-hosted font files visible in `public/`. The browser silently falls back to `-apple-system` immediately. The design renders in the OS system font, not Barlow. This is a silent visual discrepancy.
- **Recommendation:** Either add the Google Fonts link to `index.html` (`<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&display=swap" rel="stylesheet">`) or self-host the font files. If system fonts are acceptable, update the CSS comment to reflect intent.
- **Suggested command:** `/typeset`

---

## Patterns & Systemic Issues

1. **Gradient text appears globally via `.gradient-text` class** — This class is used in HeroSection but also in QuoteDetails and AddOns (price totals). The root cause is a global CSS class that makes it easy to apply the banned pattern anywhere. Fix: remove `.gradient-text` from `index.css` entirely, audit all usages, replace with solid color.

2. **"Hero metrics" pattern likely appears in other sections** — The big-number/small-label card pattern in HeroSection matches patterns that may recur in AboutSection (stats) and CommitmentSection. The systemic fix is to adopt a different visual language for quantitative data.

3. **All-center composition used throughout ProposalPage** — The `text-center mx-auto` pattern isn't isolated to HeroSection. It likely propagates across multiple sections, creating a monotonous centered-stack layout.

---

## Positive Findings

- **`clamp()` for fluid heading** (`text-[clamp(32px,5vw,52px)]`) — correct fluid type approach, no media queries needed for the heading.
- **Reduced motion respected** (`@media (prefers-reduced-motion: reduce)`) — properly disables animations, a meaningful accessibility provision.
- **Semantic `<h1>` on client name** — the primary heading is correctly marked as `<h1>`, establishing the document hierarchy.
- **Client logo alt text** — `alt={\`${clientName} logo\`}` is specific and descriptive.
- **Proposal number in eyebrow** — surfacing the proposal number immediately gives procurement recipients an easy reference.
- **Design tokens used consistently** — all colors reference the defined token system; no raw hex values in the component JSX.

---

## Recommended Actions (Priority Order)

1. **[P1] `/distill`** — Remove the hero metric stat cards. Strip the hero to its essential purpose: establishing who this proposal is for and creating gravitas. Less = more trust here.
2. **[P1] `/clarify`** — Rewrite or remove the generic body copy. Either cut it entirely or replace with a single WorldPosta-specific trust signal (regional compliance, certified infrastructure).
3. **[P1] `/polish`** — Replace gradient-text on client name with solid `text-text-primary`; remove the `.gradient-text` CSS class globally; add `aria-hidden="true"` to decorative span; add `aria-label` to `<section>`; fix logo placeholder aria.
4. **[P3] `/animate`** — Refine the `fadeUp` easing to `cubic-bezier(0.16, 1, 0.3, 1)` for more natural deceleration.
5. **[P3] `/typeset`** — Confirm Barlow is loaded (add Google Fonts link or self-host); evaluate whether Barlow is the right choice for the enterprise-authority positioning.
6. **[P2] `/polish`** — Final pass after all above: remove dead `overflow-hidden` and `z-[1]`, verify landmark structure.

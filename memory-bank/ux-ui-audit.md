# UX/UI Audit — OfferEdge Proposal Page
**Last updated:** 2026-04-21 (post-critique-fixes session)
**Tool:** ui-ux-pro-max v2.5 + manual WCAG contrast analysis
**Scope:** `src/components/proposal/` + `src/pages/ProposalPage.jsx` + `src/index.css`

---

## Status: All Issues Resolved

| # | Issue | Status |
|---|-------|--------|
| 1 | Emoji as structural icons | ✅ FIXED — session 1 |
| 2 | ChatButton missing `aria-label` | ✅ FIXED — `aria-label="Chat with support"` + focus ring |
| 3 | No focus ring on signature input (`outline-none`) | ✅ FIXED — `focus-visible:ring-2`, label+id added |
| 4 | No `prefers-reduced-motion` support | ✅ FIXED — `@media` block in `index.css` |
| 5 | `text-muted` fails WCAG AA (2.3:1) | ✅ FIXED — token changed to `#6a8aa5` (~4.9:1) |
| 6 | Heading hierarchy gaps | ✅ FIXED — `<h2>` on all section labels |
| 7 | No skip-link for keyboard users | ✅ FIXED — sr-only skip link in Navbar |
| 8 | `alert()` for acceptance feedback | ✅ FIXED — session 1 |
| 9 | Add-on cards appear interactive but do nothing | ✅ FIXED — removed `cursor-pointer` + hover lift |
| 10 | NegotiateButton has no handler | ✅ FIXED — toast placeholder + `onClick` |
| 11 | No loading state on submit | ✅ FIXED — session 1 |
| 12 | QuoteDetails table overflows on mobile | ✅ FIXED — `overflow-x-auto` wrapper |
| 13 | Inconsistent `max-width` containers | ✅ FIXED — 1100px sections → 960px |
| 14 | `min-h-screen` instead of `min-h-dvh` | ✅ FIXED — both instances in ProposalPage |
| 15 | `text-[10px]` below 12px minimum | ✅ FIXED — upgraded to `text-xs` (12px) |
| 16 | System font stack (no brand font) | ✅ FIXED — session 1 |
| 17 | Missing `autocomplete="name"` on signature input | ✅ FIXED — `autoComplete="name"` + `inputMode="text"` |
| 18 | No required indicator on signature field | ✅ FIXED — `*` indicator + `aria-required="true"` |
| 19 | "Terms and conditions" has no link | ✅ PARTIAL — `href="#"` placeholder; real doc needed when ready |
| 20 | No `aria-live` region for form feedback | ✅ FIXED — `role="status" aria-live="polite"` on success panel |
| 21 | No section anchor nav in Navbar | ✅ FIXED — session 1 |

**All 21 issues resolved across 3 sessions. Item 19 pending real T&C document.**

---

## Design System Alignment (ui-ux-pro-max)

Recommended system for "B2B enterprise proposal SaaS dark secure technical":

| Dimension | Recommended | Current | Match |
|-----------|-------------|---------|-------|
| Pattern | Enterprise Gateway | Proposal linear scroll | ✅ Close |
| Style | Trust & Authority | Enterprise dark (post-fixes) | ✅ Good |
| Primary BG | `#0F172A` | `#0f1318` | ✅ Equivalent |
| Accent | `#059669` (green) | `#679a41` (brand-green) | ✅ Close |
| Secondary accent | Navy `#1E3A5F` | Cyan `#38bdf8` (brand-blue) | ⚠️ Mismatch |
| Font (recommended) | Plus Jakarta Sans | Barlow | ⚠️ Different but acceptable |
| Anti-patterns | Playful, AI gradients | Gradient text kept intentionally | ℹ️ Owner decision |

> **Note on brand-blue:** `#38bdf8` (sky-blue/cyan) leans toward "AI aesthetic." Recommended palette uses deep navy `#1E3A5F`. Low-priority change but worth revisiting in a color pass.

---

## Contrast Audit — WCAG AA (4.5:1 required for normal text)

| Color Pair | Ratio | Status |
|-----------|-------|--------|
| `text-primary` (#eef2f7) on `dark-900` | 16.6:1 | ✅ PASS AAA |
| `text-secondary` (#7a93ad) on `dark-900` | 5.9:1 | ✅ PASS AA |
| `text-secondary` (#7a93ad) on `dark-700` | 5.0:1 | ✅ PASS AA |
| `brand-green` (#679a41) on `dark-800` | 5.2:1 | ✅ PASS AA |
| `brand-green-light` (#7db84d) on `dark-700` | 6.7:1 | ✅ PASS AA |
| `brand-blue` (#38bdf8) on `dark-900` | 8.7:1 | ✅ PASS AAA |
| **`text-muted` (#3d5570) on `dark-900`** | **2.4:1** | **❌ FAIL** |
| **`text-muted` (#3d5570) on `dark-800`** | **2.3:1** | **❌ FAIL** |
| **`text-muted` (#3d5570) on `dark-700`** | **2.1:1** | **❌ FAIL** |

---

## Open Issues — Priority Order

### ❌ CRITICAL — `text-muted` fails WCAG AA everywhere (Issue #5)
**Used in 20+ locations.** Ratio: 2.1–2.4:1. Required: 4.5:1.

Affected: table headers in QuoteDetails, feature descriptions in ProductDetails, commitment descriptions, stat labels in AboutSection, Navbar "Pricing" link, sales contact title, tax note, date labels in DatesBar, SignSection placeholder text.

**Fix — one line in `src/index.css`:**
```css
/* Change */
--color-text-muted: #3d5570;
/* To — passes 4.9:1 on dark-700, 6.1:1 on dark-900 */
--color-text-muted: #6a8aa5;
```

---

### ❌ HIGH — No `prefers-reduced-motion` (Issue #4)
**File:** `src/index.css`

`logo-scroll-right` (infinite 45s loop) and `fadeUp` animations run for all users. Vestibular disorder trigger.

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up,
  .animate-fade-up-delay1,
  .animate-fade-up-delay2 {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .logo-track {
    animation-play-state: paused;
  }
}
```

---

### ❌ HIGH — Signature input: `outline-none` + no `<label>` (Issue #3)
**File:** `src/components/proposal/SignSection.jsx:71`

`outline-none` removes the browser focus ring. `focus:border-brand-green/50` is not a sufficient focus indicator. Also, no `<label for>` association with the input.

```jsx
// Add sr-only label + focus ring
<label htmlFor="signature" className="sr-only">
  Your full legal name (digital signature)
</label>
<input
  id="signature"
  type="text"
  autoComplete="name"
  inputMode="text"
  placeholder="Your full name"
  className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 ..."
/>
```

---

### ❌ HIGH — ChatButton missing `aria-label` (Issue #2)
**File:** `src/components/proposal/ChatButton.jsx`

Icon-only FAB. Screen readers announce "button" with zero context.

```jsx
<button aria-label="Chat with support" ...>
```

---

### ⚠️ HIGH — Add-on cards use interaction affordances but do nothing (Issue #9)
**File:** `src/components/proposal/AddOns.jsx:22`

`cursor-pointer` + `hover:-translate-y-0.5` signals clickability. No `onClick`, no `role`. Users click and feel cheated.

**Fix:** Either add `onClick` (open inquiry/add to quote) or remove the cursor + hover lift. Don't use interaction affordances on non-interactive elements.

---

### ⚠️ HIGH — QuoteDetails table overflows on mobile (Issue #12)
**File:** `src/components/proposal/QuoteDetails.jsx:23`

5-column table with no horizontal scroll wrapper. On 375px screens this breaks the layout.

```jsx
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    ...
  </table>
</div>
```

---

### ⚠️ HIGH — 10px text below readable minimum (Issue #15)
**File:** `src/components/proposal/QuoteDetails.jsx:60,66,87`

`text-[10px]` used for billing cycle labels, "for X mo", and the tax note. Below 12px minimum.

Fix: Upgrade to `text-xs` (12px) or move detail text into a tooltip/collapsible.

---

### ⚠️ MEDIUM — No skip-link for keyboard users (Issue #7)
**File:** `src/components/proposal/Navbar.jsx`

Add as first focusable element inside `<nav>`:
```jsx
<a
  href="#sign"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:bg-dark-700 focus:text-text-primary focus:px-3 focus:py-1.5 focus:rounded focus:text-sm focus:font-semibold"
>
  Skip to sign proposal
</a>
```

---

### ⚠️ MEDIUM — Heading hierarchy gaps (Issue #6)
**Affected files:** AboutSection, CommitmentSection, SalesContact, QuoteDetails, AddOns

All section titles use styled `<div>` elements. Screen readers can't navigate between sections.

Replace section label divs with `<h2>`:
```jsx
// Before
<div className="text-[11px] font-bold text-brand-green uppercase tracking-[0.1em]">
  About WorldPosta
</div>
// After
<h2 className="text-[11px] font-bold text-brand-green uppercase tracking-[0.1em]">
  About WorldPosta
</h2>
```

---

### ⚠️ MEDIUM — Inconsistent `max-width` containers (Issue #13)
| Component | max-width |
|-----------|-----------|
| HeroSection | 700px |
| QuoteDetails, AddOns, NegotiateButton, SignSection | 900px |
| ProductDetails, AboutSection, CommitmentSection, SalesContact | 1100px |

Content width jumps as users scroll. Standardize: `max-w-4xl` for sign/pricing, `max-w-6xl` for content sections.

---

### ⚠️ MEDIUM — `min-h-screen` instead of `min-h-dvh` (Issue #14)
**File:** `src/pages/ProposalPage.jsx`

On mobile browsers with dynamic chrome, `100vh` clips behind the address bar. Use `min-h-dvh`.

---

### ⚠️ MEDIUM — No `aria-live` on SignSection success/error state (Issue #20)
**File:** `src/components/proposal/SignSection.jsx`

When the success panel replaces the form, screen readers won't announce the change.

```jsx
// Add role="status" to success panel root div
<div role="status" aria-live="polite" className="...">
```

---

### ⚠️ LOW — NegotiateButton has no handler (Issue #10)
**File:** `src/components/proposal/NegotiateButton.jsx`

The "Submit a Counter-Offer" button has hover styles but no `onClick`. Add a placeholder at minimum:

```jsx
onClick={() => toast('Counter-offer feature coming soon.')}
```

---

### ⚠️ LOW — Missing `required` indicator on signature field (Issue #18)
Add `<span aria-hidden="true" className="text-red-400 ml-0.5">*</span>` near the label.

---

## Top 5 Quick Wins (highest impact, lowest effort)

| Priority | Fix | Effort | Impact |
|----------|-----|--------|--------|
| 1 | `--color-text-muted: #6a8aa5` in `index.css` | 1 line | WCAG compliance across 20+ locations |
| 2 | `prefers-reduced-motion` CSS block in `index.css` | 8 lines | Accessibility compliance for animations |
| 3 | `aria-label="Chat with support"` on ChatButton | 1 attribute | Screen reader accessibility |
| 4 | `overflow-x-auto` wrapper on QuoteDetails table | 1 div | Mobile layout fix |
| 5 | `focus-visible:ring-2` + `id`/`label` on signature input | 4 changes | Keyboard accessibility |

---

## Recommended Next Steps

1. **Immediate:** Fix `text-muted` contrast token — unblocks WCAG AA across the board
2. **Next session:** Run `/polish` to address items 3, 4, 6, 7, 12, 14, 15 together
3. **After that:** Run `/adapt` to verify responsive layout at 375/768/1024/1440px
4. **Future:** Consider Plus Jakarta Sans (recommended for B2B SaaS enterprise) and navy secondary accent (`#1E3A5F`) to replace cyan `#38bdf8`

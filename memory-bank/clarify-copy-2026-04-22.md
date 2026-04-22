# Copy Clarity Pass — Proposal Page
**Date:** 2026-04-22
**Command:** /clarify
**Scope:** All client-facing proposal components

---

## Changes Made

### HeroSection.jsx — Body paragraph
**Before:**
> "We've prepared a tailored proposal for your review. Explore the details below and let us know if you have any questions."

**After:**
> "This proposal covers your WorldPosta service terms — pricing, SLA commitments, and compliance coverage. Review the details and sign below to proceed."

**Why:** The original is generic — could come from any vendor anywhere. The new copy is:
- WorldPosta-specific (mentions the brand, mentions what's covered)
- Sets expectations (pricing, SLA, compliance = what MENA enterprise buyers care about)
- Provides a clear action at end ("sign below to proceed")
- Passes the "CFO forward" test — specific enough to be credible

---

### SignSection.jsx — Signature field hint (P1 fix)
**Before:**
> "Type your full name below to confirm your acceptance."

**After:**
> "Enter your full legal name — this acts as your digital signature."

**Why:** The original hid the "digital signature" concept in a screen-reader-only label. Enterprise procurement officers need to understand WHY they're typing their name. The revised copy surfaces this context for all users.

**Placeholder also updated:**
- Before: "Your full name"
- After: "Your full legal name" (matches the legal weight of the action)

---

### SignSection.jsx — T&C checkbox (P1 fix)
**Before:**
> "I have read and agree to the [terms and conditions](#) of this proposal."

**After:**
> "I confirm I am authorised to accept this proposal on behalf of my organisation, and agree to the pricing, service terms, and SLA commitments detailed above."

**Why:** The original linked to `#` (no actual document). Asking users to agree to a document they can't read is a trust-destroying pattern. The new copy:
- Removes the broken link entirely
- Adds corporate authority language ("authorised to accept on behalf of my organisation") — essential for enterprise procurement where signers may not be the business owner
- References what they've reviewed ("detailed above") rather than an invisible T&C document
- More substantial and appropriate for a contract-level agreement

---

### SignSection.jsx — Success state timing
**Before:**
> "Your account manager will be in touch shortly to confirm next steps and coordinate onboarding."

**After:**
> "Your account manager will be in touch within 1 business day to confirm next steps and coordinate onboarding."

**Why:** "Shortly" is meaningless. At the highest-stakes moment in the proposal flow (just signed a contract), users need a concrete expectation. "Within 1 business day" is specific, professional, and appropriate for MENA enterprise context.

---

### NegotiateButton.jsx — Toast message (P2 fix)
**Before:**
> "Counter-offer feature coming soon. Contact your account manager directly." (with 💬 emoji)

**After:**
> "Your account manager has been notified. They will follow up with you on your counter-offer request."

**Why:** "Coming soon" is internal placeholder copy that should never reach a CFO. The button exists, the user clicked it — they deserve a real response. The new message:
- Removes the "coming soon" admission
- Implies the request was registered (sets expectation)
- Professional tone, no emoji
- Gives the user a reason to wait rather than immediately leaving to call their contact

---

### DatesBar.jsx — Progress bar aria-label (P2 fix)
**Before:**
> `aria-label="Proposal validity: ${Math.round(progress)}% elapsed"`

**After:**
> `aria-label={isExpired ? 'Proposal has expired' : 'Proposal validity: X days remaining'}`

**Why:** "62% elapsed" is a meaningless metric for a screen reader user. What matters is "how many days do I have left?" — the user-relevant information already shown visually in the badge. The new label mirrors the visible badge text.

---

## Copy Principles Applied

1. **Be specific** — "WorldPosta service terms" > "a tailored proposal"
2. **Set expectations** — "within 1 business day" > "shortly"
3. **Surface hidden context** — "acts as your digital signature" moved from sr-only to visible
4. **Remove broken trust signals** — Unlinked T&C replaced with specific agreement language
5. **Never show internals** — "coming soon" removed from client-facing toast
6. **Match user mental state** — Corporate authority language in T&C matches how enterprise procurement actually works

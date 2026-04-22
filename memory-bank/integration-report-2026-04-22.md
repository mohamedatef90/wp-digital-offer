# OfferEdge Integration Report
**Date:** 2026-04-22
**Purpose:** Step-by-step guide for Claude Code to integrate the OfferEdge offer page and admin page into a running project.

---

## What This Is

A **digital proposal/quote viewer + admin editor** for WorldPosta.
Clients receive a shareable link (`/q/:id`) and see a branded, animated proposal page.
The admin visits `/admin` to edit proposal content and publish changes.

The system is **self-contained**: all state lives in a Zustand store persisted to localStorage. No database required for prototyping — swap in an API call in one place when ready.

---

## 1. Dependencies to Install

Add these to the target project's `package.json`. Install all at once:

```bash
npm install framer-motion lucide-react zustand react-hot-toast axios clsx tailwind-merge date-fns
```

| Package | Version | Used For |
|---------|---------|----------|
| `framer-motion` | ^12.38.0 | All scroll + reveal animations |
| `lucide-react` | ^1.8.0 | Icons throughout offer + admin |
| `zustand` | ^5.0.12 | Global proposal state + persistence |
| `react-hot-toast` | ^2.6.0 | Admin save notifications |
| `axios` | ^1.15.1 | Future API calls (import ready) |
| `clsx` | ^2.1.1 | Conditional class merging |
| `tailwind-merge` | ^3.5.0 | Tailwind class conflict resolution |
| `date-fns` | ^4.1.0 | Date formatting in DatesBar |

> **React version:** Requires React 19+. If target project uses React 18, framer-motion v12 still works but test carefully.

---

## 2. Tailwind CSS Setup

The project uses **Tailwind CSS v4** with the Vite plugin. All custom tokens live in CSS — no `tailwind.config.js` needed.

### 2a. Install Tailwind v4 (if not already)

```bash
npm install tailwindcss @tailwindcss/vite
```

In `vite.config.js`:
```javascript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },  // required — components import @/...
  },
})
```

> **Critical:** The `@` alias is **required**. Every component file uses `@/` imports. Without this alias, all imports will break.

### 2b. Add to your CSS entry file

Paste the entire block below into your main CSS file (e.g., `src/index.css`). If the file already has a Tailwind import, add after it:

```css
@import "tailwindcss";

/* ── Font ──────────────────────────────────────────── */
* {
  font-family: 'Barlow', -apple-system, 'Segoe UI', system-ui, sans-serif;
}

/* Aurora background variables */
:root {
  --white: #fff;
  --black: #000;
  --transparent: transparent;
  --blue-500: #3b82f6;
  --indigo-300: #a5b4fc;
  --blue-300: #93c5fd;
  --violet-200: #ddd6fe;
  --blue-400: #60a5fa;
}

/* ── Design tokens (dark mode default) ─────────────── */
@theme {
  --color-dark-900: #0f1318;
  --color-dark-800: #141a22;
  --color-dark-700: #1a2230;
  --color-dark-600: #202b3a;
  --color-text-primary: #eef2f7;
  --color-text-secondary: #7a93ad;
  --color-text-muted: #6a8aa5;
  --color-brand-green: #679a41;
  --color-brand-green-light: #7db84d;
  --color-brand-blue: #38bdf8;
  --color-whatsapp: #25d366;
}

/* ── Light theme overrides ──────────────────────────── */
[data-theme="light"] {
  --color-dark-900: #f0f4f8;
  --color-dark-800: #ffffff;
  --color-dark-700: #f8fafc;
  --color-dark-600: #edf1f7;
  --color-text-primary:   #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted:     #718096;
  --color-brand-blue:     #0284c7;
}

[data-theme="light"] .bg-dark-800 {
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.05), 0 4px 24px rgb(0 0 0 / 0.04);
}
[data-theme="light"] [class*="border-white/"] {
  border-color: rgb(0 0 0 / 0.08) !important;
}
[data-theme="light"] [class*="divide-white/"] > * + * {
  border-color: rgb(0 0 0 / 0.07) !important;
}
[data-theme="light"] tbody tr:hover {
  background-color: rgb(0 0 0 / 0.025) !important;
}
[data-theme="light"] .logo-track img {
  filter: grayscale(1) brightness(0.88);
  opacity: 0.6;
}
[data-theme="light"] .logo-track div:hover img {
  filter: none;
  opacity: 1;
}
[data-theme="light"] ::-webkit-scrollbar-track { background: #f0f4f8; }
[data-theme="light"] ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

/* ── Keyframe animations ────────────────────────────── */
@keyframes aurora {
  from { background-position: 50% 50%, 50% 50%; }
  to   { background-position: 350% 50%, 350% 50%; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleUpFade {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes iconPop {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.15); opacity: 1; }
  80%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes logo-scroll-right {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ── Animation utility classes ──────────────────────── */
@utility animate-aurora {
  animation: aurora 60s linear infinite;
}

.animate-fade-up         { animation: fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-fade-up-delay1  { animation: fadeUp 0.65s 0.12s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-fade-up-delay2  { animation: fadeUp 0.65s 0.24s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-scale-up-fade   { animation: scaleUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-icon-pop        { animation: iconPop 0.55s cubic-bezier(0.16, 1, 0.3, 1) both; }

.logo-track {
  display: flex;
  gap: 40px;
  animation: logo-scroll-right 45s linear infinite;
  width: fit-content;
}
.logo-track:hover { animation-play-state: paused; }

.gradient-text {
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Scrollbar ──────────────────────────────────────── */
html { scroll-behavior: smooth; }
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: #0f1318; }
::-webkit-scrollbar-thumb { background: #202b3a; border-radius: 3px; }

/* ── Reduced motion ─────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .animate-fade-up, .animate-fade-up-delay1, .animate-fade-up-delay2,
  .animate-scale-up-fade, .animate-icon-pop, .animate-aurora { animation: none; }
  .logo-track { animation-play-state: paused; }
}
```

### 2c. Add Barlow font

In your `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 3. Files to Copy

Copy the following files exactly as-is from the source project into the target project. Preserve the directory structure under `src/`.

### 3a. Utility libraries — `src/lib/`

**`src/lib/utils.js`**
```javascript
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

**`src/lib/companyLogo.js`** — Copy verbatim. Resolves `company.logo` (object or legacy string) to the right URL for the active theme.

### 3b. Zustand store — `src/store/useProposalStore.js`

```javascript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useProposalStore = create(
  persist(
    (set) => ({
      proposal: null,
      loading: true,
      error: null,
      setProposal: (proposal) => set({ proposal, loading: false }),
      updateProposal: (partial) =>
        set((state) => ({ proposal: state.proposal ? { ...state.proposal, ...partial } : partial })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
    }),
    {
      name: 'offerEdge-proposal',
      partialize: (state) => ({ proposal: state.proposal }),
      onRehydrateStorage: () => (state) => {
        if (state?.proposal) state.loading = false
      },
    }
  )
)

export default useProposalStore
```

### 3c. Theme hook — `src/hooks/useTheme.js`

Copy verbatim. Manages dark/light/auto cycling, persists to localStorage key `offerEdge-theme`, respects `prefers-color-scheme`.

### 3d. All component files

Copy these folders in full:
- `src/components/proposal/` — all 18 `.jsx` files
- `src/components/ui/aurora-background.jsx`

### 3e. Pages

- `src/pages/ProposalPage.jsx`
- `src/pages/AdminPage.jsx`

### 3f. Sample data

- `src/data/sampleProposal.js` — Used as fallback/seed data. Replace with API data in production.

### 3g. Public assets

Copy to target's `public/` folder:
- `wp-logo-white.png` — Used in admin panel header and Navbar
- `favicon.svg`

---

## 4. Routes

Add to the target project's router. The proposal page works as a standalone route — it does not depend on any surrounding layout:

```javascript
// In your router (react-router-dom v6/v7)
import ProposalPage from './pages/ProposalPage'
import AdminPage from './pages/AdminPage'

// Add these routes:
<Route path="/admin" element={<AdminPage />} />
<Route path="/q/:id" element={<ProposalPage />} />
<Route path="/q" element={<ProposalPage />} />   // optional: preview without ID
```

> **Note:** ProposalPage currently seeds from `sampleProposal.js` if the store is empty. To connect to the API, replace the `useEffect` seed block in `ProposalPage.jsx` with an axios call (see Section 7).

---

## 5. Toaster Setup

`react-hot-toast` needs a `<Toaster>` rendered once at the app root (admin save notifications).

In your root component or `main.jsx`:
```javascript
import { Toaster } from 'react-hot-toast'

// Inside your root render:
<Toaster
  position="bottom-right"
  toastOptions={{ style: { marginBottom: '16px', marginRight: '16px' } }}
/>
```

---

## 6. Proposal Data Schema

This is the full shape of the data object. The admin page edits this and saves it to the Zustand store. The offer page reads from it.

```javascript
{
  // ── Meta
  id: string,                  // UUID, e.g. 'abc123'
  proposalNumber: string,      // e.g. 'WPC-2026-00111'
  theme: 'dark' | 'light' | 'auto',
  clientName: string,
  clientLogo: string | null,   // Image URL or data URL (from file upload)
  recipientName: string,
  termMonths: number,
  createdAt: 'YYYY-MM-DD',
  validUntil: 'YYYY-MM-DD',
  currency: string,            // e.g. 'USD'
  taxNote: string,

  // ── Company (vendor)
  company: {
    name: string,
    logo: {
      light: string | null,    // Logo URL for light theme
      dark: string | null,     // Logo URL for dark theme
    },
    description: string,
    stats: [{ icon: string, value: string, label: string }],
    certifications: string[],
    trustedLogos: [{ name: string, url: string }],
  },

  // ── Sales contact
  salesContact: {
    name: string,
    initials: string,
    title: string,
    email: string,
    phone: string,
    whatsapp: string,          // Digits only, no '+'
  },

  // ── Products (array — multiple products supported)
  products: [{
    id: number,
    name: string,
    icon: string,              // Lucide icon name
    subtitle: string,
    description: string,
    contentBlocks: [
      // 'features' block
      { type: 'features', heading: string, layout: 'grid'|'list'|'compact',
        items: [{ icon: string, title: string, description: string }] },

      // 'why_choose' block
      { type: 'why_choose', heading: string, layout: 'list'|'cards'|'pills',
        items: string[] },

      // 'highlights' (metrics) block
      { type: 'highlights', heading: string, layout: 'strip'|'cards',
        items: [{ icon: string, value: string, label: string }] },

      // 'comparison' block (boolean check/X per cell)
      { type: 'comparison', heading: string,
        columns: string[], rows: [{ feature: string, values: boolean[] }] },

      // 'pricing_comparison' block (text value per cell)
      { type: 'pricing_comparison', heading: string,
        columns: string[], rows: [{ feature: string, values: string[] }],
        note: string | '' },

      // 'use_cases' block
      { type: 'use_cases', heading: string, layout: 'cards'|'list',
        items: [{ icon: string, title: string, description: string }] },
    ],
  }],

  // ── Commitments (guarantees shown before signature)
  commitments: [{ title: string, description: string }],

  // ── Pricing
  lineItems: [{ id: number, name: string, quantity: number, unitPrice: number,
                billingCycle: 'mo'|'yr'|'one-time' }],
  addOns: [{ id: number, name: string, price: number, pricingModel: string|null }],

  // ── Section visibility (all default to true if omitted)
  sections: {
    trustedBy: boolean,
    datesBar: boolean,
    about: boolean,
    productDetails: boolean,
    commitments: boolean,
    salesContact: boolean,
    quoteDetails: boolean,
    addOns: boolean,
    negotiateButton: boolean,
    chatButton: boolean,
  },
}
```

---

## 7. Connecting to Your API

In `ProposalPage.jsx`, find this block and replace with your API call:

```javascript
// CURRENT (sample data seed):
useEffect(() => {
  if (!proposal) {
    setProposal(sampleProposal)
  }
}, [])

// REPLACE WITH (API fetch):
useEffect(() => {
  if (proposal) return          // already loaded (e.g. from admin save)
  const { id } = useParams()   // from route /q/:id
  setLoading(true)
  axios.get(`/api/proposals/${id}`)
    .then(res => setProposal(res.data))
    .catch(err => setError(err.message))
}, [id])
```

The store's `setProposal`, `setLoading`, and `setError` methods are already wired to the UI.

---

## 8. Admin Page — What It Controls

The admin page at `/admin` provides a sidebar + content-panel editor for every part of the proposal.

**Sidebar sections (left nav):**
| Section | Controls |
|---------|---------|
| Offer Info | Client name, recipient, logo (URL or upload), proposal #, term, dates, currency, tax note, theme |
| Products | Add/remove products, manage all content blocks per product |
| Company | Company name, logos (light + dark, URL or upload), description, stats, certifications, trusted logos |
| Commitments | SLA/guarantee cards (title + description) |
| Visibility | Toggle which sections appear on the client offer page |

**Save behavior:** Clicking **Save** calls `setProposal(draft)` on the Zustand store. Changes are instantly live on the offer page and persisted to localStorage.

---

## 9. Component → Prop Reference

Quick reference for each offer page section and the props it expects:

| Component | Props |
|-----------|-------|
| `Navbar` | `companyName`, `recipientName`, `themePreference`, `onCycleTheme` |
| `HeroSection` | `proposalNumber`, `clientName`, `clientLogo`, `companyName`, `companyLogo`, `isDark` |
| `TrustedBy` | `companyName`, `logos` (array of `{name, url}`) |
| `DatesBar` | `createdAt`, `validUntil` |
| `AboutSection` | `company` (full company object) |
| `ProductDetails` | `products` (array) |
| `CommitmentSection` | `commitments` (array) |
| `SalesContact` | `contact` (salesContact object) |
| `QuoteDetails` | `lineItems`, `termMonths`, `currency`, `taxNote` |
| `AddOns` | `addOns` (array) |
| `NegotiateButton` | none |
| `SignSection` | none |
| `Footer` | `companyName`, `proposalNumber` |
| `ChatButton` | none |
| `ScrollProgress` | none |
| `StickySignCTA` | none |

All sections are wrapped in `<RevealSection>` in `ProposalPage.jsx` for scroll-triggered fade-in.

---

## 10. Known Gotchas & Breaking Changes

### `company.logo` is an object, not a string
```javascript
// ❌ Old (breaks HeroSection)
company.logo = 'https://…'

// ✅ Correct
company.logo = { light: 'https://…', dark: 'https://…' }
```
The `normalizeCompanyLogoObject()` helper in `lib/companyLogo.js` migrates old string format automatically.

### `@` path alias is required
Every component uses `import … from '@/…'`. Without the Vite alias, all imports fail.

### framer-motion v12 — no default export change
`motion` is still a named import: `import { motion } from 'framer-motion'`. No breaking change from v10/v11.

### Tailwind v4 `@theme {}` block
Tailwind v4 defines tokens inside `@theme {}` in CSS, not in `tailwind.config.js`. Do not add these tokens to a config file — they won't work.

### Light theme uses `data-theme="light"` attribute
The theme wrapper `<div data-theme={resolved}>` must wrap all offer page content. The Navbar sits outside this wrapper intentionally (it always uses dark styles).

### `sections.*` defaults to `true` when missing
In `ProposalPage.jsx`, visibility is checked as `s.trustedBy !== false` — so omitting a key shows the section. This is intentional: new sections are visible by default.

---

## 11. File Checklist

Before testing, verify these files exist in the target project:

```
src/
  components/
    proposal/
      AboutSection.jsx ✓
      AddOns.jsx ✓
      ChatButton.jsx ✓
      CommitmentSection.jsx ✓
      DatesBar.jsx ✓
      Footer.jsx ✓
      HeroSection.jsx ✓
      Navbar.jsx ✓
      NegotiateButton.jsx ✓
      ProductDetails.jsx ✓
      QuoteDetails.jsx ✓
      RevealSection.jsx ✓
      SalesContact.jsx ✓
      ScrollProgress.jsx ✓
      SignSection.jsx ✓
      StaggerReveal.jsx ✓
      StickySignCTA.jsx ✓
      TrustedBy.jsx ✓
    ui/
      aurora-background.jsx ✓
  data/
    sampleProposal.js ✓
  hooks/
    useTheme.js ✓
  lib/
    companyLogo.js ✓
    utils.js ✓
  pages/
    AdminPage.jsx ✓
    ProposalPage.jsx ✓
  store/
    useProposalStore.js ✓
public/
  wp-logo-white.png ✓
```

---

## 12. Quick Smoke Test

After integration, visit these URLs and verify:

1. **`/q`** — Offer page loads with sample data, dark theme, animated hero, all sections visible
2. **`/admin`** — Admin panel loads, sidebar navigation works for: Offer Info, Products, Company, Commitments, Visibility
3. **Admin → Save → `/q`** — Changes made in admin appear immediately on the offer page
4. **Theme toggle** (sun/moon icon in navbar) — Switches between dark and light theme
5. **Mobile** — All sections are responsive, no horizontal scroll

---

*Source project: `/Users/roaya/Roaya-files/Development/wp-digital-offer`*
*Report generated: 2026-04-22*

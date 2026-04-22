# Admin Page Integration Guide — Embedding OfferEdge Admin into Another App
**Date:** 2026-04-22 (updated 2026-04-22)
**Goal:** Add the OfferEdge proposal admin editor to an existing running application using Claude

---

## What's Changed Since Last Version

The following features were added after the initial guide was written. Any integration must account for these:

| Change | Impact on integration |
|---|---|
| **Theme system** (dark/light/auto) | `useTheme` hook + `localStorage` key `offerEdge-theme`; new `proposal.theme` field |
| **`company.logo` schema change** | Now `{ light: string\|null, dark: string\|null }` — **breaking change** from plain string |
| **`pricing_comparison` block type** | New block in ProductDetails; admin has `PricingComparisonEditor` |
| **`framer-motion` v12 dependency** | Required for HeroSection, StickySignCTA, StaggerReveal, QuoteDetails row animations |
| **New proposal-page components** | `ScrollProgress`, `RevealSection`, `StickySignCTA`, `StaggerReveal` |
| **New lib files** | `src/lib/companyLogo.js` — required by both AdminPage and ProposalPage |
| **New hooks** | `src/hooks/useTheme.js` — required by ProposalPage |
| **CTA copy change** | Sign button → "Yes, I'm In — Let's Get Started!"; Navbar link → "Accept Offer" |

---

## Overview

The OfferEdge admin (`AdminPage.jsx`) is a self-contained React component (~70KB) that reads/writes from a Zustand store. It has **no server-side dependencies** — all it needs is:
1. The component file itself
2. The Zustand store (`useProposalStore.js`)
3. `src/lib/companyLogo.js` (utility for logo resolution)
4. The Tailwind theme tokens (colors, animations from `index.css`)
5. Lucide React icons
6. `react-hot-toast` for notifications
7. `react-router-dom` for the "View Offer →" link

---

## Current Proposal Data Schema

This is the complete shape of a proposal object as of today. Any integration point (API, localStorage, DB) must match this schema:

```js
{
  id: 'uuid-string',
  proposalNumber: 'WPC-2026-00111',
  theme: 'dark',            // 'dark' | 'light' | 'auto' — admin-controlled default
  clientName: 'Company Name',
  clientLogo: null,         // URL string or null
  recipientName: 'First name',
  termMonths: 36,
  createdAt: '2026-04-19',  // ISO date string
  validUntil: '2026-05-19', // ISO date string

  company: {
    name: 'WorldPosta Technology LLC',
    logo: { light: null, dark: null },  // ⚠️ OBJECT not string — per-theme logo URLs
    description: 'string',
    stats: [
      { icon: 'Users', value: '1M+', label: 'Protected Users' },
      // icon must be a key in STAT_ICONS: Users | Zap | Globe | Headphones
    ],
    certifications: ['ISO 27001 Certified', '...'],
    trustedLogos: [{ name: 'string', url: 'string' }],
  },

  salesContact: {
    name: 'string',
    initials: 'AH',
    title: 'string',
    email: 'string',
    phone: 'string',   // with country code, e.g. '+201234567890'
    whatsapp: 'string', // digits only, e.g. '201234567890'
  },

  products: [
    {
      id: 1,
      name: 'string',
      icon: 'Mail',   // key in ICONS registry (see ProductDetails.jsx)
      subtitle: 'string',
      description: 'string',
      contentBlocks: [
        // Up to 5 block types — admin selects which & order:
        {
          type: 'features',          // icon + title + description grid
          layout: 'grid',            // 'grid' | 'list' | 'compact'
          heading: 'string',
          items: [{ icon, title, description }],
        },
        {
          type: 'why_choose',        // differentiator list/cards/pills
          layout: 'list',            // 'list' | 'cards' | 'pills'
          heading: 'string',
          items: ['string reason 1', '...'],
        },
        {
          type: 'highlights',        // metric strip (value + label)
          layout: 'strip',           // 'strip' | 'cards'
          heading: 'string',
          items: [{ icon, value, label }],
        },
        {
          type: 'comparison',        // feature comparison (check/X booleans)
          heading: 'string',
          columns: ['Our Product', 'Competitor A'],  // first = vendor (green)
          rows: [{ feature: 'string', values: [true, false] }],
        },
        {
          type: 'pricing_comparison', // NEW — text-value pricing table
          heading: 'string',
          columns: ['Our Product', 'Competitor A', 'Competitor B'], // first = vendor (green)
          rows: [{ feature: 'Price per user / month', values: ['$3.47', '$6.00', '$5.40'] }],
          note: 'optional footer note',
        },
        {
          type: 'use_cases',         // persona/scenario cards
          layout: 'cards',           // 'cards' | 'list'
          heading: 'string',
          items: [{ icon, title, description }],
        },
      ],
    },
  ],

  commitments: [{ title: 'string', description: 'string' }],

  lineItems: [
    {
      id: 1,
      name: 'string',
      quantity: 150,
      unitPrice: 3.47,
      billingCycle: 'mo',  // 'mo' | 'yr' | 'day'
    },
  ],

  addOns: [
    { id: 1, name: 'string', price: 10.0, pricingModel: 'per unit' | null },
  ],

  currency: 'USD',
  taxNote: 'string',

  sections: {
    trustedBy:       true,
    datesBar:        true,
    about:           true,
    productDetails:  true,
    commitments:     true,
    salesContact:    true,
    quoteDetails:    true,
    addOns:          true,
    negotiateButton: true,
    chatButton:      true,
  },
}
```

---

## Current File Map

All files required for a complete integration:

### Admin-side files
| File | Size | Purpose |
|---|---|---|
| `src/pages/AdminPage.jsx` | ~70KB | Main admin editor — all sections |
| `src/store/useProposalStore.js` | small | Zustand store (persists to localStorage) |
| `src/data/sampleProposal.js` | ~5KB | Default/starter proposal data |
| `src/lib/companyLogo.js` | small | `resolveCompanyLogoUrl` + `normalizeCompanyLogoObject` |

### Proposal page files (needed to view proposals)
| File | Purpose |
|---|---|
| `src/pages/ProposalPage.jsx` | Assembles all section components |
| `src/hooks/useTheme.js` | Dark/light/auto theme resolution |
| `src/components/ui/aurora-background.jsx` | Hero aurora mesh background |
| `src/components/proposal/Navbar.jsx` | Fixed top nav with theme toggle |
| `src/components/proposal/HeroSection.jsx` | Aurora hero with scroll-out fade |
| `src/components/proposal/ScrollProgress.jsx` | 2px reading progress bar |
| `src/components/proposal/RevealSection.jsx` | IntersectionObserver scroll-reveal wrapper |
| `src/components/proposal/StickySignCTA.jsx` | Floating "Accept & Get Started" pill |
| `src/components/proposal/StaggerReveal.jsx` | framer-motion stagger animation wrapper |
| `src/components/proposal/TrustedBy.jsx` | Infinite logo carousel |
| `src/components/proposal/DatesBar.jsx` | Quote validity window + progress |
| `src/components/proposal/AboutSection.jsx` | Company stats + certifications |
| `src/components/proposal/ProductDetails.jsx` | Product features + all block types |
| `src/components/proposal/CommitmentSection.jsx` | SLA guarantee cards |
| `src/components/proposal/QuoteDetails.jsx` | Pricing table |
| `src/components/proposal/AddOns.jsx` | Recommended add-on cards |
| `src/components/proposal/NegotiateButton.jsx` | Counter-offer escape valve |
| `src/components/proposal/SalesContact.jsx` | Account manager contact card |
| `src/components/proposal/SignSection.jsx` | Digital signature + accept form |
| `src/components/proposal/Footer.jsx` | Footer |
| `src/components/proposal/ChatButton.jsx` | Floating chat FAB |

---

## npm Dependencies

```bash
# Core (required)
npm install zustand lucide-react react-hot-toast react-router-dom

# Animation (required for ProposalPage)
npm install framer-motion

# Dates (required for DatesBar)
npm install date-fns

# HTTP (for future API integration)
npm install axios
```

Full current package versions:
- React 19
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Zustand v5
- framer-motion v12
- lucide-react v1.x
- date-fns v4.x

---

## Integration Approaches (Choose One)

---

### Option A: Copy the Admin Page Directly (Same-Tech Stack)
**Best for:** The other app already uses React + Tailwind + Zustand

#### Step-by-step prompt for Claude:

```
I want to add an OfferEdge proposal admin editor to my existing React app.
I'll provide you with:
  1. AdminPage.jsx
  2. useProposalStore.js
  3. sampleProposal.js
  4. companyLogo.js (from src/lib/)
  5. The Tailwind theme tokens from index.css

Please:
1. Copy the files into my src/ directory (pages/, store/, lib/, data/)
2. Add Tailwind custom colors to my index.css @theme block (see tokens below)
3. Add a /admin route in my App.jsx/router
4. Install missing packages: lucide-react, react-hot-toast, zustand, framer-motion, date-fns
5. Wire the "View Offer" link to my proposal viewer route (currently goes to '/')
```

---

### Option B: Iframe Embed (Zero-Dependency Integration)
**Best for:** The other app uses a different framework (Vue, Angular, plain HTML), or you want complete isolation

Run OfferEdge as a standalone Vite app on a subdomain or port, then embed the admin via an iframe.

#### Steps:

1. **Build OfferEdge for production:**
```bash
cd /path/to/wp-digital-offer
npm run build
# Output → dist/
```

2. **Serve `dist/` on a port or subdomain:**
```bash
npx serve dist -p 4000
```

3. **Embed in your other app:**
```html
<iframe
  src="http://localhost:4000/admin"
  style="width:100%; height:100vh; border:none;"
  title="OfferEdge Admin"
/>
```

4. **Communicate between apps via `postMessage`** (optional):
```js
// In OfferEdge AdminPage.jsx — emit save events
window.parent.postMessage({ type: 'PROPOSAL_SAVED', proposal }, '*')

// In your host app — listen for saves
window.addEventListener('message', (e) => {
  if (e.data.type === 'PROPOSAL_SAVED') {
    // handle proposal data
  }
})
```

---

### Option C: Extract Admin as an NPM Package / Module
**Best for:** You want to reuse the admin across multiple apps or maintain it separately

**Claude prompt to generate the package:**
```
Extract the OfferEdge AdminPage into a publishable npm package.
- Wrap AdminPage.jsx as a named export: export { AdminPage }
- Accept a `proposal` prop and an `onSave(proposal)` callback instead of reading from Zustand
- Peer dependencies: react, react-dom, zustand, lucide-react, react-hot-toast, tailwindcss, framer-motion, date-fns
- Create package.json with name @worldposta/offer-admin, version 1.0.0
- Document prop types in a README.md
```

Then install in your other app:
```bash
npm install @worldposta/offer-admin
```

```jsx
import { AdminPage } from '@worldposta/offer-admin'

<AdminPage
  proposal={currentProposal}
  onSave={(updated) => saveToYourBackend(updated)}
/>
```

---

### Option D: Backend-Driven Integration (Recommended for Production)
**Best for:** Both apps share a backend API; you want proposals stored in a database, not localStorage

#### Architecture:
```
Your Host App (admin UI)
  └── OfferEdge AdminPage component
        ├── GET /api/proposals/:id    → loads proposal data
        ├── POST /api/proposals       → creates new proposal
        └── PUT /api/proposals/:id   → saves updates

Client Browser
  └── OfferEdge ProposalPage (/q/:id)
        └── GET /api/proposals/:id   → loads proposal for viewing
```

#### Claude prompt to wire the API:

```
Update AdminPage.jsx and useProposalStore.js to use a REST API instead of localStorage.

API base URL: https://api.yourapp.com
Endpoints:
  GET    /proposals/:id    → returns proposal JSON
  POST   /proposals        → creates proposal, returns { id }
  PUT    /proposals/:id    → updates proposal, returns updated object

Changes needed:
1. On AdminPage mount, if props.proposalId exists, fetch GET /proposals/:proposalId
2. Replace the Save button handler: call PUT /proposals/:id (or POST for new)
3. Show loading spinner while fetching
4. Show error toast if fetch fails
5. After successful save, show success toast with the shareable link: /q/{id}
6. Add an auth header: Authorization: Bearer {token from localStorage or context}
```

---

## Tailwind Tokens (copy-paste into your `@theme {}`)

```css
@theme {
  --color-dark-900: #0f1318;
  --color-dark-800: #141a22;
  --color-dark-700: #1a2230;
  --color-dark-600: #202b3a;
  --color-text-primary: #eef2f7;
  --color-text-secondary: #7a93ad;
  --color-text-muted: #3d5570;
  --color-brand-green: #679a41;
  --color-brand-green-light: #7db84d;
  --color-brand-blue: #38bdf8;
  --color-whatsapp: #25d366;
}
```

Light theme overrides (also needed if you use `data-theme="light"`):
```css
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
```

Also add these utility classes:
```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Aurora animation (used in HeroSection) */
@keyframes aurora {
  from { background-position: 50% 50%, 50% 50%; }
  to   { background-position: 350% 50%, 350% 50%; }
}
@utility animate-aurora {
  animation: aurora 60s linear infinite;
}
```

---

## Conflicts to Watch For

| Risk | What to check |
|---|---|
| **Tailwind version** | OfferEdge uses Tailwind v4 (`@tailwindcss/vite`). If your app uses v3, the `@theme {}` syntax won't work — use `theme.extend.colors` in `tailwind.config.js` instead |
| **`company.logo` schema** | ⚠️ Now an object `{ light, dark }` — old proposals with a plain string URL will break `resolveCompanyLogoUrl()`. Run migration or update `normalizeCompanyLogoObject()` |
| **framer-motion version** | ProposalPage requires framer-motion v12 (`motion` export, `useScroll`, `useTransform`). v10/v11 API is different |
| **Zustand version** | OfferEdge uses Zustand v5. API is mostly the same as v4 but check for breaking changes |
| **React version** | OfferEdge uses React 19 — should be backwards compatible with React 18 but test |
| **Lucide version** | OfferEdge uses lucide-react v1.x — earlier versions have different icon names |
| **Route conflicts** | AdminPage uses `react-router-dom` Link. Make sure `/admin` and `/q/:id` routes don't clash |
| **localStorage keys** | Zustand persists to `offerEdge-proposal`. Theme preference saves to `offerEdge-theme`. Change both if conflicts exist |
| **toast position** | OfferEdge mounts `<Toaster position="bottom-right" />` in `main.jsx` — don't double-mount |
| **`@` alias** | HeroSection imports `@/components/ui/aurora-background`. Requires Vite alias `'@' → 'src/'` in `vite.config.js` |

---

## Admin Panel Sections Reference

The AdminPage has these editor sections (sidebar nav):

| Section | Key | What it controls |
|---|---|---|
| Offer Info | `offer` | Client name, proposal number, dates, currency, tax note, recipient |
| Products | `products` | Product name/icon/description + up to 5 content blocks per product |
| Company | `company` | Profile, stats, certifications, trusted logos, per-theme logo upload |
| Sales Contact | `contact` | Account manager name, title, email, phone, WhatsApp |
| Pricing | `pricing` | Line items (name, qty, unit price, billing cycle) + add-ons |
| Commitments | `commitments` | SLA guarantee title + description cards |
| Visibility | `sections` | Toggle which page sections appear + **default theme (dark/light/auto)** |

### Available product content block types (admin can add/reorder):

| Type | Label | Description |
|---|---|---|
| `features` | Feature Cards | Icon + title + description grid (3 layout variants) |
| `why_choose` | Why Choose List | Differentiator bullets/cards/pills |
| `highlights` | Key Metrics | Metric strip with value + label |
| `comparison` | Comparison Table | Feature comparison with check/X (boolean values) |
| `pricing_comparison` | **Pricing Comparison** | **NEW** — Side-by-side pricing with text cell values |
| `use_cases` | Use Cases | Persona/scenario cards |

---

## Scroll Experience Features (ProposalPage)

The offer page now has a full cinematic scroll experience. These components are required for the proposal viewer:

| Component | Effect |
|---|---|
| `ScrollProgress` | 2px brand-green reading progress bar fixed below navbar |
| `RevealSection` | Wraps each section — opacity+translateY entrance on scroll |
| `StickySignCTA` | "Accept & Get Started" pill appears after 25% scroll depth, hides near #sign |
| `StaggerReveal` + `StaggerItem` | Stagger-reveals children with 70ms intervals |
| `HeroSection` scroll-out | Content fades to 0 + drifts up 50px as you scroll past the hero |
| About stats stagger | 4 stat cells reveal left-to-right |
| Commitment cards stagger | Guarantee cards stagger in |
| Pricing table rows | Each `<tr>` slides in from left with 90ms cascade |
| Add-ons grid stagger | Cards reveal sequentially |

All effects respect `prefers-reduced-motion` — fully accessible.

---

## Asking Claude to Do the Integration

### Most effective prompt:

```
I have an existing [React/Vue/Angular/Next.js] app running at [describe your app briefly].
I want to integrate the OfferEdge admin proposal editor into it.

Here are the relevant files from OfferEdge:
[paste AdminPage.jsx]
[paste useProposalStore.js]
[paste companyLogo.js]
[paste the Tailwind theme tokens from index.css]

My existing app:
- Framework: [React 18 / Next.js 14 / etc.]
- Tailwind version: [3 / 4]
- Router: [react-router / Next.js App Router / etc.]
- State management: [Redux / Zustand / Context / none]
- framer-motion installed: [yes/no]

Please:
1. Adapt AdminPage.jsx to work in my app (fix any import paths, router conflicts, etc.)
2. Add the required Tailwind tokens without breaking my existing design system
3. Register the /admin route in my router
4. Keep my existing app's auth flow — protect /admin with my existing auth guard
5. Wire the "Save" button to call [my API endpoint] instead of localStorage
6. Note: company.logo is now an object { light, dark } — handle accordingly
```

---

## Recommended Integration Path

For WorldPosta's use case (existing WP portal + this standalone offer tool):

1. **Short term:** Use **Option B (iframe)** to ship quickly — zero risk to the host app
2. **Medium term:** Use **Option D (backend API)** to store proposals in WP's database and share auth sessions
3. **Long term:** Extract to **Option C (npm package)** if multiple WP products need proposal generation

---

## Security Considerations

- The `/admin` route is currently **unprotected** — wrap it in an auth guard before exposing in production
- The Zustand store persists to `localStorage` — don't store sensitive client data there long-term
- Theme preference also persists to `localStorage` (`offerEdge-theme`) — no security risk, just good to know
- When wiring the API, use HTTPS and pass auth tokens via headers (not URL params)
- The "Sign" form on the proposal page (`SignSection.jsx`) needs a real backend endpoint to record acceptances — currently just a 800ms mock delay
- The `company.logo` object now accepts URLs for both light and dark logos — validate URLs server-side before storing

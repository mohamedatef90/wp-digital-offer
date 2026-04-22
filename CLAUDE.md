# WP Digital Offer (OfferEdge)

Digital proposal/quote page generator for WorldPosta. Clients receive a shareable link to view, negotiate, and accept proposals online.

## Tech Stack

| Layer          | Library                                   |
| -------------- | ----------------------------------------- |
| Build tool     | Vite 8                                    |
| Framework      | React 19                                  |
| Routing        | react-router-dom 7                        |
| State          | zustand (global store), React hooks (local) |
| Styling        | Tailwind CSS 4 (via @tailwindcss/vite)    |
| Icons          | lucide-react                              |
| Dates          | date-fns                                  |
| Charts         | recharts (for future Analytics page)      |
| Notifications  | react-hot-toast                           |
| HTTP           | axios                                     |
| Language       | JavaScript + JSX — NO TypeScript          |

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Project Structure

```
src/
├── App.jsx                     # Root with react-router Routes
├── main.jsx                    # Entry point (BrowserRouter, Toaster)
├── index.css                   # Tailwind imports + custom theme + animations
├── components/
│   └── proposal/               # All proposal page sections
│       ├── Navbar.jsx
│       ├── HeroSection.jsx
│       ├── TrustedBy.jsx       # Logo carousel with infinite scroll
│       ├── DatesBar.jsx        # Quote created/valid until dates
│       ├── AboutSection.jsx    # Company stats + certifications
│       ├── ProductDetails.jsx  # Product features grid + why-choose
│       ├── CommitmentSection.jsx
│       ├── SalesContact.jsx    # Email/phone/WhatsApp contact card
│       ├── QuoteDetails.jsx    # Pricing table with totals
│       ├── AddOns.jsx          # Recommended add-on cards
│       ├── NegotiateButton.jsx # Counter-offer CTA
│       ├── SignSection.jsx     # Digital signature + accept form
│       ├── Footer.jsx
│       └── ChatButton.jsx      # Floating chat FAB
├── pages/
│   └── ProposalPage.jsx        # Assembles all proposal components
├── store/
│   └── useProposalStore.js     # Zustand store for proposal data
└── data/
    └── sampleProposal.js       # Sample data (replace with API later)
```

## Design System (Tailwind Theme)

Custom colors defined in `src/index.css` via `@theme`:

| Token              | Value     | Usage                        |
| ------------------ | --------- | ---------------------------- |
| `dark-900`         | `#0f1318` | Page background              |
| `dark-800`         | `#141a22` | Section/card backgrounds     |
| `dark-700`         | `#1a2230` | Card/input backgrounds       |
| `dark-600`         | `#202b3a` | Elevated surfaces            |
| `text-primary`     | `#eef2f7` | Main text                    |
| `text-secondary`   | `#7a93ad` | Secondary text               |
| `text-muted`       | `#3d5570` | Muted/label text             |
| `brand-green`      | `#679a41` | Primary brand accent         |
| `brand-green-light`| `#7db84d` | Highlight green              |
| `brand-blue`       | `#38bdf8` | Secondary accent             |
| `whatsapp`         | `#25d366` | WhatsApp CTA                 |

Utility class `.gradient-text` applies the blue-to-green gradient on text.

## Routing

| Path     | Component      | Description              |
| -------- | -------------- | ------------------------ |
| `/`      | ProposalPage   | Default (sample data)    |
| `/q/:id` | ProposalPage   | Proposal by UUID         |

## Architecture Notes

- **No TypeScript** — the entire project is plain JavaScript + JSX.
- All proposal data flows from `useProposalStore` (zustand) → `ProposalPage` → individual section components via props.
- Currently uses `sampleProposal.js` for data. Will connect to backend API via axios in `ProposalPage.jsx` `useEffect`.
- Admin panel portal will create/manage proposals (future work).
- Components in `src/components/proposal/` are purely presentational — they receive data via props and render it.
- The sign/accept form in `SignSection.jsx` has client-side validation (name + checkbox required).

## Conventions

- Component files: PascalCase (e.g., `HeroSection.jsx`)
- Store files: camelCase with `use` prefix (e.g., `useProposalStore.js`)
- No CSS modules — all styling via Tailwind utility classes
- Tailwind custom colors referenced as `text-brand-green`, `bg-dark-800`, etc.
- Keep components focused: one section of the proposal per component

## Memory Bank

All reports, audits, critiques, and analysis outputs **must be saved** to:

```
/Users/roaya/Roaya-files/Development/wp-digital-offer/memory-bank/
```

This applies to every agent, skill, and tool — including `/critique`, `/audit`, `/shape`, and any custom analysis. When generating a report:
1. Save a `.md` file in the `memory-bank/` directory with a descriptive name (e.g., `critique-2026-04-21.md`, `audit-accessibility-2026-05-01.md`)
2. Include the date in the filename so reports can be compared over time
3. Do **not** save reports only in chat output — always persist to disk

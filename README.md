# WP Digital Offer (OfferEdge)

A front-end tool for building and presenting digital proposal pages: a client-facing proposal page that can be shared by link, and an admin editor for its content. It is a React single-page app with no backend; proposal data lives in the browser.

## Routes

| Route | Page |
| --- | --- |
| `/` | Proposal page, showing the saved proposal or the bundled sample (`src/data/sampleProposal.js`) |
| `/q/:id` | Same proposal page (the `id` parameter is not used yet; the code has a commented-out API call) |
| `/admin` | Admin editor |

## Features

**Proposal page** (`src/components/proposal/`): navigation bar, hero, trusted-by logo carousel, dates bar with expiry countdown, about section, product details built from content blocks, commitments, quote details, add-ons, sales contact, a negotiate button, a signing section (typed signature and agreement checkbox), footer, scroll progress, and a chat button. Light and dark themes are supported (`src/hooks/useTheme.js`).

**Admin editor** (`src/pages/AdminPage.jsx`): sections for offer info, products, company, commitments, and section visibility (toggle which sections appear on the client page). Product content blocks include a comparison table and a pricing comparison.

**Persistence:** the proposal is stored in `localStorage` through a persisted Zustand store (`src/store/useProposalStore.js`, key `offerEdge-proposal`). If nothing has been saved, the sample proposal is loaded.

## Tech stack

- React 19, React Router 7, Vite 8
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Zustand, Framer Motion, Lucide icons, react-hot-toast, date-fns
- JavaScript with JSX (no TypeScript)

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev       # dev server on http://localhost:3000
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # ESLint
```

No environment variables are used.

## Project structure

```
src/
  App.jsx, main.jsx       Routes and entry point
  pages/                  ProposalPage, AdminPage
  components/proposal/    Proposal page sections
  components/ui/          Shared UI (aurora background)
  store/                  Persisted proposal store
  data/sampleProposal.js  Sample proposal content
  hooks/, lib/            Theme hook, utilities
assets/DESIGN_SYSTEM.md   Design system notes
memory-bank/              Project status, audits, and integration notes
CLAUDE.md                 Guidance for AI coding assistants
```

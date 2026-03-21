# NavSumaro — Frontend

**One Platform. Your Entire Campus.**

Built with React + TypeScript + Vite + Tailwind CSS v3.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── App.tsx                        # Root component, page routing
├── main.tsx                       # Entry point
├── types/index.ts                 # All TypeScript interfaces
├── data/mockData.ts               # Mock data (replace with API calls)
├── styles/globals.css             # Tailwind directives + custom components
├── components/
│   ├── ui/index.tsx               # Avatar, Button, Tag, Badge, etc.
│   ├── layout/Topbar.tsx          # Navigation bar
│   ├── sidebar/
│   │   ├── LeftSidebar.tsx        # Tags, filters
│   │   └── RightSidebar.tsx       # Events, trending, premium
│   ├── feed/
│   │   ├── Feed.tsx               # Post list container
│   │   ├── PostCard.tsx           # Individual post card
│   │   └── CreatePostBar.tsx      # Post creation trigger
│   ├── marketplace/
│   │   └── ListingCard.tsx        # Marketplace item card
│   └── modals/
│       ├── CreatePostModal.tsx    # New post form
│       └── PostDetailModal.tsx    # Post + comments view
└── pages/
    ├── HomePage.tsx               # Main feed page
    ├── MarketplacePage.tsx        # Marketplace grid
    └── PlaceholderPages.tsx       # Calendar, Groups, Profile
```

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 4 | Build tool |
| Tailwind CSS | 3 | Styling |
| PostCSS | 8 | CSS processing |

## Next Steps (Backend Integration)

1. Replace `mockData.ts` with API service calls
2. Add Supabase for auth + database
3. Implement `.edu` email verification
4. Add React Router for proper URL routing
5. Connect real-time messaging (Supabase Realtime)

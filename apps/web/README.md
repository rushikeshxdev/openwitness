# OpenWitness Landing Page

Premium, cinematic landing page for OpenWitness - an open-source platform for preserving, organizing, and verifying evidence from public events.

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with custom design tokens
- **Framer Motion** for cinematic animations
- **Lucide Icons** for iconography

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Project Structure

```
apps/web/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── data/            # Static data files
├── public/          # Static assets (images, fonts)
└── package.json
```

## Design System

### Color Palette

- **Background**: `#09090B` (primary), `#18181B` (elevated)
- **Glassmorphism**: `rgba(255, 255, 255, 0.06/0.10/0.15)`
- **Brand Blue**: `#2563EB` (primary)
- **Accent Cyan**: `#38BDF8`
- **Text**: `#FAFAFA` (primary), `#A1A1AA` (secondary)

### Typography

- **Hero**: 72-80px (responsive with clamp)
- **Section Title**: 48px
- **Body**: 18px
- **Font Family**: Inter

## Requirements

This landing page implements 16 requirements covering:

- Hero section with cinematic animations
- Glass navigation system
- Active events display
- Interactive world map
- Activity timeline
- Organizations showcase
- Responsive design
- Accessibility compliance (WCAG AA)
- Performance optimization (Lighthouse 90+)

## License

MIT

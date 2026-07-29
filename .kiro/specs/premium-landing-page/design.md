# Design Document: Premium Landing Page

## Overview

The Premium Landing Page is a cinematic, single-page application that serves as the entry point to the OpenWitness platform. This design translates 16 requirements into a cohesive technical architecture featuring glassmorphism aesthetics, sophisticated animations, and premium interactions that rival industry-leading products.

### Core Design Principles

1. **Cinematic Quality**: Every interaction and transition should feel intentional, smooth, and premium
2. **Visual Hierarchy**: Clear distinction between primary, secondary, and tertiary content through size, weight, and motion
3. **Performance-First**: Animations and effects must never compromise 60fps scrolling or sub-2s initial render
4. **Accessibility by Default**: Premium aesthetics must coexist with WCAG AA compliance and keyboard navigation
5. **Component Reusability**: Every UI element should be a composable, typed, reusable component

### Technology Foundation

- **Framework**: Next.js 15 with App Router for SSR, optimized routing, and automatic code splitting
- **Language**: TypeScript 5.x for compile-time safety and enhanced developer experience
- **Styling**: Tailwind CSS v4 with custom design tokens and utility extensions
- **Animation**: Framer Motion for declarative, performant animations with gesture support
- **Component Library**: shadcn/ui for accessible, customizable base components
- **Icons**: Lucide Icons for consistent, scalable iconography
- **Image Optimization**: next/image for automatic WebP/AVIF conversion and responsive sizing

## Architecture

### Page Structure Hierarchy

```
app/
└── page.tsx (Server Component)
    ├── Navbar (Client Component - fixed positioning)
    ├── Hero (Client Component - viewport animations)
    │   ├── HeroBackground (optimized image with overlay)
    │   ├── HeroContent (animated mission statement)
    │   └── Stats (animated counter cards)
    ├── ActiveEvents (Client Component - horizontal scroll)
    │   └── EventCard[] (glassmorphism cards)
    ├── MapSection (Client Component - interactive visualization)
    │   └── WorldMap (third-party integration or custom SVG)
    ├── Timeline (Client Component - scroll animations)
    │   └── TimelineEntry[] (chronological activity)
    ├── Organizations (Client Component - grid layout)
    │   └── OrganizationCard[] (partner logos)
    └── Footer (Server Component - static content)
```

### Component Architecture

#### 1. Navbar Component
**Purpose**: Fixed navigation with glassmorphism that transitions on scroll

**Props Interface**:
```typescript
interface NavbarProps {
  links: Array<{ label: string; href: string; }>;
  logoSrc: string;
  ctaButton?: { label: string; onClick: () => void; };
}
```

**Key Features**:
- Scroll-triggered glass effect using `useScroll` from Framer Motion
- `backdrop-blur-md` with `bg-white/6` that intensifies on scroll
- Fixed positioning with `z-50` to stay above all content
- Hover animations on nav links with `scale-105` and color transitions
- Mobile responsive with hamburger menu below `md` breakpoint

**State Management**:
- `isScrolled` boolean tracking scroll position > 50px
- `isMobileMenuOpen` boolean for mobile navigation state

#### 2. Hero Component
**Purpose**: Full-viewport section with cinematic background, mission statement, and animated stats

**Props Interface**:
```typescript
interface HeroProps {
  backgroundImage: string;
  missionStatement: string;
  stats: Array<{ label: string; value: number; suffix?: string; }>;
  primaryCTA: { label: string; onClick: () => void; };
  secondaryCTA: { label: string; onClick: () => void; };
}
```

**Key Features**:
- `h-screen` viewport height with flexbox centering
- Background image with `brightness-40` overlay for text contrast
- Mission statement at 72-80px (clamp responsive) with fade-up on mount
- Stats cards positioned absolutely or in flex layout
- Parallax effect on background using `useTransform` and scroll position

**Animation Sequence**:
1. Background fades in (0.6s)
2. Mission statement slides up with opacity (0.8s, delay 0.2s)
3. CTAs fade in (0.5s, delay 0.6s)
4. Stats cards stagger in (0.4s each, delay 0.8s, stagger 0.1s)

#### 3. GlassCard Component
**Purpose**: Reusable glassmorphism card for events, organizations, timeline entries

**Props Interface**:
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hover-lift' | 'hover-tilt';
  className?: string;
  onClick?: () => void;
}
```

**Key Features**:
- Base styling: `bg-white/6 backdrop-blur-md border border-white/10 rounded-xl`
- Hover effects based on variant:
  - `hover-lift`: `translateY(-8px)` with increased shadow
  - `hover-tilt`: 3D tilt using `rotateX` and `rotateY` based on mouse position
- Transition duration: 300ms with `ease-out` timing
- Support for custom className overrides via cn() utility

#### 4. Stats Component
**Purpose**: Animated numeric statistics with labels

**Props Interface**:
```typescript
interface StatsProps {
  stats: Array<{
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
  }>;
  animationDuration?: number;
}
```

**Key Features**:
- Uses `useInView` to trigger animation when entering viewport
- Animates from 0 to target value using `useSpring` or custom counter hook
- Grid layout with responsive columns (3 on desktop, 1-2 on mobile)
- GlassCard wrapper for each stat
- Number typography: 48px bold, label: 18px regular

#### 5. EventCard Component
**Purpose**: Display active events with thumbnail, metadata, and hover effects

**Props Interface**:
```typescript
interface EventCardProps {
  event: {
    id: string;
    title: string;
    location: string;
    thumbnailUrl: string;
    evidenceCount: number;
    verificationStatus: 'verified' | 'pending' | 'unverified';
    timestamp: Date;
  };
  onClick?: (id: string) => void;
}
```

**Key Features**:
- Fixed width card (320px) for horizontal scroll container
- Thumbnail image with overlay gradient
- Verification badge with color coding (green/yellow/gray)
- Evidence count with icon
- Hover: lift + glow effect (`shadow-2xl shadow-blue-500/20`)
- Optional subtle tilt on hover using mouse position

**Layout**:
- Image: aspect-ratio 16/9
- Content padding: 16px
- Metadata row: flex with space-between
- Typography: title 18px bold, metadata 14px regular

#### 6. Timeline Component
**Purpose**: Vertical chronological display of platform activity

**Props Interface**:
```typescript
interface TimelineProps {
  entries: Array<{
    id: string;
    timestamp: Date;
    eventName: string;
    activityType: 'evidence_added' | 'event_created' | 'verification_updated';
    metadata: Record<string, any>;
  }>;
}
```

**Key Features**:
- Vertical line connecting entries (absolute positioned, left side)
- Each entry has dot indicator on the timeline
- Staggered fade-up animations using `staggerChildren` in parent variant
- Newest entries at top (reverse chronological)
- Relative timestamps ("2 hours ago") with full date on hover

**Animation**:
- Container: `staggerChildren: 0.1`
- Each entry: `initial: { opacity: 0, y: 20 }`, `animate: { opacity: 1, y: 0 }`
- Trigger: `useInView` with `once: true`

#### 7. MapSection Component
**Purpose**: Interactive world map with event markers

**Props Interface**:
```typescript
interface MapSectionProps {
  events: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    evidenceCount: number;
  }>;
  onMarkerClick?: (id: string) => void;
}
```

**Key Features**:
- Dark-themed map (background: #09090B)
- Markers: glowing dots with pulse animation
- Marker colors: primary blue (#2563EB) or accent cyan (#38BDF8)
- Tooltip on hover showing event details
- Pan and zoom capabilities (optional, for enhanced version)
- Fade-in animation when entering viewport

**Implementation Options**:
1. **Simple**: Custom SVG map with positioned markers
2. **Advanced**: React Simple Maps or Mapbox GL JS with dark theme

#### 8. Organizations Component
**Purpose**: Grid display of partner organization logos

**Props Interface**:
```typescript
interface OrganizationsProps {
  organizations: Array<{
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
  }>;
}
```

**Key Features**:
- Responsive grid: 4 columns desktop, 3 tablet, 2 mobile
- Each logo in GlassCard with padding
- Hover: subtle scale (1.05) and glow
- Grayscale logos with color on hover for premium effect
- Staggered fade-in using grid animation variant

#### 9. Footer Component
**Purpose**: Large, minimal footer with categorized links

**Props Interface**:
```typescript
interface FooterProps {
  linkColumns: Array<{
    title: string;
    links: Array<{ label: string; href: string; }>;
  }>;
  socialLinks: Array<{ platform: string; url: string; icon: LucideIcon; }>;
  copyright: string;
}
```

**Key Features**:
- Generous whitespace (py-24 or larger)
- Multi-column grid layout for link categories
- Muted text colors for hierarchy
- Subtle dividers between sections
- Social icons with hover effects
- Server component (static content, no client state needed)

#### 10. Button Component
**Purpose**: Reusable button with variants and animations

**Props Interface**:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}
```

**Variants**:
- **Primary**: `bg-blue-600 hover:bg-blue-700` with glow effect
- **Secondary**: `bg-white/10 hover:bg-white/20` glassmorphism
- **Ghost**: Transparent with border, hover fill

**Animations**:
- Hover: `scale: 1.05`, glow shadow
- Active/Click: `scale: 0.95`, ripple effect
- Disabled: reduced opacity, no interactions

#### 11. Container Component
**Purpose**: Consistent content width and padding across sections

**Props Interface**:
```typescript
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

**Sizes**:
- `sm`: max-w-4xl
- `md`: max-w-6xl (default)
- `lg`: max-w-7xl
- `xl`: max-w-screen-2xl

**Features**:
- Centered with `mx-auto`
- Responsive padding: `px-6 md:px-8 lg:px-12`

#### 12. SectionTitle Component
**Purpose**: Consistent section heading styling

**Props Interface**:
```typescript
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
}
```

**Features**:
- Title typography: 48px font-bold
- Subtitle: 18px text-gray-400
- Optional gradient text effect on title
- Fade-in animation when entering viewport

## Components and Interfaces

### TypeScript Interfaces

#### Core Data Models

```typescript
// Event-related interfaces
interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  thumbnailUrl: string;
  evidenceCount: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  timestamp: Date;
  isActive: boolean;
}

interface EvidenceItem {
  id: string;
  eventId: string;
  type: 'photo' | 'video' | 'text';
  url?: string;
  content?: string;
  uploadedBy: string;
  timestamp: Date;
  verified: boolean;
}

// Timeline-related interfaces
interface TimelineEntry {
  id: string;
  timestamp: Date;
  eventName: string;
  activityType: 'evidence_added' | 'event_created' | 'verification_updated' | 'event_trending';
  metadata: {
    evidenceCount?: number;
    verificationStatus?: string;
    userName?: string;
    [key: string]: any;
  };
}

// Organization-related interfaces
interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  description?: string;
}

// Navigation-related interfaces
interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
}

interface CTAButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}
```

#### Component Prop Interfaces

All component prop interfaces are defined in the Component Architecture section above. Key patterns:

- **Composition**: Components accept `children` for flexible composition
- **Variants**: Enum-like strings for styling variants (`'primary' | 'secondary'`)
- **Optional Props**: Extensive use of optional props for flexibility
- **Type Safety**: All data models fully typed with no `any` types except in metadata objects
- **Callbacks**: Consistent `onClick`, `onHover` callback patterns

### Design System Tokens

#### Color Palette

```typescript
// Tailwind config extension
const colors = {
  background: {
    primary: '#09090B',      // Main background
    elevated: '#18181B',     // Raised surfaces
  },
  glass: {
    light: 'rgba(255, 255, 255, 0.06)',
    medium: 'rgba(255, 255, 255, 0.10)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },
  brand: {
    blue: {
      primary: '#2563EB',    // Primary brand blue
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    cyan: {
      accent: '#38BDF8',     // Accent cyan
      light: '#7DD3FC',
    },
  },
  text: {
    primary: '#FAFAFA',      // High contrast text
    secondary: '#A1A1AA',    // Muted text
    tertiary: '#71717A',     // Subtle text
  },
  status: {
    verified: '#10B981',     // Green for verified
    pending: '#F59E0B',      // Amber for pending
    unverified: '#6B7280',   // Gray for unverified
  },
}
```

#### Typography Scale

```typescript
const typography = {
  hero: {
    size: 'clamp(48px, 8vw, 80px)',
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
  h1: {
    size: '48px',
    lineHeight: '1.2',
    fontWeight: '700',
  },
  h2: {
    size: '36px',
    lineHeight: '1.3',
    fontWeight: '600',
  },
  h3: {
    size: '24px',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  body: {
    size: '18px',
    lineHeight: '1.6',
    fontWeight: '400',
  },
  small: {
    size: '14px',
    lineHeight: '1.5',
    fontWeight: '400',
  },
}
```

#### Spacing System

```typescript
const spacing = {
  section: {
    vertical: '160px',       // Between major sections (desktop)
    verticalMobile: '80px',  // Between major sections (mobile)
  },
  container: {
    padding: '48px',         // Container horizontal padding (desktop)
    paddingMobile: '24px',   // Container horizontal padding (mobile)
  },
  component: {
    gap: '24px',            // Standard gap between components
    gapTight: '12px',       // Tight gap for related elements
    gapLoose: '48px',       // Loose gap for separated elements
  },
}
```

#### Animation Presets

```typescript
const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    smooth: [0.4, 0, 0.2, 1],           // ease-out
    spring: { type: "spring", stiffness: 300, damping: 30 },
    bounce: { type: "spring", stiffness: 400, damping: 10 },
  },
  variants: {
    fadeUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.4 },
    },
  },
}
```

#### Glassmorphism Utilities

```typescript
// Tailwind plugin for glassmorphism
const glassStyles = {
  '.glass-light': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  '.glass-medium': {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },
  '.glass-strong': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}
```

## Data Models

### Static Data Structure

Since this is a landing page, most data will be static or fetched at build time. The data structure supports the following:

#### Landing Page Data Model

```typescript
interface LandingPageData {
  hero: {
    backgroundImage: string;
    missionStatement: string;
    stats: Array<{
      label: string;
      value: number;
      suffix?: string;
    }>;
    ctaButtons: {
      primary: CTAButton;
      secondary: CTAButton;
    };
  };
  activeEvents: Event[];
  timeline: TimelineEntry[];
  mapMarkers: Array<{
    eventId: string;
    latitude: number;
    longitude: number;
    title: string;
    evidenceCount: number;
  }>;
  organizations: Organization[];
  navigation: {
    logo: string;
    links: NavigationLink[];
    ctaButton: CTAButton;
  };
  footer: {
    linkColumns: Array<{
      title: string;
      links: NavigationLink[];
    }>;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    copyright: string;
  };
}
```

### Data Fetching Strategy

For Next.js 15 App Router:

```typescript
// app/page.tsx (Server Component)
async function getLandingPageData(): Promise<LandingPageData> {
  // Option 1: Static data from JSON file
  const data = await import('./data/landing-page.json');
  
  // Option 2: API fetch with caching
  // const res = await fetch('https://api.openwitness.org/landing', {
  //   next: { revalidate: 3600 } // Revalidate every hour
  // });
  // const data = await res.json();
  
  return data;
}

export default async function Page() {
  const data = await getLandingPageData();
  
  return (
    <main>
      <Navbar {...data.navigation} />
      <Hero {...data.hero} />
      {/* ... other sections */}
    </main>
  );
}
```

### State Management

#### Client-Side State

Most components are controlled by internal state:

- **Navbar**: Scroll position, mobile menu state
- **Hero**: Animation completion state
- **EventCards**: Hover state, tilt calculations
- **Timeline**: Intersection observer state for animations

No global state management (Redux, Zustand) needed for this landing page. State is colocated with components.

#### Animation State

Framer Motion handles animation state internally. Components use:
- `useInView` for scroll-triggered animations
- `useScroll` for scroll-dependent effects (parallax, navbar transition)
- `useTransform` for value interpolation
- `useSpring` for smooth numeric transitions (stats counter)


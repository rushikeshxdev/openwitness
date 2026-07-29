# Navbar Component

A premium fixed navigation bar with glassmorphism effects and responsive mobile menu.

## Features

- **Fixed Positioning**: Stays at the top of the viewport with z-50
- **Scroll-Based Glassmorphism**: Transitions to frosted glass effect when scrolled past 50px
- **Responsive Mobile Menu**: Hamburger menu with slide-in animation below md breakpoint
- **Hover Animations**: Links feature scale-105 and color transitions
- **Accessibility**: Proper ARIA labels, keyboard navigation, and 44x44px touch targets
- **Body Scroll Lock**: Prevents scrolling when mobile menu is open

## Props

### NavbarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoSrc` | `string` | `undefined` | Logo image source (optional) |
| `logoText` | `string` | `"OpenWitness"` | Logo text (used if logoSrc not provided) |
| `links` | `NavbarLink[]` | required | Array of navigation links |
| `ctaButton` | `NavbarCTA` | `undefined` | Optional CTA button configuration |
| `className` | `string` | `undefined` | Additional CSS classes |

### NavbarLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Link display text |
| `href` | `string` | required | Link href or anchor |
| `external` | `boolean` | `false` | Whether link opens in new tab |

### NavbarCTA

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | CTA button label |
| `onClick` | `() => void` | required | CTA click handler |

## Usage

### Basic Usage

```tsx
import { Navbar } from "@/components/navbar";

export default function Page() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const ctaButton = {
    label: "Get Started",
    onClick: () => console.log("CTA clicked"),
  };

  return (
    <>
      <Navbar links={links} ctaButton={ctaButton} />
      {/* Page content */}
    </>
  );
}
```

### With Logo Image

```tsx
<Navbar
  logoSrc="/logo.svg"
  logoText="My App"
  links={links}
/>
```

### With External Links

```tsx
const links = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "https://docs.example.com", external: true },
  { label: "GitHub", href: "https://github.com/example", external: true },
];

<Navbar links={links} />
```

### Without CTA Button

```tsx
<Navbar
  logoText="My App"
  links={links}
/>
```

## Behavior

### Glassmorphism Effect

The navbar starts transparent and transitions to a glassmorphism effect when scrolled past 50px:

- Background: `rgba(255, 255, 255, 0.06)`
- Backdrop blur: `12px`
- Border: `1px solid rgba(255, 255, 255, 0.1)`

### Mobile Menu

Below the `md` breakpoint (768px):
- Navigation links are hidden
- Hamburger menu button appears
- Clicking the button opens a slide-in panel from the right
- Panel width: 280px
- Backdrop overlay dims the background
- Body scroll is locked when menu is open
- Clicking a link or the backdrop closes the menu

### Hover Effects

Desktop navigation links:
- Scale: `1.05` on hover
- Color: transitions from `text-gray-300` to `text-white`
- Duration: `300ms`

Logo:
- Scale: `1.05` on hover (group)
- Color: transitions to `text-blue-400` when text-based

## Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus rings on all focusable elements
- **ARIA Labels**: Proper labels on hamburger button and home link
- **ARIA Expanded**: Hamburger button indicates menu state
- **Touch Targets**: Minimum 44x44px on mobile for buttons and links
- **Screen Reader Support**: Meaningful labels for all interactive elements

## Technical Details

### Dependencies

- `framer-motion`: For scroll tracking and animations
- `lucide-react`: For Menu and X icons
- `@/components/button`: For CTA button
- `@/lib/utils`: For cn() utility
- `@/lib/animations`: For animation constants

### Client Component

This is a client component (`"use client"`) because it uses:
- React hooks (`useState`, `useEffect`)
- Framer Motion hooks (`useScroll`, `useTransform`)
- Event handlers

### Performance

- Scroll tracking is optimized using Framer Motion's `useScroll` hook
- Background opacity transitions use GPU-accelerated transforms
- Mobile menu uses spring animations for smooth, natural motion
- Body scroll lock is automatically cleaned up on unmount

## Requirements Validated

- **Requirement 2.3**: Navigation bar remains fixed at the top of the viewport during scrolling
- **Requirement 2.5**: Navigation bar displays the OpenWitness logo or wordmark on the left side
- **Requirement 2.6**: Navigation bar displays primary action buttons on the right side
- **Requirement 12.1**: Landing page implements a Navbar component with glassmorphism styling

## Related Components

- [Button](./button.md) - Used for CTA button
- [Container](./container.md) - Used in demo page for consistent layout

## Demo

Visit `/demo/navbar` to see the component in action with various scroll positions and backgrounds.

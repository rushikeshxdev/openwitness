# GlassCard Component

A reusable glassmorphism card component with multiple variants and hover effects. Built with Framer Motion for smooth animations and 3D effects.

**Validates: Requirements 12.3, 10.3**

## Features

- **Glassmorphism Styling**: Semi-transparent background with backdrop blur and subtle borders
- **Multiple Variants**: Choose from default, hover-lift, or hover-tilt behaviors
- **Hover Effects**: Animated lift and 3D tilt effects based on variant
- **Customizable**: Override styles with className prop
- **Interactive**: Optional onClick handler with cursor styling
- **Accessible**: Keyboard and screen reader friendly

## Usage

```tsx
import { GlassCard } from "@/components";

// Basic usage with default variant
<GlassCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</GlassCard>

// Hover lift variant (for stats, info cards)
<GlassCard variant="hover-lift">
  <div className="p-6">
    <div className="text-4xl font-bold">1,234</div>
    <div className="text-sm text-gray-400">Active Events</div>
  </div>
</GlassCard>

// Hover tilt variant (for event cards, media cards)
<GlassCard variant="hover-tilt" onClick={handleClick}>
  <div className="p-8">
    <img src="/event.jpg" alt="Event" />
    <h3>Event Title</h3>
    <p>Event details...</p>
  </div>
</GlassCard>

// Custom styling
<GlassCard 
  variant="hover-lift" 
  className="max-w-md p-6 bg-blue-500/10 border-blue-500/30"
>
  <CustomContent />
</GlassCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'hover-lift' \| 'hover-tilt'` | `'default'` | Visual variant controlling hover behavior |
| `children` | `React.ReactNode` | - | Card content (required) |
| `className` | `string` | - | Additional CSS classes to apply |
| `onClick` | `() => void` | - | Click handler (makes card interactive) |
| ...rest | `HTMLMotionProps<"div">` | - | All other Framer Motion div props |

## Variants

### Default
Base glassmorphism styling without special hover effects. Perfect for static information displays.

**Styling:**
- Semi-transparent white background (`bg-white/6`)
- Backdrop blur effect (`backdrop-blur-md`)
- Subtle border (`border-white/10`)
- Rounded corners (`rounded-xl`)

**Use Cases:**
- Information displays
- Static content cards
- Background containers

### Hover Lift
Cards lift up with enhanced shadow on hover. Smooth translateY animation.

**Animation:**
- Moves up 8px on hover (`y: -8`)
- Increases shadow depth
- 300ms smooth transition

**Use Cases:**
- Statistics cards
- Feature cards
- Organization logos
- Team member cards

### Hover Tilt
3D tilt effect based on mouse position. Creates an interactive, premium feel.

**Animation:**
- Calculates mouse position relative to card center
- Applies 3D rotation on X and Y axes (-5° to +5°)
- Smooth spring animation (stiffness: 300, damping: 30)
- Slight scale increase (1.02) on hover
- Enhanced shadow

**Use Cases:**
- Event cards
- Image galleries
- Interactive features
- Premium content highlights

## Styling

### Base Styles
All variants include base glassmorphism styling:
- `bg-white/6` - Semi-transparent white background
- `backdrop-blur-md` - 12px backdrop blur
- `border border-white/10` - Subtle border
- `rounded-xl` - Large rounded corners
- `transition-shadow duration-300` - Smooth shadow transitions

### Custom Styling
Override or extend styles using the `className` prop:

```tsx
// Add padding and max width
<GlassCard className="p-8 max-w-2xl">
  <Content />
</GlassCard>

// Custom color theme
<GlassCard className="bg-blue-500/10 border-blue-500/30">
  <BlueThemedContent />
</GlassCard>

// Grid/Flex children
<GlassCard className="flex items-center gap-4 p-6">
  <Icon />
  <Text />
</GlassCard>
```

## Accessibility

- **Semantic HTML**: Renders as a `div` element (wrap in semantic elements as needed)
- **Keyboard**: Automatically focusable when `onClick` is provided
- **Cursor**: Shows pointer cursor when interactive
- **Motion**: Respects `prefers-reduced-motion` (via Framer Motion)

## Performance

- **Optimized Animations**: Uses GPU-accelerated transforms (translateY, rotateX, rotateY, scale)
- **Spring Physics**: Smooth, natural motion with Framer Motion springs
- **Efficient Re-renders**: Minimal re-renders with motion values
- **No Layout Shift**: Animations use transforms, not layout properties

## Examples

### Stats Grid
```tsx
<div className="grid grid-cols-4 gap-6">
  <GlassCard variant="hover-lift" className="p-6">
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-500">1,234</div>
      <div className="text-sm text-gray-400">Active Events</div>
    </div>
  </GlassCard>
  {/* More stats... */}
</div>
```

### Event Card with Tilt
```tsx
<GlassCard 
  variant="hover-tilt" 
  className="p-8"
  onClick={() => navigate(`/events/${event.id}`)}
>
  <img 
    src={event.thumbnail} 
    alt={event.title}
    className="w-full h-40 object-cover rounded-lg mb-4"
  />
  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
  <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
    <span>{event.location}</span>
    <span>{event.evidenceCount} evidence</span>
  </div>
  <div className="mt-3 inline-flex px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
    {event.status}
  </div>
</GlassCard>
```

### Organization Logo Grid
```tsx
<div className="grid grid-cols-4 gap-6">
  {organizations.map((org) => (
    <GlassCard 
      key={org.id} 
      variant="hover-lift"
      className="p-6 flex items-center justify-center"
    >
      <img 
        src={org.logoUrl} 
        alt={org.name}
        className="h-12 grayscale hover:grayscale-0 transition-all"
      />
    </GlassCard>
  ))}
</div>
```

## Technical Details

### Animation Implementation

**Hover Lift:**
```tsx
whileHover={{
  y: -8,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)...",
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
}}
```

**Hover Tilt:**
- Uses `useMotionValue` for mouse position tracking
- Transforms position to normalized coordinates (-0.5 to 0.5)
- Applies `useTransform` to map coordinates to rotation angles
- Wraps in `useSpring` for smooth, natural motion
- 3D perspective with `transformStyle: 'preserve-3d'`

### Browser Support
- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Backdrop Filter**: Requires browser support for `backdrop-filter` CSS property
- **3D Transforms**: Supported in all modern browsers
- **Fallback**: Without backdrop-filter, cards display with solid semi-transparent background

## Related Components

- **Button**: Interactive buttons with similar animation patterns
- **Container**: Consistent content width wrapper
- **Stats**: Animated statistics (often wrapped in GlassCard)
- **EventCard**: Event-specific card (built with GlassCard)

## Design Tokens

Uses design tokens from `globals.css`:
- Glass backgrounds: `bg-white/6`, `bg-white/10`, `bg-white/15`
- Glass borders: `border-white/10`, `border-white/15`, `border-white/20`
- Animation durations: From `lib/animations.ts`
- Easing curves: From `lib/animations.ts`

## Demo

View the interactive demo at `/demo/glass-card` to see all variants in action with real examples.

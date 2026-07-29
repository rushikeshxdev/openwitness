# Button Component

A premium, animated button component with multiple variants, sizes, and interactive effects.

## Features

✨ **Three Variants**
- `primary` - Bold blue background with glow effect
- `secondary` - Glassmorphism style with backdrop blur
- `ghost` - Transparent with border, fills on hover

🎨 **Three Sizes**
- `sm` - Small (px-4 py-2, text-sm)
- `md` - Medium (px-6 py-3, text-base) - default
- `lg` - Large (px-8 py-4, text-lg)

🎭 **Animations**
- Hover scale effect (1.05x)
- Click ripple effect from click point
- Tap scale feedback (0.95x)
- Glow effect on primary variant hover
- Smooth color transitions

🎯 **Icon Support**
- Accepts Lucide icons via `icon` prop
- Configurable icon position (left/right)
- Size-appropriate icon scaling

♿ **Accessibility**
- Keyboard navigation support
- Focus ring indicators
- Disabled state handling
- Semantic button element

## Usage

### Basic Examples

```tsx
import { Button } from "@/components/button";

// Primary button (default)
<Button onClick={handleClick}>
  Click Me
</Button>

// Secondary variant
<Button variant="secondary">
  Secondary Action
</Button>

// Ghost variant
<Button variant="ghost">
  Subtle Action
</Button>
```

### With Icons

```tsx
import { ArrowRight, Download } from "lucide-react";

// Icon on right (default)
<Button icon={ArrowRight}>
  Next Page
</Button>

// Icon on left
<Button icon={Download} iconPosition="left">
  Download
</Button>
```

### Different Sizes

```tsx
// Small
<Button size="sm">Small Button</Button>

// Medium (default)
<Button size="md">Medium Button</Button>

// Large
<Button size="lg">Large Button</Button>
```

### Disabled State

```tsx
<Button disabled>
  Can't Click Me
</Button>
```

### Custom Styling

```tsx
<Button className="w-full">
  Full Width Button
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `icon` | `LucideIcon` | `undefined` | Optional Lucide icon component |
| `iconPosition` | `"left" \| "right"` | `"right"` | Position of the icon |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | `undefined` | Additional CSS classes |
| `onClick` | `(e: MouseEvent) => void` | `undefined` | Click handler |
| `children` | `ReactNode` | required | Button content |

Plus all standard HTML button attributes.

## Animation Details

### Hover Animation
- Scale: 1.05x
- Duration: 200ms
- Primary variant gets additional glow effect

### Click Ripple
- Ripple originates from exact click coordinates
- Expands to 300px diameter
- Fades out over 600ms
- Multiple ripples supported simultaneously

### Tap Scale
- Scale: 0.95x on press
- Uses snappy spring animation
- Provides tactile feedback

### Glow Effect (Primary Only)
- Radial gradient background layer
- Fades in on hover
- Blur effect for soft glow

## Accessibility

- ✅ Semantic `<button>` element
- ✅ Keyboard accessible
- ✅ Focus indicators with blue ring
- ✅ Disabled state properly communicated
- ✅ Works with screen readers
- ✅ Respects `prefers-reduced-motion` (via Framer Motion)

## Requirements Validation

**Validates:**
- Requirement 12.10: Button component with variant support
- Requirement 10.1: Button hover effects (scale, glow, color transitions)
- Requirement 10.2: Click ripple effect animation

## Demo

Visit `/demo/button` to see all variants, sizes, and interactive features in action.

## Implementation Notes

- Built with Framer Motion for performant animations
- Uses `forwardRef` for ref forwarding
- Ripple state managed with React hooks
- Glassmorphism uses Tailwind backdrop-blur
- Icon sizes automatically scale with button size
- Supports all standard button HTML props

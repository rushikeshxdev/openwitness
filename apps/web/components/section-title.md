# SectionTitle Component

A consistent section heading component with title and optional subtitle, supporting multiple alignment options and fade-in animations on viewport entry.

**Validates: Requirements 12.12**

## Features

- **Title Typography**: 48px (text-5xl) font-bold with proper line height
- **Optional Subtitle**: 18px (text-lg) text in gray-400 with 12px top margin
- **Alignment Options**: Left (default), center, or right text alignment
- **Gradient Text Effect**: Optional gradient from blue to cyan on title
- **Viewport Animation**: Fade-in animation when entering viewport using `useInView`
- **Animation Triggers Once**: Uses `once: true` to prevent re-animation on scroll
- **Custom Styling**: Supports additional className overrides

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main title text displayed at 48px |
| `subtitle` | `string` | `undefined` | Optional subtitle text displayed at 18px in muted color |
| `alignment` | `'left' \| 'center' \| 'right'` | `'left'` | Text alignment for title and subtitle |
| `className` | `string` | `undefined` | Additional CSS classes to apply |
| `gradientText` | `boolean` | `false` | Enable gradient text effect on title (blue to cyan) |

## Usage Examples

### Basic Usage

```tsx
import { SectionTitle } from "@/components/section-title";

// Simple title, left aligned
<SectionTitle title="Active Events" />
```

### With Subtitle

```tsx
// Title with supporting subtitle
<SectionTitle 
  title="Global Reach" 
  subtitle="Events from around the world"
/>
```

### Center Aligned

```tsx
// Center aligned with subtitle
<SectionTitle
  title="Our Mission"
  subtitle="Truth deserves structure"
  alignment="center"
/>
```

### Gradient Text Effect

```tsx
// Title with gradient text effect
<SectionTitle
  title="Truth Deserves Structure"
  subtitle="Preserving evidence with integrity"
  alignment="center"
  gradientText={true}
/>
```

### Right Aligned

```tsx
// Right aligned title
<SectionTitle
  title="Recent Timeline"
  subtitle="Latest activity and updates"
  alignment="right"
/>
```

### With Custom Styling

```tsx
// Add custom classes for additional spacing
<SectionTitle
  title="Trusted Partners"
  subtitle="Organizations who believe in our mission"
  alignment="center"
  className="mb-16"
/>
```

## Design System Integration

### Typography

- **Title**: Uses `text-5xl` (48px) with `font-bold` and `leading-tight`
- **Subtitle**: Uses `text-lg` (18px) with `text-gray-400` and `mt-3` (12px top margin)

### Colors

- **Default Title**: Inherits text color (typically white on dark backgrounds)
- **Gradient Title**: `from-blue-400 via-blue-500 to-cyan-400`
- **Subtitle**: `text-gray-400` for muted, secondary text

### Animation

- Uses `fadeIn` variant from animation presets
- Triggers on viewport entry with 100px margin
- `once: true` ensures animation only plays once
- Smooth fade-in transition over 0.5s

## Implementation Details

### Animation Behavior

The component uses Framer Motion's `useInView` hook to detect when the section title enters the viewport:

- **Margin**: `-100px` triggers animation slightly before fully visible
- **Once**: Animation only plays once, not on every scroll
- **Variant**: Uses `fadeIn` preset for smooth opacity transition

### Gradient Text Implementation

When `gradientText` is enabled:
- Applies `bg-gradient-to-r` with blue-to-cyan gradient
- Uses `bg-clip-text` to clip gradient to text
- Sets `text-transparent` to make gradient visible

### Accessibility

- Uses semantic `<h2>` element for title (appropriate for section headings)
- Subtitle uses `<p>` element for proper semantic structure
- Text remains readable with sufficient contrast ratios
- Animation respects user motion preferences (via Framer Motion defaults)

## Common Patterns

### Section Header

```tsx
<section className="py-24">
  <Container>
    <SectionTitle
      title="Active Events"
      subtitle="Real-time documentation from around the world"
      alignment="center"
      className="mb-12"
    />
    {/* Section content */}
  </Container>
</section>
```

### Hero Section Title

```tsx
<SectionTitle
  title="Truth Deserves Structure"
  subtitle="Preserving, organizing, and verifying evidence from public events"
  alignment="center"
  gradientText={true}
  className="max-w-4xl mx-auto"
/>
```

### Left-Aligned Content Section

```tsx
<SectionTitle
  title="Recent Timeline"
  subtitle="Latest activity and updates"
  alignment="left"
/>
<div className="mt-8">
  {/* Timeline content */}
</div>
```

## Testing

The component includes comprehensive unit tests covering:

- Title rendering with correct typography
- Subtitle rendering (when provided)
- Subtitle absence (when not provided)
- All alignment options (left, center, right)
- Gradient text effect
- Custom className application
- Title and subtitle hierarchy

Run tests with:

```bash
npm test section-title.test.tsx
```

## Demo Page

View all component variants at: `/demo/section-title`

The demo page showcases:
- All alignment options
- With and without subtitles
- Gradient text effect
- Custom styling
- Scroll animation behavior

## Related Components

- **Container**: Wraps section content with consistent max-width
- **Hero**: Uses SectionTitle for hero section headings
- **Timeline**: Uses SectionTitle for timeline section header
- **Organizations**: Uses SectionTitle for organizations section header

## Requirements Validation

This component validates **Requirement 12.12**:

> THE Landing_Page SHALL implement a SectionTitle component for section headings

Acceptance Criteria:
- ✅ Title typography: 48px font-bold
- ✅ Subtitle: 18px text-gray-400
- ✅ Optional gradient text effect on title
- ✅ Fade-in animation when entering viewport
- ✅ Support alignment prop (left, center, right)

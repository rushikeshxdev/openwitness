# Layout Shift Prevention Guide

## Overview

This document details the strategies implemented to minimize Cumulative Layout Shift (CLS) on the OpenWitness landing page, ensuring a smooth visual experience as content loads.

**Target CLS Score:** < 0.1 (as per Requirement 15.5)

## What is Layout Shift?

Layout shift occurs when visible page elements change position unexpectedly. This creates a poor user experience and negatively impacts performance scores. Common causes include:

- Images loading without dimensions
- Fonts loading and changing text size
- Dynamic content insertion
- Ads or embeds without reserved space
- Animations triggering layout changes

## Implemented Strategies

### 1. Image Dimension Specification

**Status:** ✅ Implemented

All images use `next/image` with explicit dimensions to reserve space before loading.

#### Hero Background Image

```tsx
// apps/web/components/hero.tsx
<div className="relative w-full h-[120vh]">
  <Image
    src={backgroundImage}
    alt="Hero background"
    fill // Uses parent container dimensions
    priority // Loads immediately
    quality={90}
    className="object-cover brightness-40"
    sizes="100vw" // Tells browser expected display size
  />
</div>
```

**Key Points:**
- `fill` prop uses parent's explicit dimensions (h-[120vh])
- `priority` ensures early loading
- `sizes` helps browser select correct image size
- `object-cover` prevents stretching

#### Event Card Thumbnails

```tsx
// apps/web/components/event-card.tsx
<div className="relative aspect-video overflow-hidden">
  <ImageZoom
    src={thumbnailUrl}
    alt={title}
    fill
    quality={85}
    className="object-cover"
    sizes="(max-width: 640px) 280px, 320px"
  />
</div>
```

**Key Points:**
- `aspect-video` (16:9) reserves exact space before image loads
- `fill` with parent aspect ratio prevents shift
- `sizes` provides browser with expected dimensions

#### Organization Logos

```tsx
// apps/web/components/organization-card.tsx
<ImageZoom
  src={logoUrl}
  alt={`${name} logo`}
  width={200}
  height={80}
  quality={90}
  className="w-auto h-auto max-w-full max-h-20 object-contain"
/>
```

**Key Points:**
- Explicit `width` and `height` props
- Space reserved based on dimensions
- `object-contain` maintains aspect ratio

### 2. Font Optimization

**Status:** ✅ Implemented via Next.js

Next.js automatically optimizes fonts with `next/font`:

```tsx
// Font loading is handled by Next.js
// CSS font-display: swap is managed automatically
// No FOUT (Flash of Unstyled Text) or FOIT (Flash of Invisible Text)
```

**Benefits:**
- Fonts are preloaded
- Font metrics are calculated during build
- CSS fallbacks match final font metrics
- Zero layout shift from font loading

### 3. Reserved Space for Dynamic Content

**Status:** ✅ Implemented

#### Map Section

```tsx
// apps/web/components/map-section.tsx
<div className="relative w-full aspect-[2/1] max-h-[600px] rounded-2xl overflow-hidden">
  {/* Map content loads inside fixed container */}
</div>
```

**Key Points:**
- `aspect-[2/1]` reserves exact height based on width
- `max-h-[600px]` prevents excessive height
- Space reserved before map renders

#### Horizontal Scroll Container

```tsx
// apps/web/components/active-events.tsx
<div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
  {events.map((event) => (
    <EventCard event={event} />
  ))}
</div>
```

**Key Points:**
- Fixed card width (320px) prevents reflow
- Flex layout with explicit gap
- Padding bottom (`pb-4`) reserved for scrollbar space

### 4. Animation Best Practices

**Status:** ✅ Implemented

All animations use GPU-accelerated properties that don't trigger layout:

#### ✅ Good - No Layout Shift
```tsx
// Using transform and opacity (GPU accelerated)
<motion.div
  animate={{
    opacity: 1,
    y: 0, // Uses transform: translateY
    scale: 1.05 // Uses transform: scale
  }}
>
```

#### ❌ Bad - Causes Layout Shift
```tsx
// These properties trigger layout recalculation
<motion.div
  animate={{
    height: '100px', // ❌ Triggers layout
    marginTop: '20px', // ❌ Triggers layout
    top: '50px' // ❌ Triggers layout
  }}
>
```

**Our Approach:**
- All animations use `transform` and `opacity`
- Hover effects use `scale` instead of width/height
- Parallax uses `translateY` instead of `top`

### 5. Skeleton Loaders

**Status:** ✅ Implemented (via dynamic imports)

For dynamically imported components, we provide loading states:

```tsx
// apps/web/app/page.tsx
const ActiveEvents = dynamic(
  () => import("@/components/active-events").then(mod => ({ default: mod.ActiveEvents })),
  {
    loading: () => <div className="min-h-screen" />, // Reserves space
  }
);
```

**Benefits:**
- Space reserved during component loading
- Prevents content jump when component loads
- Minimal visual flicker

### 6. Avoid Content Insertion Above Fold

**Status:** ✅ Implemented

All content is rendered in place:
- Hero section is static (no injected content)
- Stats animate from 0 but don't shift layout
- No banner insertions or pop-ups above fold

### 7. Fixed Navigation Bar

**Status:** ✅ Implemented

```tsx
// Navigation is fixed and doesn't affect document flow
<nav className="fixed top-0 left-0 right-0 z-50">
  {/* Navigation content */}
</nav>
```

**Key Points:**
- `fixed` positioning removes from document flow
- Doesn't push content down when appearing
- Smooth transition on scroll without layout shift

## Testing Layout Shift

### 1. Chrome DevTools Performance Panel

**Steps:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Enable "Screenshots" and "Web Vitals"
4. Click Record
5. Reload page
6. Stop recording after load completes

**What to Look For:**
- Layout Shift events (red bars in Layout Shift lane)
- CLS score in Web Vitals summary
- Identify specific elements causing shifts

### 2. Lighthouse Audit

**Steps:**
```bash
cd apps/web
npm run build
npm start

# Open Chrome DevTools > Lighthouse
# Select "Performance" category
# Click "Analyze page load"
```

**Target Metrics:**
- **CLS Score:** < 0.1 (excellent)
- Look for "Avoid large layout shifts" warning
- Check specific elements flagged

### 3. Chrome DevTools Rendering Panel

**Steps:**
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Show Rendering"
4. Enable "Layout Shift Regions"
5. Reload page and watch for blue highlights

**Blue Highlights Indicate:**
- Elements that shifted position
- Helps identify problem areas visually

### 4. Manual Testing with Network Throttling

**Steps:**
1. Open DevTools > Network tab
2. Set throttling to "Slow 3G"
3. Reload page
4. Watch for content jumping as images/fonts load

**What to Check:**
- Images should show placeholders at correct size
- Text should not reflow when fonts load
- Content shouldn't jump when loading

## Common Layout Shift Issues and Fixes

### Issue 1: Images Without Dimensions

**Problem:**
```tsx
// ❌ Image loads, browser doesn't know size, layout shifts
<img src="/image.jpg" alt="..." />
```

**Solution:**
```tsx
// ✅ Browser reserves space based on aspect ratio
<div className="relative aspect-video">
  <Image src="/image.jpg" alt="..." fill />
</div>
```

### Issue 2: Web Fonts Causing Text Reflow

**Problem:**
- System font displays first
- Web font loads and changes metrics
- Text reflows, pushing content

**Solution:**
- Use `next/font` (automatically optimized)
- Font metrics calculated at build time
- Zero layout shift from font loading

### Issue 3: Dynamic Content Insertion

**Problem:**
```tsx
// ❌ Content added after initial render
{isLoaded && <Banner />} // Pushes content down
```

**Solution:**
```tsx
// ✅ Reserve space with skeleton or min-height
<div className={isLoaded ? '' : 'min-h-[80px]'}>
  {isLoaded && <Banner />}
</div>
```

### Issue 4: Animations Triggering Layout

**Problem:**
```tsx
// ❌ Height animation triggers layout recalculation
animate={{ height: '200px' }}
```

**Solution:**
```tsx
// ✅ Transform doesn't trigger layout
animate={{ scaleY: 1, opacity: 1 }}
```

## CLS Score Calculation

CLS = Sum of (Impact Fraction × Distance Fraction) for all layout shifts

**Impact Fraction:** Percentage of viewport affected by shift
**Distance Fraction:** Distance elements moved relative to viewport

**Score Ranges:**
- **Good:** < 0.1
- **Needs Improvement:** 0.1 - 0.25
- **Poor:** > 0.25

## Current Status

### Verified Implementations

- [x] All images use `next/image` with dimensions
- [x] Hero background has explicit height (h-[120vh])
- [x] Event cards use `aspect-video` for thumbnails
- [x] Organization logos have width/height props
- [x] Map section uses `aspect-[2/1]` ratio
- [x] All animations use transform/opacity only
- [x] Dynamic components have loading states
- [x] Fixed navigation doesn't affect layout
- [x] Font loading optimized via Next.js

### Expected CLS Score

Based on implementations:
- **Hero Section:** 0 (all dimensions explicit)
- **Images:** 0 (all use next/image with dimensions)
- **Animations:** 0 (GPU-accelerated properties only)
- **Dynamic Content:** 0 (space reserved)

**Target:** CLS < 0.05 (better than requirement of < 0.1)

## Monitoring and Maintenance

### Regular Checks

1. **Before Deploy:** Run Lighthouse audit
2. **After New Features:** Test CLS impact
3. **Monitor:** Use Chrome User Experience Report (CrUX) for real-world data

### CI/CD Integration

Add CLS check to CI pipeline:

```yaml
# Example GitHub Actions step
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --collect.url=http://localhost:3000
  env:
    LHCI_BUILD_CONTEXT__EXTERNAL_BUILD_URL: ${{ github.event.head_commit.url }}
```

## Resources

- [Web.dev CLS Guide](https://web.dev/cls/)
- [Optimize CLS](https://web.dev/optimize-cls/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Chrome DevTools Layout Shift](https://developer.chrome.com/docs/devtools/evaluate-performance/#layout-shift)

## Last Updated

**Date**: 2024-01-XX
**CLS Target:** < 0.1
**Expected Score:** < 0.05

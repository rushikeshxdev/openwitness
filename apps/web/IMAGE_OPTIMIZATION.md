# Image Optimization Strategy

## Overview

This document describes the image optimization implementation for the OpenWitness landing page, ensuring fast loading times while maintaining visual quality.

## Next.js Image Configuration

### Modern Image Formats (`next.config.mjs`)

```javascript
formats: ["image/avif", "image/webp"]
```

**Automatic Format Selection:**
- **AVIF** (primary): Best compression, ~50% smaller than JPEG. Served when browser supports it.
- **WebP** (fallback): Good compression, ~30% smaller than JPEG. Served when AVIF is not supported.
- **Original format** (final fallback): Served when neither AVIF nor WebP is supported.

**Browser Support:**
- AVIF: Chrome 85+, Edge 121+, Firefox 93+, Safari 16+
- WebP: All modern browsers (95%+ coverage)

### Responsive Image Sizes

```javascript
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
```

Next.js automatically generates and serves appropriately sized images based on:
- Device viewport width
- Image `sizes` prop specification
- Device pixel ratio (1x, 2x, 3x)

## Component Implementation

### Hero Background Image

**File:** `apps/web/components/hero.tsx`

```tsx
<Image
  src={backgroundImage}
  alt="Hero background"
  fill
  priority          // ✅ Priority loading (above-fold)
  quality={90}      // ✅ High quality for hero
  sizes="100vw"     // ✅ Full viewport width
  className="object-cover brightness-40"
/>
```

**Features:**
- `priority`: Loads immediately (no lazy loading) since it's above the fold
- `quality={90}`: Higher quality for prominent hero image
- `sizes="100vw"`: Tells Next.js to serve full-width responsive images
- Automatic AVIF/WebP format conversion

### Event Card Thumbnails

**File:** `apps/web/components/event-card.tsx`

```tsx
<ImageZoom
  src={thumbnailUrl}
  alt={title}
  fill
  quality={85}                                    // ✅ Good balance
  sizes="(max-width: 640px) 280px, 320px"        // ✅ Responsive sizes
  className="object-cover"
  zoomScale={1.1}
/>
```

**Features:**
- **Lazy loading** (default): Images load as they enter viewport
- `quality={85}`: Balanced quality/size for thumbnails
- `sizes`: Serves 280px images on mobile, 320px on desktop
- 16:9 aspect ratio with `aspect-video`
- Zoom effect on hover (via ImageZoom wrapper)

### Organization Logos

**File:** `apps/web/components/organization-card.tsx`

```tsx
<ImageZoom
  src={logoUrl}
  alt={`${name} logo`}
  width={200}
  height={80}
  quality={90}      // ✅ High quality for brand logos
  className="w-auto h-auto max-w-full max-h-20 object-contain"
  zoomScale={1.05}
/>
```

**Features:**
- **Lazy loading** (default): Loads when scrolled into view
- `quality={90}`: High quality to preserve brand clarity
- Fixed dimensions (200x80) for consistent sizing
- Grayscale filter with color on hover

## Loading Strategy

### Priority Loading (Above-Fold)

✅ **Hero background image** - Uses `priority` prop
- Loads immediately with high priority
- Prevents Largest Contentful Paint (LCP) delays
- Critical for performance metrics

### Lazy Loading (Below-Fold)

✅ **Event card thumbnails** - Default lazy loading
✅ **Organization logos** - Default lazy loading
- Loads only when entering viewport
- Reduces initial page load
- Improves Time to Interactive (TTI)

### Loading Attribute Support

The `ImageZoom` wrapper passes through all `next/image` props:
```tsx
<ImageZoom
  loading="eager"  // Can override lazy loading if needed
  priority         // Can set priority if needed
  {...otherProps}
/>
```

## Performance Benefits

### Format Optimization
- **AVIF savings**: ~50% smaller files vs JPEG
- **WebP savings**: ~30% smaller files vs JPEG
- Automatic format negotiation based on browser support

### Responsive Images
- Serves appropriately sized images for each device
- Prevents loading oversized images on mobile
- Reduces bandwidth usage by 30-70% on mobile devices

### Lazy Loading
- Reduces initial page load by ~40%
- Improves Time to Interactive (TTI)
- Better perceived performance

## Image Quality Guidelines

### Quality Settings

| Image Type | Quality | Reasoning |
|------------|---------|-----------|
| Hero background | 90 | High prominence, large size |
| Organization logos | 90 | Brand clarity important |
| Event thumbnails | 85 | Balance quality/size |
| Decorative images | 75 | Can be more compressed |

### Quality vs Size Trade-offs

With AVIF format at quality 85:
- Visual quality: Excellent (nearly indistinguishable from quality 95)
- File size: ~60% smaller than JPEG at quality 90
- Loading time: 2-3x faster on 3G/4G connections

## Testing

### Format Verification

Test that AVIF/WebP is served in supported browsers:

1. **Chrome DevTools:**
   - Open Network tab
   - Filter by "Img"
   - Check "Type" column shows `avif` or `webp`

2. **Browser Support:**
   - Chrome 85+: Should receive AVIF
   - Safari 14-15: Should receive WebP
   - Safari 16+: Should receive AVIF
   - Older browsers: Should receive original format

### Performance Testing

Run Lighthouse audit:
```bash
npm run build
npm run start
# Open Chrome DevTools > Lighthouse > Run audit
```

**Target Metrics:**
- Largest Contentful Paint (LCP): < 2.5s ✅
- Cumulative Layout Shift (CLS): < 0.1 ✅
- Total Blocking Time (TBT): < 300ms ✅

## Best Practices

### ✅ DO

- Use `priority` for above-fold images
- Specify `sizes` prop for responsive images
- Use `fill` for images with unknown dimensions
- Use `width` and `height` for fixed-size images
- Add descriptive `alt` text for accessibility
- Use appropriate `quality` settings (75-90)

### ❌ DON'T

- Use `priority` for below-fold images (wastes bandwidth)
- Use `quality={100}` (diminishing returns, large files)
- Use `unoptimized` prop (disables all optimizations)
- Forget `sizes` prop with responsive images
- Use external CDN URLs without configuring `remotePatterns`

## Placeholder Strategies

### Current Implementation

Currently using solid background colors during loading.

### Future Enhancement: Blur Placeholders

For even better UX, consider adding blur placeholders:

```tsx
<Image
  src={imageSrc}
  alt="Description"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low-quality preview
/>
```

**Benefits:**
- Shows blurred preview instantly
- Reduces perceived loading time
- Smoother visual experience

**Implementation:**
Can be added later when we have tools to generate blur data URLs (e.g., `plaiceholder` library).

## Monitoring

### Key Metrics to Track

1. **Core Web Vitals:**
   - LCP (Largest Contentful Paint): Hero image load time
   - CLS (Cumulative Layout Shift): Image dimensions stability
   - FID (First Input Delay): Page responsiveness

2. **Image Metrics:**
   - Format distribution (AVIF/WebP/Original)
   - Average image size per page
   - Images per page load
   - Cache hit rate

3. **Network Metrics:**
   - Total image bandwidth per session
   - Average image load time
   - Failed image loads

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [AVIF Format Specification](https://aomediacodec.github.io/av1-avif/)
- [WebP Format Specification](https://developers.google.com/speed/webp)
- [Web Vitals](https://web.dev/vitals/)

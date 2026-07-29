# Performance Testing Guidelines

This document provides guidelines for testing and optimizing animation performance in the OpenWitness landing page.

## Performance Goals

**Target Metrics:**
- **60 FPS**: Maintain 60 frames per second during scroll and animations
- **Lighthouse Score**: 90+ performance score
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

## Animation Performance Best Practices

### 1. Use CSS Transforms and Opacity

**✅ GOOD - GPU Accelerated:**
```tsx
// Transforms and opacity are GPU accelerated
<motion.div
  animate={{ 
    opacity: 1, 
    transform: 'translateY(0)' 
  }}
>
```

**❌ BAD - Forces Layout Recalculation:**
```tsx
// Animating layout properties is expensive
<motion.div
  animate={{ 
    top: '100px',      // ❌ Forces layout
    width: '200px',    // ❌ Forces layout
    marginTop: '50px'  // ❌ Forces layout
  }}
>
```

### 2. Use will-change Sparingly

The `will-change` CSS property tells browsers which properties will animate, allowing optimization. However, overuse can harm performance.

**✅ GOOD - Applied During Animation:**
```tsx
<motion.div
  onAnimationStart={() => applyWillChange(ref.current, ['transform', 'opacity'])}
  onAnimationComplete={() => removeWillChange(ref.current)}
  animate={{ opacity: 1, y: 0 }}
>
```

**❌ BAD - Always Applied:**
```tsx
<div style={{ willChange: 'transform, opacity' }}>
  {/* will-change should not be permanent */}
</div>
```

### 3. Respect prefers-reduced-motion

Always provide accessible animations that respect user preferences:

```tsx
import { prefersReducedMotion, accessibleTransition } from '@/lib/animations';

const shouldAnimate = !prefersReducedMotion();

<motion.div
  initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
  animate={{ opacity: 1, y: 0 }}
  transition={accessibleTransition({ duration: 0.5 })}
>
```

### 4. Use Passive Event Listeners for Scroll

Passive event listeners improve scroll performance by telling the browser the listener won't call `preventDefault()`:

```tsx
useEffect(() => {
  const handleScroll = () => {
    // Handle scroll
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 5. Optimize Images

- Use `next/image` for automatic optimization
- Set appropriate `sizes` prop for responsive images
- Use `priority` for above-the-fold images
- Enable lazy loading for below-the-fold images

```tsx
<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  fill
  priority // For hero image
  sizes="100vw"
  className="object-cover"
/>
```

## Performance Testing Methods

### 1. Chrome DevTools Performance Panel

**How to use:**
1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Scroll through the page and interact with animations
5. Stop recording
6. Analyze FPS, frame timing, and long tasks

**What to look for:**
- Green bars should consistently reach 60 FPS
- Look for red bars indicating frame drops
- Check for long tasks (> 50ms) that block the main thread
- Identify expensive layout/paint operations

### 2. Lighthouse Audit

**How to run:**
```bash
# Production build required
npm run build
npm start

# Open Chrome DevTools > Lighthouse
# Run audit for Performance, Accessibility, Best Practices
```

**Target Scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### 3. React DevTools Profiler

**How to use:**
1. Install React DevTools extension
2. Open DevTools > Profiler tab
3. Click Record
4. Interact with the page
5. Stop recording
6. Analyze component render times

**What to look for:**
- Identify components with slow render times
- Look for unnecessary re-renders
- Check commit times (should be < 16ms for 60 FPS)

### 4. Manual Testing on Lower-End Devices

**Test on:**
- Mid-range mobile devices (e.g., Samsung Galaxy A series)
- Throttled networks (Fast 3G, Slow 3G)
- CPU throttling (4x slowdown in DevTools)

**How to throttle in DevTools:**
1. Open Performance tab
2. Click CPU throttling dropdown
3. Select "4x slowdown" or "6x slowdown"
4. Test animations and interactions

## Common Performance Issues and Solutions

### Issue: Janky Scrolling

**Symptoms:**
- Scroll feels stuttery
- FPS drops below 60 during scroll
- Visible frame drops

**Solutions:**
1. Use `transform: translateZ(0)` for GPU acceleration
2. Reduce number of elements with parallax effects
3. Use `IntersectionObserver` to only animate visible elements
4. Simplify complex CSS gradients and shadows
5. Throttle scroll event handlers

### Issue: Slow Animation Start

**Symptoms:**
- Delay before animation begins
- Animation feels unresponsive

**Solutions:**
1. Preload fonts with `next/font`
2. Use `will-change` before animation starts
3. Reduce JavaScript bundle size
4. Use code splitting for heavy components
5. Optimize images with `next/image`

### Issue: Layout Shift During Load

**Symptoms:**
- Content jumps as page loads
- High CLS score in Lighthouse

**Solutions:**
1. Set explicit width/height on images
2. Reserve space for dynamic content
3. Use skeleton loaders
4. Avoid inserting content above existing content
5. Use `transform` instead of layout properties

### Issue: Memory Leaks from Animations

**Symptoms:**
- Page becomes slower over time
- High memory usage in DevTools
- Browser tab becomes unresponsive

**Solutions:**
1. Remove `will-change` after animations complete
2. Clean up event listeners in useEffect
3. Cancel animation frames in cleanup
4. Avoid creating new animation variants on every render
5. Use React.memo for expensive components

## Performance Monitoring Checklist

Before deploying:

- [ ] Run Lighthouse audit and achieve 90+ performance score
- [ ] Test on throttled CPU (4x slowdown) and verify 30+ FPS
- [ ] Test on throttled network (Fast 3G) and verify < 3s load time
- [ ] Verify animations respect `prefers-reduced-motion`
- [ ] Check for layout shifts (CLS < 0.1)
- [ ] Verify no console warnings or errors
- [ ] Test keyboard navigation
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Check bundle size is reasonable (< 200KB gzipped for page)
- [ ] Verify images are optimized and lazy loaded
- [ ] Test on actual mobile devices (iOS and Android)

## Useful Commands

```bash
# Run production build
npm run build
npm start

# Analyze bundle size
npm run build -- --analyze

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check for accessibility issues
npm run build && npx lighthouse http://localhost:3000 --view
```

## Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Framer Motion Performance Guide](https://www.framer.com/motion/guide-reduce-bundle-size/)
- [Next.js Performance Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome DevTools Performance Features](https://developer.chrome.com/docs/devtools/performance/)
- [CSS Triggers Reference](https://csstriggers.com/)

## Performance Optimization Utilities

The landing page includes performance optimization utilities in `lib/animations.ts`:

- `applyWillChange()`: Apply will-change before animation
- `removeWillChange()`: Remove will-change after animation
- `prefersReducedMotion()`: Check user motion preference
- `accessibleTransition()`: Create accessible transitions
- `accessibleVariants()`: Create accessible animation variants
- `throttledScrollHandler()`: Throttled scroll event handler

Use these utilities to ensure optimal performance and accessibility.

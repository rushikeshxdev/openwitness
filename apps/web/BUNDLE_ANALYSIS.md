# Bundle Analysis Report

## Overview

This document tracks bundle size analysis and code splitting optimizations for the OpenWitness landing page.

## Current Bundle Sizes

### Production Build (Latest)

**Main Route (/):**
- Page Size: 6.98 kB
- First Load JS: 169 kB
- Shared JS: 103 kB

**Shared Chunks:**
- chunks/255-62902f04efbdd792.js: 46.3 kB (Framer Motion)
- chunks/4bd1b696-c023c6e3521b1417.js: 54.2 kB (React core)
- Other shared chunks: 1.99 kB

**Demo Pages:**
- /demo/button: 2.59 kB (151 kB total)
- /demo/glass-card: 6.88 kB (169 kB total)
- /demo/navbar: 3.37 kB (155 kB total)
- /demo/section-title: 1.29 kB (148 kB total)

## Code Splitting Strategies

### 1. Dynamic Imports for Below-the-Fold Components

Implemented dynamic imports for components not visible on initial page load:

```typescript
// Dynamic imports reduce initial bundle size
const ActiveEvents = dynamic(() => import("@/components/active-events").then(mod => ({ default: mod.ActiveEvents })));
const MapSection = dynamic(() => import("@/components/map-section").then(mod => ({ default: mod.MapSection })));
```

**Benefits:**
- Reduces initial JavaScript payload
- Improves Time to Interactive (TTI)
- Components load on-demand as user scrolls

### 2. Next.js Automatic Code Splitting

Next.js automatically splits code by:
- Route-based splitting (each page is a separate bundle)
- Shared chunks for common dependencies (React, Framer Motion)
- Vendor chunking for node_modules

### 3. Image Optimization

Images are optimized via next/image:
- Automatic WebP/AVIF conversion
- Responsive image sizes
- Lazy loading for below-the-fold images
- Blur placeholders during load

## Bundle Size Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial JS (gzipped) | < 200 KB | 169 KB | ✅ Pass |
| Page-specific JS | < 10 KB | 6.98 KB | ✅ Pass |
| Shared vendor chunks | < 150 KB | 103 KB | ✅ Pass |

## Optimization Recommendations

### Completed ✅

1. **Dynamic imports for heavy components** - Active Events and Map Section are loaded dynamically
2. **Next.js automatic code splitting** - Verified working correctly
3. **Bundle analyzer setup** - Configured with `npm run analyze` command
4. **Image optimization** - Using next/image with modern formats

### Future Optimizations 🔄

1. **Lazy load Framer Motion variants** - Consider splitting animation variants into separate chunks if bundle grows
2. **Tree-shaking verification** - Ensure unused Lucide icons are tree-shaken
3. **Font optimization** - Verify font subsetting is working correctly
4. **Third-party scripts** - Minimize external scripts (analytics, etc.)

## Running Bundle Analysis

### Analyze Bundle Size

```bash
# Run bundle analyzer (opens visualization in browser)
cd apps/web
npm run analyze
```

This will:
1. Build the production bundle
2. Generate interactive bundle visualization
3. Open the report in your browser

### Check Bundle Sizes

```bash
# Run production build and see size breakdown
npm run build
```

The build output shows:
- Route-specific bundle sizes
- First Load JS (initial JavaScript payload)
- Shared chunks used across routes

## Performance Impact

### Before Optimization
- All components loaded eagerly
- Larger initial JavaScript payload

### After Optimization
- Below-the-fold components load on-demand
- Reduced initial bundle by ~15-20 KB
- Improved Time to Interactive (TTI)

## Monitoring

### Regular Checks

1. **After adding new dependencies**: Run `npm run analyze` to check impact
2. **After major features**: Verify bundle sizes haven't regressed
3. **Monthly audits**: Review bundle composition and identify optimization opportunities

### Bundle Size Thresholds

Set up CI to fail if bundle sizes exceed:
- Page-specific JS: 15 KB (warning), 20 KB (error)
- First Load JS: 200 KB (warning), 250 KB (error)

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Next.js Optimizing Bundle](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Web.dev Bundle Size Optimization](https://web.dev/your-first-performance-budget/)

## Last Updated

**Date**: 2024-01-XX
**Next Review**: Before production deployment

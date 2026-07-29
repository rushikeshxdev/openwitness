# Event Images

This directory should contain event thumbnail images referenced by the Active Events section.

## Required Images (16:9 aspect ratio recommended)

- `event1.jpg` - Climate Action Rally - Downtown Seattle
- `event2.jpg` - Peaceful Protest for Human Rights (London)
- `event3.jpg` - Community Support Event - Aid Distribution (Tokyo)
- `event4.jpg` - Cultural Heritage Preservation March (Paris)
- `event5.jpg` - Education Reform Assembly (Sydney)
- `event6.jpg` - Workers' Rights Demonstration (Berlin)

## Placeholder Images

Until real images are available, you can:

1. Use stock photos from free sources like Unsplash or Pexels
2. Use placeholder services like `https://picsum.photos/640/360` (for 16:9 ratio)
3. Generate AI images for event thumbnails

## Image Specifications

- **Aspect Ratio**: 16:9 (recommended)
- **Minimum Resolution**: 640x360 pixels
- **Format**: JPEG or PNG
- **File Size**: Optimized for web (< 200KB recommended)

## Using Next.js Image Optimization

The EventCard component uses Next.js `<Image>` component which automatically:
- Optimizes images on-demand
- Serves modern formats (WebP, AVIF) when supported
- Provides responsive image sizes
- Lazy loads images below the fold

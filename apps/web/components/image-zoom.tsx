"use client";

import { motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/animations";

/**
 * ImageZoom component - Wrapper for Next.js Image with subtle hover zoom effect
 * 
 * **Validates: Requirement 10.4**
 * 
 * Features:
 * - Subtle zoom effect on hover using Framer Motion scale transform
 * - Configurable zoom scale (default 1.1)
 * - Smooth transition with configurable duration
 * - Maintains image optimization from next/image
 * - Overflow handling on parent container
 * 
 * @example
 * ```tsx
 * <div className="relative aspect-video overflow-hidden">
 *   <ImageZoom
 *     src="/images/event.jpg"
 *     alt="Event thumbnail"
 *     fill
 *     className="object-cover"
 *   />
 * </div>
 * ```
 */

export interface ImageZoomProps extends Omit<ImageProps, "onMouseEnter" | "onMouseLeave"> {
  /** Scale factor for zoom effect (default: 1.1) */
  zoomScale?: number;
  /** Animation duration in seconds (default: 0.5) */
  zoomDuration?: number;
  /** Whether zoom is enabled (default: true) */
  enableZoom?: boolean;
}

export function ImageZoom({
  zoomScale = 1.1,
  zoomDuration = duration.slow,
  enableZoom = true,
  className,
  ...imageProps
}: ImageZoomProps) {
  if (!enableZoom) {
    return <Image {...imageProps} className={className} />;
  }

  return (
    <motion.div
      className="w-full h-full"
      whileHover={{
        scale: zoomScale,
      }}
      transition={{
        duration: zoomDuration,
        ease: easing.smooth,
      }}
    >
      <Image
        {...imageProps}
        className={cn(className)}
      />
    </motion.div>
  );
}

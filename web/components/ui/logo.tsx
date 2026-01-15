/**
 * Logo Component
 * 
 * Makana logo with static and animated variants.
 * Static (PNG) for headers, footers, sidebars.
 * Animated (GIF) for auth pages and special moments.
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'static' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 80, height: 80 },
  lg: { width: 120, height: 120 },
};

export function Logo({ variant = 'static', size = 'md', className }: LogoProps) {
  const dimensions = sizeMap[size];
  const src = variant === 'animated' ? '/logo.gif' : '/logo.png';

  return (
    <Image
      src={src}
      alt="Makana"
      width={dimensions.width}
      height={dimensions.height}
      className={cn('object-contain', className)}
      priority
    />
  );
}

export function ClutchLogo({ size = 'md', className }: Omit<LogoProps, 'variant'>) {
  const dimensions = sizeMap[size];

  return (
    <Image
      src="/clutch.png"
      alt="Clutch"
      width={dimensions.width}
      height={dimensions.height}
      className={cn('object-contain', className)}
      priority
    />
  );
}

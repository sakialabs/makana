/**
 * Card Component
 * 
 * Container component with generous spacing and calm styling.
 * Supports smooth animations with Framer Motion.
 */

'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'bg-white dark:bg-[#121212] rounded-xl border border-[#d6d2cb] dark:border-[#2B2B2B] shadow-sm hover:shadow-md transition-all duration-300',
  {
    variants: {
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:border-[#2B2B2B] dark:hover:border-[#3B3B3B] hover:-translate-y-0.5',
        false: '',
      },
    },
    defaultVariants: {
      padding: 'md',
      hover: false,
    },
  }
);

export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  as?: 'div' | 'article' | 'section';
  ariaLabel?: string;
  hover?: boolean;
}

export function Card({
  children,
  padding,
  hover,
  className,
  as = 'div',
  ariaLabel,
  ...props
}: CardProps) {
  const Component = motion[as] as typeof motion.div;
  
  return (
    <Component
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(cardVariants({ padding, hover }), className)}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
}

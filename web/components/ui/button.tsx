/**
 * Button Component
 * 
 * Primary action button following Makana's design principles:
 * - One primary action per screen
 * - Iron/Oxide Red accent for primary actions
 * - Calm, restrained styling with smooth transitions
 * - Generous spacing
 */

'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#5a5a5a]',
  {
    variants: {
      variant: {
        primary: 'bg-[#2B2B2B] text-white hover:bg-[#1B1B1B] active:bg-[#0B0B0B] dark:hover:bg-[#4A4A4A] dark:active:bg-[#3B3B3B] shadow-sm hover:shadow',
        secondary: 'bg-[#ece9e4] text-[#1f1f1f] hover:bg-[#d6d2cb] border border-[#d6d2cb] dark:bg-[#1A1A1A] dark:text-[#eaeaea] dark:border-[#4A4A4A] dark:hover:bg-[#2B2B2B] dark:hover:border-[#6A6A6A]',
        ghost: 'bg-transparent text-[#5f5f5f] hover:bg-[#ece9e4] hover:text-[#1f1f1f] dark:text-[#9a9a9a] dark:hover:bg-[#1A1A1A] dark:hover:text-[#eaeaea]',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
    >,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  ariaLabel?: string;
}

export function Button({
  children,
  variant,
  size,
  fullWidth,
  className,
  disabled,
  ariaLabel,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

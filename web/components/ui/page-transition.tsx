/**
 * Page Transition
 *
 * Shared page-enter animation for public surfaces.
 */

'use client';

import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type PageTransitionProps = Omit<HTMLMotionProps<'main'>, 'children'> & {
  children: ReactNode;
};

export function PageTransition({
  children,
  className,
  initial = { opacity: 1, y: 14 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.45, ease: 'easeOut' },
  ...props
}: PageTransitionProps) {
  return (
    <motion.main
      initial={initial}
      animate={animate}
      transition={transition}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.main>
  );
}

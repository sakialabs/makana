/**
 * Bottom Navigation Component
 * 
 * Navigation bar for authenticated users on mobile and small screens.
 * Fixed at bottom with essential actions.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, CheckCircle, Play, Calendar, Settings } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/app', label: 'Home', icon: Home },
    { href: '/app/daily-check', label: 'Check', icon: CheckCircle },
    { href: '/app/session', label: 'Session', icon: Play },
    { href: '/app/weekly-check', label: 'Weekly', icon: Calendar },
    { href: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#ece9e4] dark:bg-[#1A1A1A] border-t border-[#d6d2cb] dark:border-[#4A4A4A] safe-area-inset-bottom transition-colors duration-300">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex flex-col items-center justify-center h-full space-y-1',
                  isActive ? 'text-[#2B2B2B]' : 'text-[#5f5f5f] dark:text-[#9a9a9a]'
                )}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

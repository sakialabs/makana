/**
 * Sidebar Component
 * 
 * Navigation sidebar for authenticated users on large screens.
 * Calm, minimal design with clear navigation.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import {
  Home,
  CheckCircle,
  Play,
  Calendar,
  Settings,
  Minimize2,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/app', label: 'Home', icon: Home },
    { href: '/app/daily-check', label: 'Daily Check', icon: CheckCircle },
    { href: '/app/session', label: 'Session', icon: Play },
    { href: '/app/weekly-check', label: 'Weekly Check', icon: Calendar },
    { href: '/app/reduced-mode', label: 'Reduced Mode', icon: Minimize2 },
    { href: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#ece9e4] dark:bg-[#1A1A1A] border-r border-[#d6d2cb] dark:border-[#4A4A4A] transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-[#d6d2cb] dark:border-[#4A4A4A]">
        <Link href="/app">
          <Logo variant="static" size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-md transition-colors',
                  isActive
                    ? 'bg-[#2B2B2B] text-white'
                    : 'text-[#5f5f5f] dark:text-[#9a9a9a] hover:bg-[#d6d2cb] dark:hover:bg-[#2a2a2a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea]'
                )}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Mini Footer */}
      <div className="px-6 py-4 border-t border-[#d6d2cb] dark:border-[#4A4A4A]">
        <p className="text-xs text-[#5f5f5f] dark:text-[#9a9a9a]">
          Practice with intention
        </p>
      </div>
    </aside>
  );
}

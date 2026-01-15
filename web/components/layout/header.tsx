/**
 * Header Component
 * 
 * Public header with navigation for unauthenticated users.
 * Calm, restrained design with clear navigation.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/clutch', label: 'Meet Clutch' },
    { href: '/contact', label: 'Contact' },
  ];

  const triggerShake = () => {
    setShakeKey(prev => prev + 1);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f7f5f2]/95 dark:bg-[#121212]/95 backdrop-blur-sm border-b border-[#d6d2cb] dark:border-[#4A4A4A] transition-colors duration-300">
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              key={shakeKey}
              onClick={triggerShake}
              whileHover={{ 
                rotate: [0, -4, 4, -3, 3, -2, 2, 0],
                transition: { duration: 0.6, ease: "easeInOut" }
              }}
              animate={{ 
                rotate: [0, -4, 4, -3, 3, -2, 2, 0]
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="cursor-pointer"
            >
              <Logo variant="static" size="sm" />
            </motion.div>
            <span 
              className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] group-hover:text-[#2B2B2B] dark:group-hover:text-[#ffffff] transition-colors cursor-pointer"
              onClick={triggerShake}
            >
              Makana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-[#5f5f5f] hover:text-[#1f1f1f] transition-colors rounded-lg hover:bg-[#ece9e4] font-medium dark:text-[#9a9a9a] dark:hover:text-[#eaeaea] dark:hover:bg-[#1A1A1A]"
              >
                {item.label}
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/auth?mode=signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm">Begin Practice</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] rounded-lg hover:bg-[#ece9e4] dark:hover:bg-[#1A1A1A] transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pb-6 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-[#5f5f5f] hover:text-[#1f1f1f] transition-colors rounded-lg hover:bg-[#ece9e4] dark:text-[#9a9a9a] dark:hover:text-[#eaeaea] dark:hover:bg-[#1A1A1A]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <div className="flex justify-center pb-2">
                <ThemeToggle />
              </div>
              <Link href="/auth?mode=signin" className="block">
                <Button variant="ghost" size="sm" fullWidth>
                  Sign In
                </Button>
              </Link>
              <Link href="/auth?mode=signup" className="block">
                <Button size="sm" fullWidth>
                  Begin Practice
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </Container>
    </header>
  );
}

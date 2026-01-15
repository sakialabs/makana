/**
 * Footer Component
 * 
 * Public footer with links and information.
 * Calm, minimal design.
 */

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: '/about', label: 'About' },
      { href: '/clutch', label: 'Meet Clutch' },
      { href: '/contact', label: 'Contact' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  };

  return (
    <footer className="border-t border-[#d6d2cb] dark:border-[#4A4A4A] bg-[#ece9e4] dark:bg-[#1A1A1A] mt-auto transition-colors duration-300">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Logo variant="static" size="sm" />
                <span className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                  Makana
                </span>
              </div>
              <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                A practice medium for developing intentional strength.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-sm font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Product
              </h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-medium text-[#1f1f1f] dark:text-[#eaeaea] mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#d6d2cb] dark:border-[#4A4A4A]">
            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] text-center">
              © {currentYear} Makana. Built with care for intentional practice.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

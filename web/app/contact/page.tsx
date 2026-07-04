/**
 * Contact Page
 * 
 * Simple contact information page.
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <PageTransition className="flex-1 py-20 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300" role="main" aria-labelledby="contact-heading">
        <Container size="sm">
          <div className="space-y-12">
            <header className="text-center space-y-4">
              <h1 id="contact-heading" className="text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                Contact
              </h1>
              <p className="text-xl text-[#5f5f5f] dark:text-[#9a9a9a]">
                We&apos;re here to help.
              </p>
            </header>

            <Card as="section" className="text-center p-12" ariaLabel="Contact information">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                Open an Issue
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] mb-6 text-lg">
                For questions, feedback, or support while the inbox is being set up
              </p>
              <a
                href="https://github.com/sakialabs/makana/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] focus:ring-offset-2 rounded"
                aria-label="Open Makana GitHub issues in a new tab"
              >
                Makana GitHub Issues
              </a>
            </Card>

            <div className="text-center text-[#5f5f5f] dark:text-[#9a9a9a]">
              <p>We review new issues as part of the project workflow.</p>
            </div>
          </div>
        </Container>
      </PageTransition>

      <Footer />
    </div>
  );
}

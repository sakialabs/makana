/**
 * Contact Page
 * 
 * Simple contact information page.
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main className="flex-1 py-20 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300" role="main" aria-labelledby="contact-heading">
        <Container size="sm">
          <div className="space-y-12">
            <header className="text-center space-y-4">
              <h1 id="contact-heading" className="text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                Contact
              </h1>
              <p className="text-xl text-[#5f5f5f] dark:text-[#9a9a9a]">
                We're here to help.
              </p>
            </header>

            <Card as="section" className="text-center p-12" ariaLabel="Contact information">
              <div className="flex justify-center mb-6" aria-hidden="true">
                <div className="p-4 bg-[#2B2B2B] rounded-full">
                  <Mail className="text-white" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                Email Us
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] mb-6 text-lg">
                For questions, feedback, or support
              </p>
              <a
                href="mailto:hello@makana.app"
                className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#2B2B2B] focus:ring-offset-2 rounded"
                aria-label="Send email to hello@makana.app"
              >
                hello@makana.app
              </a>
            </Card>

            <div className="text-center text-[#5f5f5f] dark:text-[#9a9a9a]">
              <p>We typically respond within 24-48 hours.</p>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

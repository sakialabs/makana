/**
 * Terms of Service Page
 * 
 * Terms of service for Makana.
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main className="flex-1 py-16 bg-[#f7f5f2] dark:bg-[#121212]">
        <Container size="md">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-6">
              Terms of Service
            </h1>

            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] mb-8">
              Last updated: January 13, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Agreement
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                By using Makana, you agree to these terms. If you don't agree,
                please don't use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Service Description
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana is a practice medium for developing intentional strength.
                It helps you start, stop, and shape life with care and
                alignment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Your Account
              </h2>
              <ul className="list-disc list-inside text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2">
                <li>You're responsible for your account security</li>
                <li>You must provide accurate information</li>
                <li>You must be 13 or older to use Makana</li>
                <li>One account per person</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Acceptable Use
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2">
                <li>Violate laws or regulations</li>
                <li>Abuse or harm others</li>
                <li>Attempt to access others' accounts</li>
                <li>Interfere with the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Service Availability
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                We strive for reliable service but can't guarantee 100% uptime.
                We may modify or discontinue features with notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Limitation of Liability
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana is provided "as is." We're not liable for indirect
                damages. Our liability is limited to the amount you paid us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Changes to Terms
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                We may update these terms. We'll notify you of significant
                changes. Continued use means you accept the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Contact
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Questions about these terms? Email us at{' '}
                <a
                  href="mailto:legal@makana.app"
                  className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline"
                >
                  legal@makana.app
                </a>
              </p>
            </section>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

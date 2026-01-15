/**
 * Privacy Policy Page
 * 
 * Privacy policy following Makana's privacy-first principles.
 */

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main className="flex-1 py-16 bg-[#f7f5f2] dark:bg-[#121212]">
        <Container size="md">
          <article className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-6">
              Privacy Policy
            </h1>

            <p className="text-sm text-[#5f5f5f] dark:text-[#9a9a9a] mb-8">
              Last updated: January 13, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Our Commitment
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana is built with privacy as a core principle. We collect
                minimal data, never sell your information, and give you control
                over your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Data We Collect
              </h2>
              <ul className="list-disc list-inside text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2">
                <li>
                  <strong>Account Information:</strong> Email address for
                  authentication
                </li>
                <li>
                  <strong>Practice Data:</strong> Daily checks, sessions, weekly
                  checks (stored securely)
                </li>
                <li>
                  <strong>Usage Data:</strong> Basic analytics to improve the
                  service
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                What We Don't Do
              </h2>
              <ul className="list-disc list-inside text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2">
                <li>We never sell your data</li>
                <li>We never share your data with third parties for marketing</li>
                <li>We never track you across other websites</li>
                <li>We never use your data to train AI models without consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Data Security
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Your data is encrypted in transit and at rest. We use
                industry-standard security practices and Row-Level Security to
                ensure your data is protected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Your Rights
              </h2>
              <p className="text-[#5f5f5f] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[#5f5f5f] dark:text-[#9a9a9a] space-y-2">
                <li>Access your data</li>
                <li>Export your data</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of optional features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                Contact
              </h2>
              <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                For privacy questions or requests, email us at{' '}
                <a
                  href="mailto:privacy@makana.app"
                  className="text-[#2B2B2B] dark:text-[#eaeaea] hover:underline"
                >
                  privacy@makana.app
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

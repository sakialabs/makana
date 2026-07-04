/**
 * Data Rights Page
 *
 * Plain-language privacy rights and request guidance.
 */

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { PageTransition } from '@/components/ui/page-transition';

const rights = [
  {
    title: 'Access your data',
    body: 'You can ask what account and practice data Makana has associated with your account.',
  },
  {
    title: 'Export your data',
    body: 'You can ask for a usable copy of your practice history when export tooling is not available in product.',
  },
  {
    title: 'Delete your account',
    body: 'You can request account deletion and removal of associated practice data.',
  },
  {
    title: 'Opt out of optional features',
    body: 'You can choose not to use optional features that require extra data or intelligence.',
  },
];

export default function DataRightsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f2] text-[#1f1f1f] transition-colors duration-300 dark:bg-[#121212] dark:text-[#eaeaea]">
      <Header />

      <PageTransition
        className="flex-1 bg-[#f7f5f2] py-16 transition-colors duration-300 dark:bg-[#121212] md:py-20"
        role="main"
        aria-labelledby="data-rights-heading"
      >
        <Container size="md">
          <article className="space-y-12">
            <header className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                Privacy and control
              </p>
              <h1 id="data-rights-heading" className="mb-6 text-4xl font-semibold leading-tight text-[#1f1f1f] dark:text-[#eaeaea] md:text-5xl">
                Data rights
              </h1>
              <p className="text-xl leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Makana is built to collect only what it needs, keep practice data
                under user control, and make privacy requests straightforward.
              </p>
            </header>

            <section aria-labelledby="rights-heading">
              <h2 id="rights-heading" className="mb-6 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                What you can request
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {rights.map((right) => (
                  <div
                    key={right.title}
                    className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-6 dark:border-[#2B2B2B] dark:bg-[#1A1A1A]"
                  >
                    <h3 className="mb-3 text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                      {right.title}
                    </h3>
                    <p className="m-0 leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                      {right.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="request-heading" className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-8 dark:border-[#2B2B2B] dark:bg-[#1A1A1A]">
              <h2 id="request-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                Make a request
              </h2>
              <p className="leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                For non-sensitive privacy or data requests, open a GitHub issue
                while the dedicated privacy inbox is being set up.{' '}
                <a
                  href="https://github.com/sakialabs/makana/issues/new?title=Data%20rights%20request%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2B2B2B] hover:underline dark:text-[#eaeaea]"
                  aria-label="Open a Makana data rights issue in a new tab"
                >
                  Open a data rights issue
                </a>
                . Do not include private account details in public issues.
                Describe the request type, and we will coordinate a safer path
                before reviewing account-specific information.
              </p>
              <p className="mt-4 leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                For the full policy context, read the{' '}
                <Link href="/privacy" className="font-medium text-[#2B2B2B] hover:underline dark:text-[#eaeaea]">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </article>
        </Container>
      </PageTransition>

      <Footer />
    </div>
  );
}

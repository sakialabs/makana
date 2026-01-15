/**
 * Home Page
 * 
 * Landing page for Makana - calm, intentional, invitational.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section aria-labelledby="hero-heading" className="py-20 md:py-32 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
          <Container size="md">
            <div className="text-center space-y-6">
              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] leading-tight"
              >
                A practice medium for developing intentional strength
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-[#5f5f5f] dark:text-[#9a9a9a] max-w-2xl mx-auto leading-relaxed"
              >
                Makana helps you start, stop, and shape life with care,
                alignment, and respect for energy.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                role="group"
                aria-label="Primary actions"
              >
                <Link href="/auth?mode=signup">
                  <Button size="lg" aria-label="Begin your practice with Makana">Begin Practice</Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="lg" aria-label="Learn more about Makana">
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section aria-labelledby="features-heading" className="py-24 bg-[#ece9e4] dark:bg-[#1A1A1A] transition-colors duration-300">
          <Container>
            <h2 id="features-heading" className="sr-only">Core Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
              <Card padding="lg" hover role="listitem">
                <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                  Start when it's hard
                </h3>
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                  Begin meaningful work without resistance. Bad starts count.
                </p>
              </Card>

              <Card padding="lg" hover role="listitem">
                <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                  Stop cleanly
                </h3>
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                  Save the next tiny step. Stop without guilt or crashing.
                </p>
              </Card>

              <Card padding="lg" hover role="listitem">
                <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
                  Protect energy
                </h3>
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                  Adjust force instead of forcing consistency. Continuity over
                  intensity.
                </p>
              </Card>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section aria-labelledby="cta-heading" className="py-24 bg-[#f7f5f2] dark:bg-[#121212]">
          <Container size="md">
            <div className="text-center space-y-6">
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                Ready to begin?
              </h2>
              <p className="text-xl text-[#5f5f5f] dark:text-[#9a9a9a]">
                Start practicing with intention.
              </p>
              <div className="pt-2">
                <Link href="/auth?mode=signup">
                  <Button size="lg" aria-label="Begin your practice with Makana">Begin Practice</Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}

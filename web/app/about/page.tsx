/**
 * About Page
 * 
 * Explains Makana's vision, mission, and philosophy.
 * Content from vision.md and manifesto.md.
 */

'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 py-20 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300" 
        role="main" 
        aria-labelledby="about-heading"
      >
        <Container size="md">
          <article className="prose prose-lg max-w-none space-y-16">
            {/* Vision */}
            <section aria-labelledby="vision-heading">
              <h1 id="about-heading" className="text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-8">
                Vision & Mission
              </h1>

              <p className="text-2xl text-[#5f5f5f] dark:text-[#9a9a9a] mb-12 leading-relaxed">
                Makana is a <strong>practice medium</strong> for developing
                intentional strength.
              </p>

              <h2 id="vision-heading" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-16 mb-6">
                Vision
              </h2>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Makana exists to help people <strong>develop mastery in living</strong>.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Not mastery as performance.<br />
                Not mastery as productivity.<br />
                But mastery as the ability to start, stop, adjust, and continue
                with care.
              </p>

              <div className="bg-[#ece9e4] dark:bg-[#1c1c1c] p-8 rounded-lg my-10">
                <p className="text-lg text-[#1f1f1f] dark:text-[#eaeaea] leading-relaxed">
                  The long-term vision is a world where people trust their own
                  capacity and limits, tools adapt to human energy instead of
                  demanding consistency, strength is measured by alignment not
                  endurance, and living well is treated as a practice, not a
                  grind.
                </p>
              </div>

              <h2 id="mission-heading" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-16 mb-6">
                Mission
              </h2>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Makana&#39;s mission is to provide a calm, reliable practice medium
                that helps people:
              </p>
              <ul className="list-disc list-inside text-lg text-[#5f5f5f] dark:text-[#9a9a9a] space-y-3 mb-10">
                <li>Begin meaningful work without resistance</li>
                <li>Stop safely without guilt or collapse</li>
                <li>Protect energy over time</li>
                <li>Adapt effort to real-life conditions</li>
                <li>Continue practicing even during low-capacity periods</li>
              </ul>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana does not aim to optimize people.<br />
                It aims to <strong>support continuity</strong>.
              </p>
            </section>

            {/* Core Insight */}
            <section aria-labelledby="insight-heading">
              <h2 id="insight-heading" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-6">
                Core Insight
              </h2>
              <blockquote className="border-l-4 border-[#2B2B2B] pl-8 py-4 my-8">
                <p className="text-2xl text-[#1f1f1f] dark:text-[#eaeaea] italic leading-relaxed">
                  Strength that ignores alignment eventually becomes damage.
                </p>
              </blockquote>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana is built on the idea that starting matters, stopping
                matters just as much, adjusting effort is a skill, and
                continuity beats intensity. These are trainable abilities, not
                personality traits.
              </p>
            </section>

            {/* Manifesto */}
            <section aria-labelledby="manifesto-heading">
              <h2 id="manifesto-heading" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-8">
                The Makana Manifesto
              </h2>

              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-10">
                Makana exists because most tools demand too much from people.
                They assume endless energy. They punish inconsistency. They
                confuse pressure with progress.
              </p>
              <p className="text-xl text-[#1f1f1f] dark:text-[#eaeaea] font-medium mb-10">We reject that.</p>

              <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-12 mb-6">
                We believe
              </h3>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Living well is not about doing more. It is about doing what
                fits.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Strength is not constant output. Strength is knowing when to
                begin, when to stop, and when to adjust.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Continuity matters more than intensity. Alignment matters more
                than speed.
              </p>

              <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-12 mb-6">
                We reject grind culture
              </h3>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                We do not believe in streaks that punish rest, systems that
                shame inconsistency, tools that confuse exhaustion with
                discipline, or optimization that ignores the body and mind.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Burnout is not failure. It is a signal that force replaced
                alignment.
              </p>

              <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-12 mb-6">
                We treat life as practice
              </h3>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Life is not a performance. It is a practice.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Practice includes imperfect starts, early stops, quiet days,
                low-capacity weeks, and returning again without guilt. Progress
                is not linear. Practice does not require applause.
              </p>

              <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-12 mb-6">
                We respect energy
              </h3>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mb-6">
                Energy is finite. Attention is precious.
              </p>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                Makana reduces noise, limits force, allows silence, and
                disengages early to prevent damage. If a system costs more
                energy than it returns, it is wrong.
              </p>

              <h3 className="text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mt-12 mb-6">
                We do not fix people
              </h3>
              <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                People are not broken. Makana does not correct behavior or
                impose discipline. It adjusts conditions so people can act with
                clarity. The user is capable. The system exists to support them,
                not replace them.
              </p>
            </section>

            {/* Closing */}
            <section>
              <div className="bg-[#ece9e4] dark:bg-[#1c1c1c] p-10 rounded-lg">
                <p className="text-xl text-[#1f1f1f] dark:text-[#eaeaea] leading-relaxed">
                  Makana exists to hold space for practice. Quietly.
                  Consistently. Over time. That is enough.
                </p>
              </div>
            </section>
          </article>
        </Container>
      </motion.main>

      <Footer />
    </div>
  );
}

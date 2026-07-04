/**
 * About Page
 *
 * Explains Makana's refreshed vision, mission, and product model.
 */

'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { PageTransition } from '@/components/ui/page-transition';

const conceptGroups = [
  {
    title: 'Direction',
    items: ['Setups', 'Missions', 'Quests'],
  },
  {
    title: 'Practice',
    items: ['Forms', 'Reflection', 'Recovery'],
  },
  {
    title: 'Contribution',
    items: ['Artifacts', 'Risk Checks', 'Dividends'],
  },
];

const missionExamples = [
  'Learn a difficult concept and turn it into a map.',
  'Build a tiny prototype before scaling the idea.',
  'Review risks before a serious rollout.',
  'Create a public note that helps someone else start.',
];

const masteryCards = [
  'Energy Mastery',
  'Focus Mastery',
  'Strategy Mastery',
  'Learning Mastery',
  'Build Mastery',
  'Risk Mastery',
  'Contribution Mastery',
  'Recovery Mastery',
];

const responsibleChecks = [
  'Benefit',
  'Harm',
  'Stakeholder',
  'Evidence',
  'Scope',
  'Regulation',
  'Dividend',
  'Review',
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f2] text-[#1f1f1f] transition-colors duration-300 dark:bg-[#121212] dark:text-[#eaeaea]">
      <Header />

      <PageTransition
        className="flex-1 bg-[#f7f5f2] py-16 transition-colors duration-300 dark:bg-[#121212] md:py-20"
        role="main"
        aria-labelledby="about-heading"
      >
        <Container size="md">
          <article className="space-y-16">
            <section aria-labelledby="about-heading" className="text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                Vision and mission
              </p>
              <h1 id="about-heading" className="mb-6 text-5xl font-semibold leading-tight text-[#1f1f1f] dark:text-[#eaeaea] md:text-6xl">
                Makana helps ambition become useful practice
              </h1>
              <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Makana is an adaptive practice system for responsible
                breakthroughs. It helps people move with clarity, build with
                care, recover cleanly, and turn learning into shared progress.
              </p>
            </section>

            <section aria-labelledby="belief-heading">
              <div className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-8 dark:border-[#2B2B2B] dark:bg-[#1A1A1A] md:p-10">
                <h2 id="belief-heading" className="mb-5 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                  The belief
                </h2>
                <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                  Humanity can figure things out when technology expands agency,
                  protects judgment, and helps more people participate. The
                  future needs people who can learn across fields, think clearly,
                  build responsibly, recover well, and share what they discover.
                </p>
              </div>
            </section>

            <section aria-labelledby="system-heading">
              <div className="mb-8">
                <h2 id="system-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                  The system
                </h2>
                <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                  Makana keeps the old promise of calm, low-friction practice,
                  then extends it into missions, quests, artifacts, reflection,
                  mastery, and responsible checks.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {conceptGroups.map((group) => (
                  <Card key={group.title} as="article" padding="lg" hover>
                    <h3 className="mb-4 text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                      {group.title}
                    </h3>
                    <ul className="space-y-3 text-[#5f5f5f] dark:text-[#9a9a9a]">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>

            <section aria-labelledby="mastery-heading" className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <h2 id="mastery-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                  Mastery without pressure
                </h2>
                <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                  The mastery model draws from martial arts and chess: forms,
                  drills, recovery, position evaluation, tempo, trade-offs, and
                  endgame review. It rewards judgment, not raw volume.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {masteryCards.map((domain) => (
                  <div
                    key={domain}
                    className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] px-4 py-3 text-sm font-medium text-[#1f1f1f] dark:border-[#2B2B2B] dark:bg-[#1A1A1A] dark:text-[#eaeaea]"
                  >
                    {domain}
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="responsibility-heading">
              <div className="grid gap-8 rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-8 dark:border-[#2B2B2B] dark:bg-[#1A1A1A] md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 id="responsibility-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    Responsibility is bigger than productivity
                  </h2>
                  <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                    Some missions touch science, medicine, climate, education,
                    infrastructure, policy, or public life. Makana helps people
                    accelerate wisely through checks before scaling.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {responsibleChecks.map((check) => (
                    <div
                      key={check}
                      className="rounded-lg border border-[#d6d2cb] bg-[#f7f5f2] px-4 py-3 text-sm font-medium text-[#1f1f1f] dark:border-[#3B3B3B] dark:bg-[#121212] dark:text-[#eaeaea]"
                    >
                      {check} Check
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section aria-labelledby="mission-heading">
              <div className="mb-8">
                <h2 id="mission-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                  What a mission can become
                </h2>
                <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                  A mission can start private and still leave a dividend: a map,
                  tool, explainer, checklist, learning path, prototype, or better
                  question.
                </p>
              </div>

              <div className="space-y-3">
                {missionExamples.map((example) => (
                  <div
                    key={example}
                    className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-4 dark:border-[#2B2B2B] dark:bg-[#1A1A1A]"
                  >
                    <p className="m-0 text-[#5f5f5f] dark:text-[#9a9a9a]">{example}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-8 text-center shadow-sm dark:border-[#2B2B2B] dark:bg-[#1A1A1A] md:p-10">
                <p className="mx-auto max-w-3xl text-xl leading-relaxed text-[#1f1f1f] dark:text-[#eaeaea]">
                  Makana helps people move faster with care, build with purpose,
                  recover without losing the thread, and contribute work that
                  serves life, society, and the planet.
                </p>
              </div>
            </section>
          </article>
        </Container>
      </PageTransition>

      <Footer />
    </div>
  );
}

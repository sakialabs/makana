/**
 * Home Page
 *
 * Landing page for Makana's refreshed product direction.
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { PageTransition } from '@/components/ui/page-transition';

const productPillars = [
  {
    title: 'Adaptive practice',
    body: 'Makana adjusts the next move around energy, focus, setup, friction, momentum, and recovery needs.',
  },
  {
    title: 'Meaningful artifacts',
    body: 'Practice becomes notes, diagrams, commits, prototypes, reflections, maps, and reusable work.',
  },
  {
    title: 'Responsible breakthroughs',
    body: 'Serious missions slow down for benefit, harm, evidence, scope, stakeholder, and dividend checks.',
  },
];

const corePrimitives = [
  { title: 'Setups', body: 'The life or work mode shaping the day.' },
  { title: 'Missions', body: 'Meaningful containers for goals and direction.' },
  { title: 'Quests', body: 'Small actionable units of progress.' },
  { title: 'Practice Forms', body: 'Repeatable patterns that build mastery.' },
  { title: 'Artifacts', body: 'Proof that practice became something useful.' },
  { title: 'Reflection', body: 'A way to turn experience into usable intelligence.' },
];

const masteryDomains = [
  'Energy',
  'Focus',
  'Strategy',
  'Learning',
  'Build',
  'Risk',
  'Contribution',
  'Recovery',
];

const missionSteps = [
  {
    title: 'Read the field',
    body: 'Energy, stakes, friction, and available time.',
  },
  {
    title: 'Name the quest',
    body: 'Choose the smallest move that still matters.',
  },
  {
    title: 'Run the form',
    body: 'Practice inside one clean constraint.',
  },
  {
    title: 'Leave an artifact',
    body: 'Save the note, map, commit, or prototype.',
  },
  {
    title: 'Review the signal',
    body: 'Separate useful momentum from noise.',
  },
  {
    title: 'Set the next move',
    body: 'Continue, recover, or change the scope.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f2] text-[#1f1f1f] transition-colors duration-300 dark:bg-[#121212] dark:text-[#eaeaea]">
      <Header />

      <PageTransition
        id="main-content"
        className="flex-1"
      >
        <section aria-labelledby="hero-heading" className="bg-[#f7f5f2] py-16 transition-colors duration-300 dark:bg-[#121212] md:py-24">
          <Container size="lg">
            <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="min-w-0 space-y-7">
                <div className="flex items-center gap-3">
                  <Logo variant="static" size="sm" />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                    Makana
                  </span>
                </div>

                <h1
                  id="hero-heading"
                  className="max-w-4xl text-balance text-4xl font-semibold leading-tight text-[#1f1f1f] dark:text-[#eaeaea] md:text-6xl"
                >
                  Adaptive practice for responsible breakthroughs
                </h1>

                <p className="max-w-3xl text-pretty text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a] md:text-xl">
                  Makana helps people turn ambition into practice, practice into
                  artifacts, and artifacts into shared progress.
                </p>

                <div
                  className="flex flex-col gap-4 sm:flex-row"
                  role="group"
                  aria-label="Primary actions"
                >
                  <Link href="/auth?mode=signup">
                    <Button size="lg" aria-label="Begin your practice with Makana">
                      Begin Practice
                      <ArrowRight aria-hidden="true" className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="secondary" size="lg" aria-label="Learn more about Makana">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <aside
                className="w-full min-w-0 overflow-hidden rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-5 shadow-sm dark:border-[#2B2B2B] dark:bg-[#1A1A1A] md:p-6"
                aria-label="Makana mission loop"
              >
                <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                      Mission loop
                    </p>
                    <h2 className="mt-2 text-balance text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] sm:text-2xl">
                      Give the mission a useful shape
                    </h2>
                  </div>
                </div>

                <ol className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  {missionSteps.map((step, index) => (
                    <li
                      key={step.title}
                      className="min-w-0 rounded-lg border border-[#d6d2cb] bg-[#f7f5f2] p-3 transition-colors hover:border-[#2B2B2B] dark:border-[#3B3B3B] dark:bg-[#121212] dark:hover:border-[#6A6A6A] md:p-4"
                    >
                      <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="block break-words font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                        {step.title}
                      </span>
                      <span className="mt-1 block text-pretty text-sm leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                        {step.body}
                      </span>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </Container>
        </section>

        <section aria-labelledby="pillars-heading" className="bg-[#ece9e4] py-20 transition-colors duration-300 dark:bg-[#1A1A1A]">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="pillars-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                A system for ambitious work that protects judgment
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Makana is not a task manager. It is a structure for learning,
                building, recovering, checking risk, and leaving useful work behind.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {productPillars.map((pillar) => (
                <Card key={pillar.title} as="article" padding="lg" hover className="dark:bg-[#121212]">
                  <h3 className="mb-3 text-2xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    {pillar.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">{pillar.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby="primitives-heading" className="bg-[#f7f5f2] py-20 transition-colors duration-300 dark:bg-[#121212]">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="primitives-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                The Makana primitives
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                The refresh expands the product from sessions alone into a
                practice system with durable direction and useful outputs.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {corePrimitives.map((primitive) => (
                <Card key={primitive.title} as="article" padding="lg" hover>
                  <h3 className="mb-3 text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    {primitive.title}
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">{primitive.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby="mastery-heading" className="bg-[#ece9e4] py-20 transition-colors duration-300 dark:bg-[#1A1A1A]">
          <Container size="md">
            <div className="text-center">
              <h2 id="mastery-heading" className="mb-5 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                Mastery without grind
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Makana borrows from martial arts and chess: forms, drills,
                strategy, trade-offs, endgames, and recovery. Progress means
                better judgment, not more volume.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {masteryDomains.map((domain) => (
                <div
                  key={domain}
                  className="rounded-lg border border-[#d6d2cb] bg-[#f7f5f2] px-4 py-3 text-center text-sm font-medium text-[#1f1f1f] dark:border-[#3B3B3B] dark:bg-[#121212] dark:text-[#eaeaea]"
                >
                  {domain}
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby="dividend-heading" className="bg-[#f7f5f2] py-20 transition-colors duration-300 dark:bg-[#121212]">
          <Container size="md">
            <div className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] p-8 text-center shadow-sm dark:border-[#2B2B2B] dark:bg-[#1A1A1A] md:p-10">
              <h2 id="dividend-heading" className="mb-5 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                Shared progress is part of the practice
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                A mission can create a dividend: a public note, research map,
                open-source tool, explainer, diagram, learning path, safety
                checklist, community playbook, or better question.
              </p>
              <div className="mt-8">
                <Link href="/auth?mode=signup">
                  <Button size="lg" aria-label="Begin your practice with Makana">
                    Begin Practice
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}

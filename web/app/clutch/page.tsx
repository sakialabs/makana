/**
 * Clutch Page
 *
 * Introduces Clutch as Makana's personal adaptive practice companion.
 */

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClutchLogo } from '@/components/ui/logo';
import { PageTransition } from '@/components/ui/page-transition';

type InsightItem = {
  title: string;
  body: string;
};

type FitItem = {
  name: string;
  cue: string;
};

const learnedSignals: InsightItem[] = [
  {
    title: 'Setup',
    body: 'The life or work mode shaping today.',
  },
  {
    title: 'Goals',
    body: 'The mission that gives effort direction.',
  },
  {
    title: 'Friction',
    body: 'Avoidance, over-scoping, stuck points, and unclear starts.',
  },
  {
    title: 'Pace',
    body: 'How much force fits without breaking continuity.',
  },
  {
    title: 'Recovery',
    body: 'The conditions that make a return possible.',
  },
  {
    title: 'Practice',
    body: 'The forms that build mastery over time.',
  },
];

const guidance: InsightItem[] = [
  {
    title: 'Mode-aware guidance',
    body: 'Clutch shifts between ignition, building, reflection, recovery, and review.',
  },
  {
    title: 'Personal quests',
    body: 'The next move gets smaller, clearer, or more strategic based on the state.',
  },
  {
    title: 'Burnout-safe pacing',
    body: 'Low energy lowers friction. Repeated strain triggers smaller scopes.',
  },
  {
    title: 'Practice forms',
    body: 'Clean starts, clean stops, recovery returns, and deep practice become trainable.',
  },
  {
    title: 'Risk checks',
    body: 'Serious missions pause for benefits, harms, evidence, scope, and stakeholders.',
  },
  {
    title: 'Artifact reminders',
    body: 'Useful work becomes notes, diagrams, commits, prototypes, maps, or playbooks.',
  },
];

const fits: FitItem[] = [
  {
    name: 'Builder Fit',
    cue: 'Turn ideas into one useful artifact.',
  },
  {
    name: 'Study Fit',
    cue: 'Learn one concept. Save the map.',
  },
  {
    name: 'Recovery Fit',
    cue: 'Lower force. Preserve the thread.',
  },
  {
    name: 'Scout Fit',
    cue: 'Explore before committing.',
  },
  {
    name: 'Deep Practice Fit',
    cue: 'Hold focus. Review the form.',
  },
  {
    name: 'Guardrail Fit',
    cue: 'Check risk before rollout.',
  },
  {
    name: 'Dividend Fit',
    cue: 'Leave something reusable behind.',
  },
  {
    name: 'Regulation Fit',
    cue: 'Clarify constraints before the work scales.',
  },
];

const practiceLoop = [
  'Assess state',
  'Recommend practice',
  'Execute quest',
  'Capture feedback',
  'Update mastery',
  'Adapt next move',
];

const clutchLines = [
  'One clean move.',
  'Shrink the task.',
  'Low energy. Lower friction.',
  'Scout before building.',
  'Risk check before rollout.',
  'Good stop. Momentum saved.',
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

export default function ClutchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f2] text-[#1f1f1f] transition-colors duration-300 dark:bg-[#121212] dark:text-[#eaeaea]">
      <Header />

      <PageTransition
        id="main-content"
        className="flex-1"
        role="main"
        aria-labelledby="clutch-heading"
      >
        <section className="bg-[#f7f5f2] pb-16 pt-16 transition-colors duration-300 dark:bg-[#121212] md:pb-20 md:pt-20">
          <Container size="md">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              <div
                className="mb-8 flex h-36 w-36 items-center justify-center rounded-full border border-[#d6d2cb] bg-[#ece9e4] p-4 shadow-sm transition-colors duration-300 dark:border-[#2B2B2B] dark:bg-[#1A1A1A] sm:h-40 sm:w-40"
                aria-label="Clutch logo"
              >
                <ClutchLogo variant="animated" size="xl" />
              </div>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5f5f5f] dark:text-[#9a9a9a]">
                Personal practice companion
              </p>

              <h1
                id="clutch-heading"
                className="mb-6 text-5xl font-semibold leading-tight text-[#1f1f1f] dark:text-[#eaeaea] md:text-6xl"
              >
                Clutch
              </h1>

              <p className="max-w-3xl text-xl leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a] md:text-2xl">
                Every user enters Makana with their own Clutch. It learns your
                setup, goals, friction patterns, preferred pace, and recovery
                needs, then helps choose the next useful move.
              </p>

              <div
                className="mt-8 flex flex-col gap-3 sm:flex-row"
                role="group"
                aria-label="Clutch actions"
              >
                <Link href="/auth?mode=signup">
                  <Button size="lg" ariaLabel="Begin practice with Clutch">
                    Begin Practice
                  </Button>
                </Link>
                <Link href="#clutch-fits">
                  <Button variant="secondary" size="lg" ariaLabel="View Clutch fits">
                    View Fits
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-[#d6d2cb] bg-[#ece9e4] py-12 transition-colors duration-300 dark:border-[#2B2B2B] dark:bg-[#1A1A1A]" aria-label="Clutch voice examples">
          <Container>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {clutchLines.map((line) => (
                <div
                  key={line}
                  className="rounded-lg border border-[#d6d2cb] bg-[#f7f5f2] px-4 py-3 text-center text-sm font-medium text-[#1f1f1f] dark:border-[#3B3B3B] dark:bg-[#121212] dark:text-[#eaeaea]"
                >
                  {line}
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#f7f5f2] py-20 transition-colors duration-300 dark:bg-[#121212]" aria-labelledby="learns-heading">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="learns-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                What Clutch learns
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Onboarding stays light. Over time, practice gives Clutch better
                signal about what helps you start, stop, recover, and continue.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {learnedSignals.map((item) => (
                <Card key={item.title} as="article" padding="lg" hover>
                  <h3 className="mb-3 text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    {item.title}
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">{item.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#ece9e4] py-20 transition-colors duration-300 dark:bg-[#1A1A1A]" aria-labelledby="guidance-heading">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="guidance-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                How Clutch adapts
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                The companion is useful because it changes the practice, not
                because it talks more.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {guidance.map((item) => (
                <Card key={item.title} as="article" padding="lg" hover className="dark:bg-[#121212]">
                  <h3 className="mb-3 text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    {item.title}
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a]">{item.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section id="clutch-fits" className="bg-[#f7f5f2] py-20 transition-colors duration-300 dark:bg-[#121212]" aria-labelledby="fits-heading">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="fits-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                Clutch fits
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Fits give Clutch lightweight visual personality tied to a setup
                or mode. They change the feel without turning practice into
                identity.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {fits.map((fit) => (
                <Card key={fit.name} as="article" padding="lg" hover>
                  <h3 className="mb-3 text-lg font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                    {fit.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">{fit.cue}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#ece9e4] py-20 transition-colors duration-300 dark:bg-[#1A1A1A]" aria-labelledby="loop-heading">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 id="loop-heading" className="mb-4 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                Rules first
              </h2>
              <p className="text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                Clutch is a deterministic-first policy engine. Optional AI can
                help with language later. The core recommendation stays
                explainable.
              </p>
            </div>

            <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-6" aria-label="Adaptive practice loop">
              {practiceLoop.map((step, index) => (
                <li key={step} className="flex min-h-32 flex-col justify-between rounded-lg border border-[#d6d2cb] bg-[#f7f5f2] p-5 dark:border-[#3B3B3B] dark:bg-[#121212]">
                  <span className="text-sm font-semibold text-[#5f5f5f] dark:text-[#9a9a9a]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base font-medium text-[#1f1f1f] dark:text-[#eaeaea]">{step}</span>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="bg-[#f7f5f2] py-20 transition-colors duration-300 dark:bg-[#121212]" aria-labelledby="guardrails-heading">
          <Container size="md">
            <div className="text-center">
              <h2 id="guardrails-heading" className="mb-5 text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] md:text-4xl">
                Serious missions get guardrails
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#5f5f5f] dark:text-[#9a9a9a]">
                When a mission touches other people, systems, policy, medicine,
                climate, infrastructure, or public life, Clutch shifts into
                careful review.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {responsibleChecks.map((check) => (
                <div
                  key={check}
                  className="rounded-lg border border-[#d6d2cb] bg-[#ece9e4] px-4 py-3 text-center text-sm font-medium text-[#1f1f1f] dark:border-[#2B2B2B] dark:bg-[#1A1A1A] dark:text-[#eaeaea]"
                >
                  {check} Check
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/auth?mode=signup">
                <Button size="lg" ariaLabel="Begin practice with Makana">
                  One Clean Move
                  <ArrowRight aria-hidden="true" className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </PageTransition>

      <Footer />
    </div>
  );
}

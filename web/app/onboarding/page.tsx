'use client';

/**
 * Onboarding Flow
 * 
 * A calm, intentional introduction to Makana's practice medium.
 * Follows the vision of restraint, clarity, and respect for user energy.
 * 
 * Design principles:
 * - One primary action per screen
 * - Generous spacing and breathing room
 * - Smooth, gentle animations (slide, fade)
 * - Progress indicators without pressure
 * - Skip-friendly (respect user autonomy)
 * - Theme toggle always accessible
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Onboarding steps (v0: simplified to 3 steps)
const STEPS = {
  ORIENTATION: 0,
  ENERGY: 1,
  EXPECTATIONS: 2,
} as const;

const TOTAL_STEPS = Object.keys(STEPS).length;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(STEPS.ORIENTATION);
  const [energyState, setEnergyState] = useState<string | null>(null);

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Mark as skipped and complete
    localStorage.setItem('makana_onboarding_completed', 'true');
    localStorage.setItem('makana_skipped_onboarding', 'true');
    
    // Set cookie for middleware
    document.cookie = 'makana_onboarding_completed=true; path=/; max-age=31536000';
    
    // Go directly to Daily Check
    router.push('/dashboard');
  };

  const handleComplete = () => {
    // Store onboarding completion
    localStorage.setItem('makana_onboarding_completed', 'true');
    
    // Set cookie for middleware
    document.cookie = 'makana_onboarding_completed=true; path=/; max-age=31536000';
    
    // Store energy state if selected
    if (energyState) {
      localStorage.setItem('makana_initial_energy_state', energyState);
    }
    
    // Navigate directly to Daily Check
    router.push('/dashboard');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: 'easeOut',
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#f7f5f2] dark:bg-[#121212] flex flex-col relative overflow-hidden">
      {/* Theme Toggle - Always accessible */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Progress Indicators */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-[#2B2B2B] dark:bg-[#6A6A6A]'
                : index < currentStep
                ? 'w-8 bg-[#2B2B2B] dark:bg-[#6A6A6A] opacity-50'
                : 'w-8 bg-[#d6d2cb] dark:bg-[#4A4A4A]'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {currentStep === STEPS.ORIENTATION && (
            <OrientationStep
              key="orientation"
              onNext={handleNext}
              onSkip={handleSkip}
              variants={containerVariants}
              contentVariants={contentVariants}
            />
          )}

          {currentStep === STEPS.ENERGY && (
            <EnergyStep
              key="energy"
              selected={energyState}
              onSelect={setEnergyState}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              variants={containerVariants}
              contentVariants={contentVariants}
            />
          )}

          {currentStep === STEPS.EXPECTATIONS && (
            <ExpectationsStep
              key="expectations"
              onComplete={handleComplete}
              onBack={handleBack}
              variants={containerVariants}
              contentVariants={contentVariants}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Step 1: Orientation - One-line introduction
function OrientationStep({
  onNext,
  onSkip,
  variants,
  contentVariants,
}: {
  onNext: () => void;
  onSkip: () => void;
  variants: any;
  contentVariants: any;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto text-center"
    >
      {/* Content */}
      <motion.div variants={contentVariants}>
        <p className="text-2xl md:text-3xl text-[#1f1f1f] dark:text-[#eaeaea] mb-12 leading-relaxed max-w-xl mx-auto">
          Makana is a practice medium. You don't need motivation. Just start where you are.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onNext}
            className="w-full sm:w-auto min-w-[160px]"
          >
            Continue
          </Button>
          
          <button
            onClick={onSkip}
            className="text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors text-sm"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Step 2: Energy Check - How does today feel? (skippable)
function EnergyStep({
  selected,
  onSelect,
  onNext,
  onBack,
  onSkip,
  variants,
  contentVariants,
}: {
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  variants: any;
  contentVariants: any;
}) {
  const energyStates = [
    { id: 'steady', label: 'Steady' },
    { id: 'tired', label: 'Tired' },
    { id: 'scattered', label: 'Scattered' },
    { id: 'heavy', label: 'Heavy' },
    { id: 'quiet', label: 'Quiet' },
  ];

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Content */}
      <motion.div variants={contentVariants} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-4">
          How does today feel?
        </h2>
      </motion.div>

      {/* Options */}
      <motion.div
        variants={contentVariants}
        className="bg-[#ece9e4] dark:bg-[#1A1A1A] rounded-xl p-8 mb-8"
      >
        <div className="space-y-3">
          {energyStates.map((state, index) => (
            <motion.button
              key={state.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelect(state.id)}
              className={`w-full px-6 py-5 rounded-lg border-2 transition-all text-left ${
                selected === state.id
                  ? 'border-[#2B2B2B] dark:border-[#6A6A6A] bg-[#f7f5f2] dark:bg-[#121212]'
                  : 'border-[#d6d2cb] dark:border-[#4A4A4A] hover:border-[#2B2B2B] dark:hover:border-[#6A6A6A]'
              }`}
            >
              <div className="text-lg font-medium text-[#1f1f1f] dark:text-[#eaeaea]">
                {state.label}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={onSkip}
            className="text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors text-sm"
          >
            Skip
          </button>
          
          <Button onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Step 3: Expectations - Set expectations, then begin
function ExpectationsStep({
  onComplete,
  onBack,
  variants,
  contentVariants,
}: {
  onComplete: () => void;
  onBack: () => void;
  variants: any;
  contentVariants: any;
}) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto text-center"
    >
      {/* Content */}
      <motion.div variants={contentVariants}>
        <p className="text-2xl md:text-3xl text-[#1f1f1f] dark:text-[#eaeaea] mb-12 leading-relaxed max-w-xl mx-auto">
          You'll check in once a day. You'll stop cleanly. That's enough.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onComplete}
            className="w-full sm:w-auto min-w-[160px]"
          >
            Begin
          </Button>
        </div>

        <button
          onClick={onBack}
          className="text-[#5f5f5f] dark:text-[#9a9a9a] hover:text-[#1f1f1f] dark:hover:text-[#eaeaea] transition-colors text-sm mt-6"
        >
          ← Back
        </button>
      </motion.div>
    </motion.div>
  );
}

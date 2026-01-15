/**
 * Clutch Page (Meet Clutch)
 * 
 * Explains Clutch - Makana's alignment layer.
 * Features Clutch logo with smooth magnet animation.
 */

'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { ClutchLogo } from '@/components/ui/logo';

export default function ClutchPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for magnet effect
  const springConfig = { damping: 20, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnet effect: pull towards cursor within range
    const maxDistance = 250;
    const dist = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (dist < maxDistance) {
      const strength = 1 - dist / maxDistance;
      mouseX.set(distanceX * strength * 0.4);
      mouseY.set(distanceY * strength * 0.4);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300">
      <Header />

      <main className="flex-1 py-20 bg-[#f7f5f2] dark:bg-[#121212] transition-colors duration-300" role="main" aria-labelledby="clutch-heading">
        {/* Clutch Logo with Magnet Animation */}
        <motion.div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex justify-center items-center pb-16"
          aria-label="Interactive Clutch logo with magnet effect"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            style={{ x, y }}
            className="cursor-pointer"
          >
            <motion.div
              role="img"
              aria-label="Clutch logo"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ClutchLogo size="lg" />
            </motion.div>
          </motion.div>
        </motion.div>

        <Container size="md">
          <article className="space-y-16">
            <div className="text-center space-y-6">
              <h1 id="clutch-heading" className="text-5xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea]">
                Meet Clutch
              </h1>
              <p className="text-2xl text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed max-w-3xl mx-auto">
                Clutch is Makana&apos;s alignment layer. It represents attraction,
                alignment, and gentle pull toward what matters.
              </p>
            </div>

            <section aria-labelledby="what-clutch-does">
              <h2 id="what-clutch-does" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-8 text-center">
                What Clutch Does
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8">
                  <h3 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                    Nudges gently
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                    Clutch suggests without demanding. It respects your capacity.
                  </p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                    Speaks in short lines
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                    Clear, calm communication. No over-explanation.
                  </p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                    Respects silence
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                    Clutch knows when to be quiet. Silence is a feature.
                  </p>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-3">
                    Protects energy
                  </h3>
                  <p className="text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                    Limits force when needed. Disengages early to prevent damage.
                  </p>
                </Card>
              </div>
            </section>

            <section aria-labelledby="how-clutch-works">
              <h2 id="how-clutch-works" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-8 text-center">
                How Clutch Works
              </h2>
              <div className="bg-[#ece9e4] dark:bg-[#1A1A1A] p-10 rounded-lg space-y-6 transition-colors duration-300">
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                  Mechanically, Clutch engages smoothly, limits force when
                  needed, and disengages early to prevent damage.
                </p>
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed">
                  Clutch preserves momentum instead of extracting output.
                </p>
                <p className="text-xl text-[#1f1f1f] dark:text-[#eaeaea] font-medium">
                  Alignment is felt, not announced.
                </p>
              </div>
            </section>

            <section aria-labelledby="what-clutch-is-not">
              <h2 id="what-clutch-is-not" className="text-3xl font-semibold text-[#1f1f1f] dark:text-[#eaeaea] mb-8 text-center">
                What Clutch Is Not
              </h2>
              <div className="bg-[#ece9e4] dark:bg-[#1A1A1A] p-10 rounded-lg transition-colors duration-300">
                <ul className="space-y-3 text-lg text-[#5f5f5f] dark:text-[#9a9a9a]">
                  <li>• Not a motivational coach</li>
                  <li>• Not a productivity optimizer</li>
                  <li>• Not a performance tracker</li>
                  <li>• Not a pressure system</li>
                </ul>
                <p className="text-lg text-[#5f5f5f] dark:text-[#9a9a9a] leading-relaxed mt-6">
                  Clutch adjusts conditions. It does not correct people.
                </p>
              </div>
            </section>
          </article>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

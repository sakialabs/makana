/**
 * 404 Not Found Page
 * 
 * Calm, respectful 404 page aligned with Makana's tone.
 * Direct, helpful, no blame.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function NotFound() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] transition-colors duration-300">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <Container size="sm">
          <div className="text-center space-y-8">
            {/* Simple 404 text */}
            <div className="space-y-6">
              <span className="text-6xl font-semibold text-[var(--color-text-secondary)]">404</span>
              
              <div className="space-y-4 max-w-md mx-auto">
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)]">
                  This page doesn't exist
                </h1>
                
                <p className="text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  The link may be broken, or the page may have moved.
                </p>
              </div>
            </div>

            {/* Helpful actions */}
            {!isLoading && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  variant="secondary" 
                  className="min-w-[160px]"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button className="min-w-[160px]">
                        Go to Dashboard
                      </Button>
                    </Link>
                    
                    <Link href="/">
                      <Button variant="ghost" className="min-w-[160px]">
                        Return Home
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/">
                    <Button className="min-w-[160px]">
                      Return Home
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

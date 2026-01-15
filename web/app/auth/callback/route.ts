/**
 * Authentication Callback Handler
 * 
 * Handles email confirmation callbacks from Supabase.
 * Attempts automatic sign-in after email confirmation.
 * 
 * Requirements: 7.1, 7.2, 7.3
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle error from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(
      new URL('/auth?error=confirmation_failed', requestUrl.origin)
    );
  }

  // If no code, redirect to sign-in
  if (!code) {
    return NextResponse.redirect(new URL('/auth', requestUrl.origin));
  }

  // Create Supabase client for server-side auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured');
    return NextResponse.redirect(new URL('/auth', requestUrl.origin));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  try {
    // Exchange the code for a session (Requirement 7.1)
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      // Redirect to sign-in with message (Requirement 7.3)
      return NextResponse.redirect(
        new URL('/auth?message=Email confirmed. Please sign in.', requestUrl.origin)
      );
    }

    if (data.session) {
      // Successful automatic sign-in (Requirement 7.2)
      // Redirect to onboarding for new users
      const response = NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
      
      // Set session cookies for the browser
      response.cookies.set('sb-access-token', data.session.access_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      response.cookies.set('sb-refresh-token', data.session.refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return response;
    }

    // No session created, redirect to sign-in (Requirement 7.3)
    return NextResponse.redirect(
      new URL('/auth?message=Email confirmed. Please sign in.', requestUrl.origin)
    );
  } catch (err) {
    console.error('Unexpected error in auth callback:', err);
    // Redirect to sign-in with message (Requirement 7.3)
    return NextResponse.redirect(
      new URL('/auth?message=Email confirmed. Please sign in.', requestUrl.origin)
    );
  }
}

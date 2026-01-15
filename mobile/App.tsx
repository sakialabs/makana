/**
 * Makana Mobile App
 * 
 * Entry point for the mobile application.
 * Handles deep links for email confirmation.
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeScreen } from './screens/HomeScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { SignInScreen } from './screens/SignInScreen';
import { handleEmailConfirmation } from './lib/auth';
import * as ExpoLinking from 'expo-linking';

// Simple navigation state
type Screen = 'home' | 'signup' | 'signin';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Handle deep links for email confirmation
  useEffect(() => {
    const handleInitialURL = async () => {
      const initialUrl = await ExpoLinking.getInitialURL();
      if (initialUrl) {
        await processDeepLink(initialUrl);
      }
    };

    const subscription = ExpoLinking.addEventListener('url', (event) => {
      processDeepLink(event.url);
    });

    handleInitialURL();

    return () => {
      subscription.remove();
    };
  }, []);

  const processDeepLink = async (url: string) => {
    if (url.includes('/auth/callback') || url.includes('code=')) {
      const result = await handleEmailConfirmation(url);

      if (result.success) {
        if (result.requiresSignIn) {
          Alert.alert(
            'Email Confirmed',
            result.error || 'Email confirmed. Please sign in.',
            [{ text: 'OK', onPress: () => setCurrentScreen('signin') }]
          );
        } else {
          Alert.alert(
            'Welcome',
            'Email confirmed. Welcome to Makana!',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Confirmation Failed',
          result.error || 'Unable to confirm email. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'signup':
        return (
          <SignUpScreen
            navigation={{
              navigate: (screen: string) => {
                if (screen === 'SignIn') setCurrentScreen('signin');
              },
            }}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            navigation={{
              navigate: (screen: string) => {
                if (screen === 'SignUp') setCurrentScreen('signup');
              },
            }}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            onGetStarted={() => setCurrentScreen('signup')}
            onSignIn={() => setCurrentScreen('signin')}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          {renderScreen()}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

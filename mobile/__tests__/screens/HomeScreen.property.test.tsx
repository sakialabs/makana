/**
 * Property-Based Tests for HomeScreen
 * Feature: mobile-home-auth-alignment
 * 
 * These tests verify universal properties that should hold across all component states.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { HomeScreen } from '../../screens/HomeScreen';

// Mock all necessary modules
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

jest.mock('../../components/ui/Logo', () => ({
  Logo: () => null,
}));

jest.mock('../../components/ui/Container', () => ({
  Container: ({ children }: any) => children,
}));

jest.mock('../../components/ui/Card', () => ({
  Card: ({ children }: any) => children,
}));

jest.mock('../../components/ui/Button', () => ({
  Button: ({ children, onPress }: any) => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

/**
 * Property 1: Primary Button Text Consistency
 * Validates: Requirements 1.1, 1.2, 4.1
 * 
 * For any render of the HomeScreen component, the primary call-to-action button text
 * should be "Begin Practice" and not "Get Started" or any other variant.
 */
describe('HomeScreen Property Tests', () => {
  describe('Property 1: Primary Button Text Consistency', () => {
    it('should always display "Begin Practice" as primary button text across all component states', () => {
      fc.assert(
        fc.property(
          // Generate random boolean for onSignIn presence
          fc.boolean(),
          (hasSignIn) => {
            // Render component with or without onSignIn based on random boolean
            const props = {
              onGetStarted: jest.fn(),
              ...(hasSignIn ? { onSignIn: jest.fn() } : {}),
            };

            const { getByText, queryByText } = render(<HomeScreen {...props} />);

            // Verify "Begin Practice" is present
            const beginPracticeButton = getByText('Begin Practice');
            expect(beginPracticeButton).toBeTruthy();

            // Verify "Get Started" is NOT present anywhere in the rendered output
            const getStartedButton = queryByText('Get Started');
            expect(getStartedButton).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should never render "Get Started" text in any component state', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (hasSignIn) => {
            const props = {
              onGetStarted: jest.fn(),
              ...(hasSignIn ? { onSignIn: jest.fn() } : {}),
            };

            const { queryByText } = render(<HomeScreen {...props} />);

            // Explicitly verify "Get Started" never appears
            expect(queryByText('Get Started')).toBeNull();
            expect(queryByText(/get started/i)).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

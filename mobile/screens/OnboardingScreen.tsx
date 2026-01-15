/**
 * Onboarding Screen - Mobile
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
 * - Native feel with React Native animations
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../theme/design-tokens';
import { Button } from '../components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Onboarding steps (v0: simplified to 3 steps)
const STEPS = {
  ORIENTATION: 0,
  ENERGY: 1,
  EXPECTATIONS: 2,
} as const;

const TOTAL_STEPS = Object.keys(STEPS).length;

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.ORIENTATION);
  const [energyState, setEnergyState] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('makana_onboarding_completed', 'true');
    await AsyncStorage.setItem('makana_skipped_onboarding', 'true');
    router.replace('/dashboard');
  };

  const handleComplete = async () => {
    // Store onboarding completion
    await AsyncStorage.setItem('makana_onboarding_completed', 'true');
    
    // Store energy state if selected
    if (energyState) {
      await AsyncStorage.setItem('makana_initial_energy_state', energyState);
    }
    
    // Navigate directly to Daily Check
    router.replace('/dashboard');
  };

  // Animate transition between steps
  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.parchment} />

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.progressDotActive,
              index < currentStep && styles.progressDotCompleted,
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {currentStep === STEPS.ORIENTATION && (
            <OrientationStep onNext={handleNext} onSkip={handleSkip} />
          )}

          {currentStep === STEPS.ENERGY && (
            <EnergyStep
              selected={energyState}
              onSelect={setEnergyState}
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}

          {currentStep === STEPS.EXPECTATIONS && (
            <ExpectationsStep onComplete={handleComplete} onBack={handleBack} />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// Step 1: Orientation
function OrientationStep({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <View style={styles.stepContainer}>
      {/* Content */}
      <View style={styles.textContainer}>
        <Text style={styles.orientationText}>
          Makana is a practice medium. You don't need motivation. Just start where you are.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button onPress={onNext} style={styles.primaryButton}>
          Continue
        </Button>
        
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 2: Energy Check
function EnergyStep({
  selected,
  onSelect,
  onNext,
  onBack,
  onSkip,
}: {
  selected: string | null;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const energyStates = [
    { id: 'steady', label: 'Steady' },
    { id: 'tired', label: 'Tired' },
    { id: 'scattered', label: 'Scattered' },
    { id: 'heavy', label: 'Heavy' },
    { id: 'quiet', label: 'Quiet' },
  ];

  return (
    <View style={styles.stepContainer}>
      {/* Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>How does today feel?</Text>
      </View>

      {/* Options */}
      <View style={styles.card}>
        <View style={styles.optionsList}>
          {energyStates.map((state) => (
            <TouchableOpacity
              key={state.id}
              onPress={() => onSelect(state.id)}
              style={[
                styles.listOption,
                selected === state.id && styles.listOptionSelected,
              ]}
            >
              <Text style={styles.listOptionTitle}>{state.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.rightNav}>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <Button onPress={onNext} style={styles.nextButton}>
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
}

// Step 3: Expectations
function ExpectationsStep({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.stepContainer}>
      {/* Content */}
      <View style={styles.textContainer}>
        <Text style={styles.orientationText}>
          You'll check in once a day. You'll stop cleanly. That's enough.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button onPress={onComplete} style={styles.primaryButton}>
          Begin
        </Button>
        
        <TouchableOpacity onPress={onBack} style={styles.skipButton}>
          <Text style={styles.skipText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? spacing['2xl'] + 20 : spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lightStone,
  },
  progressDotActive: {
    backgroundColor: colors.deepCharcoal,
  },
  progressDotCompleted: {
    backgroundColor: colors.deepCharcoal,
    opacity: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing['2xl'],
  },
  logo: {
    width: 120,
    height: 120,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  textContainer: {
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  orientationText: {
    fontSize: typography.fontSize.xl,
    color: colors.charcoal,
    textAlign: 'center',
    lineHeight: typography.fontSize.xl * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.slate,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.lg * typography.lineHeight.relaxed,
  },
  body: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  card: {
    backgroundColor: colors.softStone,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  cardIntro: {
    fontSize: typography.fontSize.base,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.lightStone,
    backgroundColor: colors.parchment,
  },
  optionSelected: {
    borderColor: colors.deepCharcoal,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.charcoal,
  },
  optionsList: {
    gap: spacing.sm,
  },
  listOption: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.lightStone,
    backgroundColor: colors.parchment,
  },
  listOptionSelected: {
    borderColor: colors.deepCharcoal,
  },
  listOptionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  listOptionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  practiceList: {
    gap: spacing.sm,
  },
  practiceItem: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  practiceBold: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.charcoal,
  },
  practiceFooter: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
    marginTop: spacing.lg,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
  },
  actionsContainer: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSize.sm,
    color: colors.slate,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.sm,
  },
  backText: {
    fontSize: typography.fontSize.base,
    color: colors.slate,
  },
  nextButton: {
    minWidth: 120,
  },
});

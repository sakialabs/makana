/**
 * Input Component (Mobile)
 * 
 * Text input with calm styling and clear focus states.
 * Supports password visibility toggle.
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  fullWidth = false,
  secureTextEntry,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry === true;
  const actualSecureTextEntry = isPassword && !showPassword;

  return (
    <View style={[fullWidth && styles.fullWidth]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            fullWidth && styles.fullWidth,
            isPassword && styles.inputWithIcon,
            style,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.coolGray}
          secureTextEntry={actualSecureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={styles.iconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,  // 14px vertical padding
    fontSize: typography.sizes.base,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.warmGray,
    borderRadius: 8,  // rounded-lg = 8px
    color: colors.charcoal,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  inputWithIcon: {
    paddingRight: spacing.xl + spacing.md,
  },
  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  iconButton: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: spacing.xs,
  },
  iconText: {
    fontSize: 20,
  },
  error: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.sm,
    color: colors.error,
  },
});

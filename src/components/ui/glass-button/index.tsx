import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  className,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { theme, isDark } = useTheme();

  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        // Standard: Light Button: #171717 | Dark Button: #F5F5F5
        return {
          backgroundColor: theme.colors.button,
          borderColor: theme.colors.button,
          borderWidth: 1,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.buttonSecondary,
          borderColor: theme.colors.border,
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.border,
          borderWidth: 1,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.danger,
          borderColor: theme.colors.danger,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
        // Standard: Light Button Text: #FFFFFF | Dark Button Text: #111111
        return {
          color: theme.colors.buttonText,
          fontWeight: '600',
        };
      case 'secondary':
        return {
          color: theme.colors.buttonSecondaryText,
          fontWeight: '500',
        };
      case 'outline':
        return {
          color: theme.colors.textPrimary,
          fontWeight: '500',
        };
      case 'danger':
        return {
          color: '#FFFFFF',
          fontWeight: '600',
        };
      case 'ghost':
        return {
          color: theme.colors.textSecondary,
          fontWeight: '500',
        };
    }
  };

  const paddingVertical = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const paddingHorizontal = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={className}
      style={[
        styles.button,
        {
          borderRadius: theme.radius.lg,
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
        },
        getButtonStyles(),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.buttonText : theme.colors.textPrimary}
        />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              { fontSize },
              getTextStyles(),
              leftIcon ? { marginLeft: 8 } : undefined,
              rightIcon ? { marginRight: 8 } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});

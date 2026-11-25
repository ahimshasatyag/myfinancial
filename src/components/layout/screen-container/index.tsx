import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../providers/theme-provider';

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  className,
  edges = ['top'],
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;

  return (
    <View
      className={`${isDark ? 'dark' : ''} ${className || ''}`}
      style={[
        styles.container,
        {
          // Standard: Light Screen: #F5F5F5 | Dark Screen: #090909
          backgroundColor: theme.colors.screen,
          paddingTop,
          paddingBottom,
        },
        style,
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

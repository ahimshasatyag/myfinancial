import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface AppDividerProps {
  style?: StyleProp<ViewStyle>;
  className?: string;
  vertical?: boolean;
}

export const AppDivider: React.FC<AppDividerProps> = ({ style, className, vertical = false }) => {
  const { theme } = useTheme();

  return (
    <View
      className={className}
      style={[
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: theme.colors.divider },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: 8,
  },
});

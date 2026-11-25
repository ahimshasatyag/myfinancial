import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface HeaderActionItem {
  icon: React.ReactNode;
  onPress: () => void;
  badge?: number | string;
}

export interface HeaderActionsProps {
  actions: HeaderActionItem[];
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ actions }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          onPress={action.onPress}
          style={[styles.button, { backgroundColor: theme.colors.cardMuted }]}
        >
          {action.icon}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

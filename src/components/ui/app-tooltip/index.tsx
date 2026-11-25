import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface AppTooltipProps {
  text: string;
  children: React.ReactNode;
}

export const AppTooltip: React.FC<AppTooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setVisible(!visible)}>
        {children}
      </TouchableOpacity>
      {visible && (
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: isDark ? '#FFFFFF' : '#111111',
              borderRadius: theme.radius.sm,
            },
          ]}
        >
          <Text style={[styles.text, { color: isDark ? '#111111' : '#FFFFFF' }]}>{text}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 99,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});

import React from 'react';
import { View, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface ProgressChartProps {
  percentage: number;
  label?: string;
  valueText?: string;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  percentage,
  label,
  valueText,
  color,
  height = 8,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const activeColor =
    color ||
    (clamped >= 90
      ? theme.colors.danger
      : clamped >= 75
      ? theme.colors.warning
      : isDark
      ? '#F5F5F5'
      : '#171717');

  return (
    <View style={[styles.container, style]}>
      {(label || valueText) && (
        <View style={styles.headerRow}>
          {label && <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>}
          {valueText && (
            <Text style={[styles.valueText, { color: theme.colors.textPrimary }]}>{valueText}</Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: theme.colors.cardMuted,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: activeColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

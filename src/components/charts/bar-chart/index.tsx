import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface BarChartItem {
  label: string;
  subLabel?: string;
  value: number;
  income?: number;
  expense?: number;
  color?: string;
  dateString?: string;
  fullDateLabel?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  barColor?: string;
  selectedIndex?: number | null;
  onSelect?: (item: BarChartItem, index: number) => void;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 140,
  barColor,
  selectedIndex,
  onSelect,
}) => {
  const { theme, isDark } = useTheme();
  const activeBarColor = barColor || (isDark ? '#F5F5F5' : '#171717');

  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.barsRow}>
        {data.map((item, idx) => {
          const absVal = Math.abs(item.value);
          const isZero = absVal === 0;
          const barHeight = isZero ? 4 : Math.max((absVal / max) * (height - 38), 8);
          const isSelected = selectedIndex === idx;

          const defaultColor = isZero
            ? isDark
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.15)'
            : item.value < 0
            ? theme.colors.danger
            : activeBarColor;

          const finalColor = item.color || defaultColor;

          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              disabled={!onSelect}
              onPress={() => onSelect?.(item, idx)}
              style={styles.barColumn}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: finalColor,
                      borderRadius: 7,
                      opacity: selectedIndex != null && !isSelected ? 0.35 : 1,
                      borderWidth: isSelected ? 1.5 : 0,
                      borderColor: theme.colors.textPrimary,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
              {item.subLabel ? (
                <Text
                  style={[
                    styles.subLabel,
                    {
                      color: isSelected
                        ? theme.colors.button
                        : theme.colors.textMuted,
                      fontWeight: isSelected ? '700' : '400',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.subLabel}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
  },
  barTrack: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 14,
    borderRadius: 7,
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  subLabel: {
    fontSize: 9,
    marginTop: 1,
    textAlign: 'center',
  },
});

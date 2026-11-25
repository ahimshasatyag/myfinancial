import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface BarChartItem {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  barColor?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 140, barColor }) => {
  const { theme, isDark } = useTheme();
  const activeBarColor = barColor || (isDark ? '#F5F5F5' : '#171717');

  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.barsRow}>
        {data.map((item, idx) => {
          const barHeight = Math.max((item.value / max) * (height - 30), 4);
          return (
            <View key={idx} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: activeBarColor,
                      borderRadius: theme.radius.xs,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.label, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </View>
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
  },
  label: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
});

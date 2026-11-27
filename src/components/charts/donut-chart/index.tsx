import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';

export interface DonutSegment {
  value: number;
  color?: string;
  label?: string;
  percentage?: number;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const VIBRANT_CATEGORY_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#F97316', // Orange
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 150,
  strokeWidth = 16,
  centerLabel,
  centerValue,
}) => {
  const { theme, isDark } = useTheme();
  const validData = data.filter((item) => item.value > 0);
  const total = validData.reduce((sum, item) => sum + item.value, 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Slices */}
          {total > 0 &&
            validData.map((item, index) => {
              const strokeDashoffset = circumference - (circumference * item.value) / total;
              const strokeDasharray = `${circumference} ${circumference}`;
              const rotation = accumulatedAngle;
              accumulatedAngle += (item.value / total) * 360;

              const sliceColor =
                item.color || VIBRANT_CATEGORY_COLORS[index % VIBRANT_CATEGORY_COLORS.length];

              return (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={sliceColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                />
              );
            })}
        </G>
      </Svg>

      {/* Center Label and Value */}
      {(centerLabel || centerValue) && (
        <View style={styles.centerText}>
          {centerValue && (
            <Text
              style={[
                styles.centerValText,
                { color: theme.colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {centerValue}
            </Text>
          )}
          {centerLabel && (
            <Text style={[styles.centerLblText, { color: theme.colors.textSecondary }]}>
              {centerLabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  centerValText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  centerLblText: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});

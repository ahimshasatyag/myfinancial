import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';

export interface DonutSegment {
  value: number;
  color?: string;
  label?: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 140,
  strokeWidth = 14,
  centerLabel,
  centerValue,
}) => {
  const { theme, isDark } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const defaultColors = isDark
    ? ['#F5F5F5', '#A3A3A3', '#737373', '#525252', '#303030']
    : ['#171717', '#525252', '#737373', '#A3A3A3', '#D4D4D4'];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {data.map((item, index) => {
            const strokeDashoffset = circumference - (circumference * item.value) / total;
            const strokeDasharray = `${circumference} ${circumference}`;
            const rotation = accumulatedAngle;
            accumulatedAngle += (item.value / total) * 360;

            return (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color || defaultColors[index % defaultColors.length]}
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
      {(centerLabel || centerValue) && (
        <View style={styles.centerText}>
          {centerValue && (
            <Text style={[styles.centerValText, { color: theme.colors.textPrimary }]}>
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
  },
  centerValText: {
    fontSize: 16,
    fontWeight: '700',
  },
  centerLblText: {
    fontSize: 11,
    marginTop: 2,
  },
});

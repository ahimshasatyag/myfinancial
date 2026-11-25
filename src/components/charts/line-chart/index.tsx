import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';

export interface LineChartProps {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
  showPoints?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 140,
  width = Dimensions.get('window').width - 64,
  color,
  showPoints = true,
}) => {
  const { theme, isDark } = useTheme();
  const strokeColor = color || (isDark ? '#FFFFFF' : '#171717');

  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 16;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = height - padding - ((val - min) / range) * chartHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Path d={areaD} fill="url(#lineGrad)" />
        <Path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" />
        {showPoints &&
          points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={strokeColor}
              stroke={theme.colors.card}
              strokeWidth={1.5}
            />
          ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

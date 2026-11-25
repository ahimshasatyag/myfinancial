import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';
import { formatCalendarAmount } from '../../../features/reports/services/reportService';

export interface LineChartProps {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
  showPoints?: boolean;
  labels?: string[];
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 140,
  width = Dimensions.get('window').width - 64,
  color,
  showPoints = true,
  labels,
}) => {
  const { theme, isDark } = useTheme();
  const strokeColor = color || (isDark ? '#FB7185' : '#E11D48');

  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const min = 0; // Fixed baseline at 0 for financial expense trends
  const range = max - min || 1;

  const paddingLeft = 44;
  const paddingRight = 14;
  const paddingTop = 16;
  const paddingBottom = labels && labels.length > 0 ? 26 : 14;

  const chartWidth = Math.max(width - paddingLeft - paddingRight, 10);
  const chartHeight = Math.max(height - paddingTop - paddingBottom, 10);

  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (val / range) * chartHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const baselineY = paddingTop + chartHeight;
  const areaD = `${pathD} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

  // Grid line levels: Peak, Middle, Zero
  const gridLines = [
    { y: paddingTop, label: formatCalendarAmount(max) },
    { y: paddingTop + chartHeight / 2, label: formatCalendarAmount(max / 2) },
    { y: baselineY, label: '0' },
  ];

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid guide lines */}
        {gridLines.map((line, idx) => (
          <React.Fragment key={idx}>
            <Line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          </React.Fragment>
        ))}

        {/* Shaded Area */}
        <Path d={areaD} fill="url(#lineGrad)" />

        {/* Main Line Stroke */}
        <Path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points only for days with actual expenses */}
        {showPoints &&
          points.map((p, i) => {
            if (p.val <= 0) return null;
            const isPeak = p.val === max;

            return (
              <React.Fragment key={i}>
                {isPeak && (
                  <Circle
                    cx={p.x}
                    cy={p.y}
                    r={7}
                    fill={isDark ? 'rgba(251, 113, 133, 0.25)' : 'rgba(244, 63, 94, 0.2)'}
                  />
                )}
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={isPeak ? 4.5 : 3.5}
                  fill={strokeColor}
                  stroke={isDark ? '#1F1F23' : '#FFFFFF'}
                  strokeWidth={2}
                />
              </React.Fragment>
            );
          })}
      </Svg>

      {/* Y-axis labels placed absolutely on the left */}
      <View style={[styles.yAxisContainer, { left: 4, top: paddingTop - 7 }]}>
        <Text style={[styles.axisText, { color: theme.colors.textMuted }]}>
          {gridLines[0].label}
        </Text>
      </View>
      <View
        style={[
          styles.yAxisContainer,
          { left: 4, top: paddingTop + chartHeight / 2 - 7 },
        ]}
      >
        <Text style={[styles.axisText, { color: theme.colors.textMuted }]}>
          {gridLines[1].label}
        </Text>
      </View>
      <View style={[styles.yAxisContainer, { left: 4, top: baselineY - 7 }]}>
        <Text style={[styles.axisText, { color: theme.colors.textMuted }]}>
          {gridLines[2].label}
        </Text>
      </View>

      {/* X-axis labels at bottom */}
      {labels && labels.length > 0 && (
        <View
          style={[
            styles.xAxisRow,
            {
              left: paddingLeft,
              right: paddingRight,
              bottom: 2,
            },
          ]}
        >
          {labels.map((lbl, idx) => (
            <Text
              key={idx}
              style={[
                styles.axisText,
                { color: theme.colors.textMuted },
              ]}
            >
              {lbl}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisContainer: {
    position: 'absolute',
    width: 36,
    alignItems: 'flex-end',
  },
  axisText: {
    fontSize: 9.5,
    fontWeight: '500',
  },
  xAxisRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

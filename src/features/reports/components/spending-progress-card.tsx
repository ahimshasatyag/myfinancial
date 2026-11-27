import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { GlassCard } from '../../../components/ui/glass-card';
import { useTheme } from '../../../providers/theme-provider';
import { CategorySpendItem } from '../services/reportService';

export interface SpendingProgressCardProps {
  currentDate: Date;
  totalIncome: number;
  totalExpense: number;
  categorySpend: CategorySpendItem[];
}

interface ProgressRowItem {
  key: string;
  label: string;
  status: string;
  isAlertStatus: boolean;
  percent: number;
  barColor: string;
}

const NEEDS_KEYWORDS = [
  'makan',
  'minum',
  'transport',
  'tagihan',
  'listrik',
  'air',
  'internet',
  'rumah',
  'sewa',
  'kos',
  'kesehatan',
  'obat',
  'pendidikan',
  'sekolah',
  'kuliah',
  'kebutuhan',
  'bensin',
];

function isNeedsCategory(categoryName: string): boolean {
  const lower = categoryName.toLowerCase();
  return NEEDS_KEYWORDS.some((kw) => lower.includes(kw));
}

export const SpendingProgressCard: React.FC<SpendingProgressCardProps> = ({
  currentDate,
  totalIncome,
  totalExpense,
  categorySpend,
}) => {
  const { theme, isDark } = useTheme();

  const { currentDay, daysInMonth, dayProgressRatio } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;
    const isPastMonth =
      year < today.getFullYear() ||
      (year === today.getFullYear() && month < today.getMonth());

    const day = isCurrentMonth
      ? Math.min(today.getDate(), totalDays)
      : isPastMonth
      ? totalDays
      : 0;

    return {
      currentDay: day,
      daysInMonth: totalDays,
      dayProgressRatio: totalDays > 0 ? day / totalDays : 0,
    };
  }, [currentDate]);

  const rows: ProgressRowItem[] = useMemo(() => {
    let needsSpent = 0;
    let wantsSpent = 0;

    for (const cat of categorySpend) {
      if (isNeedsCategory(cat.category_name)) {
        needsSpent += Number(cat.total_spend || 0);
      } else {
        wantsSpent += Number(cat.total_spend || 0);
      }
    }

    const savedAmount = Math.max(totalIncome - totalExpense, 0);
    const dayPct = Math.round(dayProgressRatio * 100);

    // Target alokasi 50% Kebutuhan, 30% Keinginan, 20% Tabungan berdasarkan pemasukan bulan ini
    let needsPct = 0;
    let wantsPct = 0;
    let savingsPct = 0;

    if (totalIncome > 0) {
      needsPct = Math.round((needsSpent / (totalIncome * 0.5)) * 100);
      wantsPct = Math.round((wantsSpent / (totalIncome * 0.3)) * 100);
      savingsPct = Math.round((savedAmount / (totalIncome * 0.2)) * 100);
    } else if (totalExpense > 0) {
      needsPct = Math.round((needsSpent / totalExpense) * 100);
      wantsPct = Math.round((wantsSpent / totalExpense) * 100);
      savingsPct = 0;
    }

    const getExpenseStatus = (pct: number): { text: string; alert: boolean } => {
      if (pct === 0) return { text: 'Masih aman', alert: false };
      if (pct > 100) return { text: 'Melebihi batas', alert: true };
      if (pct > dayPct + 12) return { text: 'Cepat sekali', alert: true };
      return { text: 'Masih aman', alert: false };
    };

    const getSavingsStatus = (pct: number): { text: string; alert: boolean } => {
      if (pct === 0) return { text: 'Belum ada', alert: false };
      if (pct >= 100) return { text: 'Tercapai', alert: false };
      if (pct >= dayPct + 8) return { text: 'Cepat sekali', alert: true };
      return { text: 'Masih aman', alert: false };
    };

    const needsStatus = getExpenseStatus(needsPct);
    const wantsStatus = getExpenseStatus(wantsPct);
    const savingsStatus = getSavingsStatus(savingsPct);

    return [
      {
        key: 'needs',
        label: 'KEBUTUHAN',
        status: needsStatus.text,
        isAlertStatus: needsStatus.alert,
        percent: Math.min(needsPct, 999),
        barColor: isDark ? '#A78BFA' : '#B794F6',
      },
      {
        key: 'wants',
        label: 'KEINGINAN',
        status: wantsStatus.text,
        isAlertStatus: wantsStatus.alert,
        percent: Math.min(wantsPct, 999),
        barColor: isDark ? '#FB923C' : '#FDBA74',
      },
      {
        key: 'savings',
        label: 'TABUNGAN',
        status: savingsStatus.text,
        isAlertStatus: savingsStatus.alert,
        percent: Math.min(savingsPct, 999),
        barColor: isDark ? '#A3E635' : '#84CC16',
      },
    ];
  }, [categorySpend, totalIncome, totalExpense, dayProgressRatio, isDark]);

  // Circular progress ring geometry
  const ringSize = 62;
  const strokeWidth = 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(dayProgressRatio, 0), 1));

  const trackBg = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';

  return (
    <GlassCard style={styles.card} contentStyle={styles.cardContent}>
      {/* Header: Circular Day Ring + Title */}
      <View style={styles.headerRow}>
        <View style={[styles.ringWrapper, { width: ringSize, height: ringSize }]}>
          <Svg width={ringSize} height={ringSize}>
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={trackBg}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={isDark ? '#A1A1AA' : '#94A3B8'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={[styles.ringLabel, { color: theme.colors.textMuted }]}>HARI</Text>
            <Text style={[styles.ringValue, { color: theme.colors.textPrimary }]}>
              {currentDay}
            </Text>
          </View>
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Progres Pengeluaran
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Hari {currentDay} dari {daysInMonth}
          </Text>
        </View>
      </View>

      {/* Progress Bars: Kebutuhan, Keinginan, Tabungan */}
      <View style={styles.barsContainer}>
        {rows.map((row) => (
          <View key={row.key} style={styles.barGroup}>
            <View style={styles.barLabelRow}>
              <View style={styles.barLeftLabels}>
                <Text style={[styles.categoryLabel, { color: theme.colors.textSecondary }]}>
                  {row.label}
                </Text>
                <Text
                  style={[
                    styles.statusLabel,
                    {
                      color: row.isAlertStatus
                        ? isDark
                          ? '#FCA5A5'
                          : '#F87171'
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {row.status}
                </Text>
              </View>
              <Text style={[styles.percentText, { color: theme.colors.textPrimary }]}>
                {row.percent}%
              </Text>
            </View>

            <View style={[styles.track, { backgroundColor: trackBg }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(Math.max(row.percent, 0), 100)}%`,
                    backgroundColor: row.barColor,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 22,
  },
  cardContent: {
    padding: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    lineHeight: 11,
  },
  ringValue: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  barsContainer: {
    gap: 14,
  },
  barGroup: {
    gap: 7,
  },
  barLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLeftLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});

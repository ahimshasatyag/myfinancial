import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart as PieChartIcon, TrendingUp } from 'lucide-react-native';
import { DonutChart } from '../../../components/charts/donut-chart';
import { LineChart } from '../../../components/charts/line-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { useTheme } from '../../../providers/theme-provider';
import { useReports } from '../hooks/useReports';
import { MonthlyActivityCalendar } from '../components/monthly-activity-calendar';
import { SpendingProgressCard } from '../components/spending-progress-card';
import { formatCalendarAmount } from '../services/reportService';

export const ReportsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data: report, isLoading, refetch } = useReports(selectedDate);

  const categorySegments = useMemo(() => {
    return (report?.categorySpend || []).map((cat) => ({
      label: cat.category_name,
      value: Number(cat.total_spend),
      percentage: cat.percentage,
      color: cat.color,
    }));
  }, [report?.categorySpend]);

  const totalExpense = report?.totalExpense || 0;
  const trendData = report?.trendData || [];

  // Generate 5 evenly spaced X-axis labels for the selected month
  const xLabels = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mShort = selectedDate.toLocaleDateString('id-ID', { month: 'short' });

    return [
      `1 ${mShort}`,
      `8 ${mShort}`,
      `15 ${mShort}`,
      `22 ${mShort}`,
      `${daysInMonth} ${mShort}`,
    ];
  }, [selectedDate]);

  const monthShortName = selectedDate.toLocaleDateString('id-ID', { month: 'short' });

  return (
    <ScreenContainer>
      <ScreenHeader title="Laporan & Analisis" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.button}
            colors={[theme.colors.button]}
          />
        }
      >
        {/* 1. Progres Pengeluaran (Sebelum Aktivitas Bulan Ini) */}
        <SpendingProgressCard
          currentDate={selectedDate}
          totalIncome={report?.cashFlow.total_income || 0}
          totalExpense={totalExpense}
          categorySpend={report?.categorySpend || []}
        />

        {/* 2. Kalender Aktivitas Bulan Ini */}
        <MonthlyActivityCalendar
          currentDate={selectedDate}
          onChangeDate={(newDate) => setSelectedDate(newDate)}
          dailyData={report?.dailyData || {}}
          isLoading={isLoading}
        />

        {/* 2. Komposisi Pengeluaran */}
        <GlassCard style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Komposisi Pengeluaran
          </Text>

          {categorySegments.length > 0 ? (
            <>
              {/* Donut Chart with center total */}
              <View style={styles.donutCenter}>
                <DonutChart
                  data={categorySegments}
                  size={160}
                  strokeWidth={18}
                  centerLabel="Total Keluar"
                  centerValue={formatCalendarAmount(totalExpense)}
                />
              </View>

              {/* Category Breakdown List */}
              <View style={styles.categoryList}>
                {categorySegments.map((cat, idx) => (
                  <View key={idx} style={styles.categoryItem}>
                    <View style={styles.categoryRow}>
                      <View style={styles.categoryLeft}>
                        <View style={[styles.categoryColorDot, { backgroundColor: cat.color }]} />
                        <Text
                          style={[styles.categoryName, { color: theme.colors.textPrimary }]}
                          numberOfLines={1}
                        >
                          {cat.label}
                        </Text>
                      </View>
                      <View style={styles.categoryRight}>
                        <Text style={[styles.categoryAmount, { color: theme.colors.textPrimary }]}>
                          <CurrencyText amount={cat.value} />
                        </Text>
                        <Text
                          style={[styles.categoryPercent, { color: theme.colors.textSecondary }]}
                        >
                          {cat.percentage}%
                        </Text>
                      </View>
                    </View>

                    {/* Visual proportion bar */}
                    <View
                      style={[
                        styles.progressBarBg,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.06)',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(cat.percentage, 100)}%`,
                            backgroundColor: cat.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyCardContent}>
              <PieChartIcon size={36} color={theme.colors.textMuted} />
              <Text style={[styles.emptyCardText, { color: theme.colors.textMuted }]}>
                Belum ada pengeluaran di bulan ini
              </Text>
            </View>
          )}
        </GlassCard>

        {/* 3. Tren Pengeluaran Harian */}
        <GlassCard style={styles.chartCard}>
          <View style={styles.trendHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary, marginBottom: 0 }]}>
              Tren Pengeluaran Harian
            </Text>
            {report?.peakExpense && report.peakExpense.amount > 0 && (
              <View
                style={[
                  styles.peakBadge,
                  {
                    backgroundColor: isDark ? 'rgba(244, 63, 94, 0.16)' : '#FFF1F2',
                    borderColor: isDark ? 'rgba(244, 63, 94, 0.3)' : '#FECACA',
                  },
                ]}
              >
                <Text
                  style={[styles.peakBadgeText, { color: isDark ? '#FB7185' : '#E11D48' }]}
                >
                  Puncak: {report.peakExpense.day} {monthShortName} (
                  {formatCalendarAmount(report.peakExpense.amount)})
                </Text>
              </View>
            )}
          </View>

          {totalExpense > 0 ? (
            <>
              {/* Daily trend summary indicators */}
              <View style={styles.trendStatsRow}>
                <View
                  style={[
                    styles.trendStatBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(0, 0, 0, 0.02)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                >
                  <Text style={[styles.trendStatLabel, { color: theme.colors.textSecondary }]}>
                    Rata-rata Harian
                  </Text>
                  <Text style={[styles.trendStatValue, { color: theme.colors.textPrimary }]}>
                    <CurrencyText amount={report?.averageDailyExpense || 0} />
                    <Text style={[styles.trendStatUnit, { color: theme.colors.textSecondary }]}>
                      /hari
                    </Text>
                  </Text>
                </View>

                <View
                  style={[
                    styles.trendStatBox,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(0, 0, 0, 0.02)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                >
                  <Text style={[styles.trendStatLabel, { color: theme.colors.textSecondary }]}>
                    Hari Aktif Belanja
                  </Text>
                  <Text style={[styles.trendStatValue, { color: theme.colors.textPrimary }]}>
                    {report?.activeDaysCount || 0}{' '}
                    <Text style={[styles.trendStatUnit, { color: theme.colors.textSecondary }]}>
                      hari
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Labeled Line Chart */}
              <View style={styles.lineChartWrapper}>
                <LineChart
                  data={trendData}
                  height={150}
                  color="#FB7185"
                  showPoints={true}
                  labels={xLabels}
                />
              </View>
            </>
          ) : (
            <View style={styles.emptyCardContent}>
              <TrendingUp size={36} color={theme.colors.textMuted} />
              <Text style={[styles.emptyCardText, { color: theme.colors.textMuted }]}>
                Belum ada tren pengeluaran di bulan ini
              </Text>
            </View>
          )}
        </GlassCard>

        <View style={{ height: 90 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  donutCenter: {
    alignItems: 'center',
    marginVertical: 14,
  },
  categoryList: {
    marginTop: 14,
    gap: 12,
  },
  categoryItem: {
    gap: 6,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  categoryColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryPercent: {
    fontSize: 12,
    fontWeight: '500',
    width: 38,
    textAlign: 'right',
  },
  progressBarBg: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  peakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  peakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  trendStatBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  trendStatValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  trendStatUnit: {
    fontSize: 11,
    fontWeight: '400',
  },
  lineChartWrapper: {
    alignItems: 'center',
    marginTop: 4,
  },
  emptyCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 10,
  },
  emptyCardText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

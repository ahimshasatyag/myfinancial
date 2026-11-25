import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DonutChart } from '../../../components/charts/donut-chart';
import { LineChart } from '../../../components/charts/line-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { useTheme } from '../../../providers/theme-provider';
import { useReports } from '../hooks/useReports';

export const ReportsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { data: report, isLoading } = useReports();

  const categorySegments = (report?.categorySpend || []).map((cat) => ({
    label: cat.category_name,
    value: Number(cat.total_spend),
  }));

  const mockTrendData = [120, 240, 180, 320, 210, 410, 380];

  return (
    <ScreenContainer>
      <ScreenHeader title="Laporan & Analisis" />
      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Arus Kas Bulan Ini</Text>
          <View style={styles.flowRow}>
            <View style={styles.flowCol}>
              <Text style={[styles.flowLabel, { color: theme.colors.textSecondary }]}>Pemasukan</Text>
              <CurrencyText
                amount={Number(report?.cashFlow.total_income || 0)}
                colored
                style={styles.flowValue}
              />
            </View>
            <View style={styles.flowCol}>
              <Text style={[styles.flowLabel, { color: theme.colors.textSecondary }]}>Pengeluaran</Text>
              <CurrencyText
                amount={-Number(report?.cashFlow.total_expense || 0)}
                colored
                style={styles.flowValue}
              />
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Komposisi Pengeluaran
          </Text>
          <View style={styles.donutCenter}>
            <DonutChart
              data={categorySegments.length > 0 ? categorySegments : [{ value: 100 }]}
              size={150}
              centerLabel="Kategori"
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.chartCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Tren Pengeluaran</Text>
          <LineChart data={mockTrendData} height={130} />
        </GlassCard>

        <View style={{ height: 80 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 14,
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flowCol: {
    alignItems: 'center',
  },
  flowLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  flowValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  donutCenter: {
    alignItems: 'center',
    marginVertical: 12,
  },
});

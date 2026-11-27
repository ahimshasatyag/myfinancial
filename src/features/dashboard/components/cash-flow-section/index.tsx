import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { BarChart, BarChartItem } from '../../../../components/charts/bar-chart';
import { CurrencyText } from '../../../../components/common/currency-text';
import { useTheme } from '../../../../providers/theme-provider';
import { getTodayDateString } from '../../../../utils/date';

export interface CashFlowSectionProps {
  netCashFlow: number;
  monthlyIncome?: number;
  monthlyExpense?: number;
  chartData?: BarChartItem[];
}

export const CashFlowSection: React.FC<CashFlowSectionProps> = ({
  netCashFlow,
  monthlyIncome = 0,
  monthlyExpense = 0,
  chartData = [],
}) => {
  const { theme } = useTheme();

  // Fallback default 7 days jika chartData kosong
  const fallbackData: BarChartItem[] = [
    { label: 'Sen', subLabel: '23', value: 0, income: 0, expense: 0 },
    { label: 'Sel', subLabel: '24', value: 0, income: 0, expense: 0 },
    { label: 'Rab', subLabel: '25', value: 0, income: 0, expense: 0 },
    { label: 'Kam', subLabel: '26', value: 0, income: 0, expense: 0 },
    { label: 'Jum', subLabel: '27', value: 0, income: 0, expense: 0 },
    { label: 'Sab', subLabel: '28', value: 0, income: 0, expense: 0 },
    { label: 'Min', subLabel: '29', value: 0, income: 0, expense: 0 },
  ];

  const dataToDisplay = chartData.length > 0 ? chartData : fallbackData;

  // Pilih hari ini sebagai default jika ada di rentang tanggal
  const todayStr = getTodayDateString();
  const todayIndex = dataToDisplay.findIndex((item) => item.dateString === todayStr);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    return todayIndex >= 0 ? todayIndex : null;
  });

  const selectedItem = selectedIndex != null ? dataToDisplay[selectedIndex] : null;

  const handleSelect = (_item: BarChartItem, index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  // Nilai yang ditampilkan di header dan chip rincian
  const currentNet = selectedItem ? selectedItem.value : netCashFlow;
  const currentIncome = selectedItem ? selectedItem.income ?? 0 : monthlyIncome;
  const currentExpense = selectedItem ? selectedItem.expense ?? 0 : monthlyExpense;

  const subtitleText = selectedItem?.fullDateLabel
    ? selectedItem.fullDateLabel
    : 'Periode bulan ini';

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Arus Kas Bersih</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitleText}
          </Text>
        </View>
        <CurrencyText
          amount={currentNet}
          colored
          showSign
          style={styles.netAmount}
        />
      </View>

      {/* Rincian Pemasukan & Pengeluaran Per Hari Diikuti Tanggal */}
      <View style={styles.breakdownRow}>
        <View
          style={[
            styles.breakdownChip,
            { backgroundColor: theme.colors.successBg, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.breakdownLabel, { color: theme.colors.success }]}>Masuk: </Text>
          <CurrencyText
            amount={currentIncome}
            currencyCode="IDR"
            style={[styles.breakdownValue, { color: theme.colors.success }]}
          />
        </View>

        <View
          style={[
            styles.breakdownChip,
            { backgroundColor: theme.colors.dangerBg, borderColor: theme.colors.border },
          ]}
        >
          <Text style={[styles.breakdownLabel, { color: theme.colors.danger }]}>Keluar: </Text>
          <CurrencyText
            amount={currentExpense}
            currencyCode="IDR"
            style={[styles.breakdownValue, { color: theme.colors.danger }]}
          />
        </View>
      </View>

      <BarChart
        data={dataToDisplay}
        height={115}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      />
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  netAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  breakdownChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});

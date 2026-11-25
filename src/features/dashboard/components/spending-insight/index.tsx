import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { useTheme } from '../../../../providers/theme-provider';

export interface SpendingInsightProps {
  income?: number;
  expense?: number;
  transactionCount?: number;
}

export const SpendingInsight: React.FC<SpendingInsightProps> = ({
  income = 0,
  expense = 0,
  transactionCount = 0,
}) => {
  const { theme, isDark } = useTheme();

  let message =
    'Catat pemasukan dan pengeluaran harian Anda untuk melihat ringkasan arus kas bulan ini.';
  if (transactionCount > 0) {
    if (income > 0) {
      const ratio = Math.round((expense / income) * 100);
      message =
        ratio <= 70
          ? `Rasio pengeluaran bulan ini ${ratio}% dari pemasukan (${transactionCount} transaksi selesai). Arus kas terjaga sehat.`
          : ratio <= 100
          ? `Pengeluaran bulan ini mencapai ${ratio}% dari pemasukan (${transactionCount} transaksi selesai). Perhatikan sisa anggaran.`
          : `Pengeluaran bulan ini melebihi pemasukan (${ratio}%). Pertimbangkan mengevaluasi kategori pengeluaran terbesar.`;
    } else if (expense > 0) {
      message = `Tercatat ${transactionCount} transaksi pengeluaran bulan ini tanpa pemasukan tercatat.`;
    }
  }

  return (
    <GlassCard style={{ marginBottom: 20 }}>
      <View className="flex-row items-start">
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: isDark ? '#262626' : '#F0F0F0' }}
        >
          <Lightbulb size={18} color={isDark ? '#F5F5F5' : '#171717'} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold mb-1" style={{ color: theme.colors.textPrimary }}>
            Ringkasan Arus Kas
          </Text>
          <Text className="text-xs leading-[18px]" style={{ color: theme.colors.textSecondary }}>
            {message}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

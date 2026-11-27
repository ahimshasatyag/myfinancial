import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  HandCoins,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { useDebts } from '../hooks/useDebts';
import { DebtOverviewItem } from '../services/debtService';
import { formatDate } from '../../../utils/date';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

type DebtFilter = 'all' | 'payable' | 'receivable' | 'paid';

const FILTER_TABS: { label: string; value: DebtFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Utang', value: 'payable' },
  { label: 'Piutang', value: 'receivable' },
  { label: 'Lunas', value: 'paid' },
];

export const DebtListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<DebtFilter>('all');
  const { data: debts, isLoading, isError, error, refetch } = useDebts();

  const summary = useMemo(() => {
    const list = debts || [];
    const totalPayableRemaining = list
      .filter((d) => d.type === 'payable' && d.status !== 'paid')
      .reduce((sum, d) => sum + Number(d.remaining_amount || 0), 0);
    const totalReceivableRemaining = list
      .filter((d) => d.type === 'receivable' && d.status !== 'paid')
      .reduce((sum, d) => sum + Number(d.remaining_amount || 0), 0);
    return { totalPayableRemaining, totalReceivableRemaining };
  }, [debts]);

  const filteredDebts = useMemo(() => {
    const list = debts || [];
    if (filter === 'all') return list;
    if (filter === 'paid') return list.filter((d) => d.status === 'paid');
    return list.filter((d) => d.type === filter && d.status !== 'paid');
  }, [debts, filter]);

  const renderItem = ({ item }: { item: DebtOverviewItem }) => {
    const isPayable = item.type === 'payable';
    const isPaid = item.status === 'paid';
    const pct = Math.min(Math.round(item.progress_percentage || 0), 100);

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.push(ROUTES.DEBTS.DETAIL(item.debt_id) as any)}
      >
        <GlassCard style={{ marginBottom: 12 }} contentStyle={{ padding: 16 }}>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1 mr-2">
              <View
                className="w-[38px] h-[38px] rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isPayable ? theme.colors.dangerBg : theme.colors.successBg,
                }}
              >
                {isPayable ? (
                  <ArrowUpRight size={17} color={theme.colors.danger} />
                ) : (
                  <ArrowDownLeft size={17} color={theme.colors.success} />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className="text-[15px] font-semibold"
                  style={{ color: theme.colors.textPrimary }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-[12px] mt-0.5"
                  style={{ color: theme.colors.textMuted }}
                  numberOfLines={1}
                >
                  {isPayable ? 'Ke: ' : 'Dari: '}
                  {item.counterparty_name}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5">
              <GlassBadge
                label={isPaid ? 'Lunas' : isPayable ? 'Utang' : 'Piutang'}
                variant={isPaid ? 'success' : isPayable ? 'danger' : 'default'}
                size="sm"
              />
              <ChevronRight size={16} color={theme.colors.textMuted} />
            </View>
          </View>

          <ProgressChart percentage={pct} height={7} style={{ marginBottom: 12 }} />

          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Sisa {isPayable ? 'Utang' : 'Piutang'}
              </Text>
              <CurrencyText
                amount={item.remaining_amount}
                currencyCode={item.currency_code}
                style={{ fontSize: 13, fontWeight: '700' }}
              />
            </View>
            <View className="items-end">
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Terbayar ({pct}%)
              </Text>
              <CurrencyText
                amount={item.paid_amount}
                currencyCode={item.currency_code}
                style={{ fontSize: 13, fontWeight: '700' }}
              />
            </View>
          </View>

          {item.due_date ? (
            <View className="flex-row items-center gap-1.5 mt-2.5">
              <Calendar size={11} color={theme.colors.textMuted} />
              <Text className="text-[11px]" style={{ color: theme.colors.textMuted }}>
                Jatuh tempo: {formatDate(item.due_date, 'medium')}
              </Text>
            </View>
          ) : null}
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Utang & Piutang"
        subtitle="Kelola cicilan dan pinjaman"
        showBack
      />

      <View className="flex-1 px-4 pt-1.5">
        <GlassCard
          variant="glass"
          intensity={55}
          style={{ marginBottom: 14 }}
          contentStyle={{ padding: 16 }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-1.5">
                <View
                  className="w-[22px] h-[22px] rounded-full items-center justify-center mr-1.5"
                  style={{ backgroundColor: theme.colors.dangerBg }}
                >
                  <ArrowUpRight size={13} color={theme.colors.danger} />
                </View>
                <Text
                  className="text-[12px] font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Sisa Utang
                </Text>
              </View>
              <CurrencyText
                amount={summary.totalPayableRemaining}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{ fontSize: 17, fontWeight: '700' }}
              />
            </View>

            <View
              className="w-[1px] self-stretch opacity-70"
              style={{ backgroundColor: theme.colors.border }}
            />

            <View className="flex-1">
              <View className="flex-row items-center mb-1.5">
                <View
                  className="w-[22px] h-[22px] rounded-full items-center justify-center mr-1.5"
                  style={{ backgroundColor: theme.colors.successBg }}
                >
                  <ArrowDownLeft size={13} color={theme.colors.success} />
                </View>
                <Text
                  className="text-[12px] font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Sisa Piutang
                </Text>
              </View>
              <CurrencyText
                amount={summary.totalReceivableRemaining}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={{ fontSize: 17, fontWeight: '700' }}
              />
            </View>
          </View>
        </GlassCard>

        <View className="flex-row flex-wrap gap-2 mb-3.5">
          {FILTER_TABS.map((tab) => {
            const active = filter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.75}
                onPress={() => setFilter(tab.value)}
                className="px-3.5 py-1.5 rounded-full border"
                style={{
                  backgroundColor: active ? theme.colors.button : theme.colors.card,
                  borderColor: active ? theme.colors.button : theme.colors.border,
                }}
              >
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: active ? theme.colors.buttonText : theme.colors.textSecondary }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isError ? (
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Gagal memuat daftar utang.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : !isLoading && filteredDebts.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon={<HandCoins size={34} color={theme.colors.textMuted} />}
              title="Belum ada catatan"
              description="Catat utang, cicilan, atau piutang beserta jatuh temponya agar pembayaran selalu terpantau."
              actionTitle="Catat Utang / Piutang"
              onAction={() => router.push(ROUTES.DEBTS.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={filteredDebts}
            keyExtractor={(item) => item.debt_id}
            onRefresh={() => {
              refetch();
            }}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 96 }}
            renderItem={renderItem}
          />
        )}
      </View>

      <FabButton
        accessibilityLabel="Catat utang atau piutang"
        onPress={() => router.push(ROUTES.DEBTS.NEW as any)}
      />
    </ScreenContainer>
  );
};

import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { useInvestments } from '../hooks/useInvestments';
import {
  INVESTMENT_CATEGORY_LABELS,
  InvestmentCategory,
  InvestmentOverviewItem,
} from '../services/investmentService';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

type InvestmentFilter = 'all' | InvestmentCategory;

const FILTER_TABS: { label: string; value: InvestmentFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Saham', value: 'stock' },
  { label: 'Reksa Dana', value: 'mutual_fund' },
  { label: 'Emas', value: 'gold' },
  { label: 'Kripto', value: 'crypto' },
  { label: 'Obligasi', value: 'bond' },
  { label: 'Deposito', value: 'deposit' },
];

export const InvestmentListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<InvestmentFilter>('all');
  const { data: investments, isLoading, isError, error, refetch } = useInvestments();

  const summary = useMemo(() => {
    const list = investments || [];
    const totalValue = list.reduce((sum, i) => sum + Number(i.current_value || 0), 0);
    const totalInvested = list.reduce((sum, i) => sum + Number(i.invested_amount || 0), 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalReturnPct =
      totalInvested > 0 ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2)) : 0;
    return { totalValue, totalInvested, totalProfitLoss, totalReturnPct };
  }, [investments]);

  const filteredInvestments = useMemo(() => {
    const list = investments || [];
    if (filter === 'all') return list;
    return list.filter((item) => item.category === filter);
  }, [investments, filter]);

  const isOverallGain = summary.totalProfitLoss >= 0;

  const renderItem = ({ item }: { item: InvestmentOverviewItem }) => {
    const isGain = item.profit_loss >= 0;
    const pctText = `${isGain ? '+' : ''}${item.return_percentage.toFixed(1)}%`;

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => router.push(ROUTES.INVESTMENTS.DETAIL(item.investment_id) as any)}
      >
        <GlassCard style={{ marginBottom: 12 }} contentStyle={{ padding: 16 }}>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1 mr-2">
              <View
                className="w-[38px] h-[38px] rounded-full items-center justify-center mr-3"
                style={{
                  backgroundColor: isGain ? theme.colors.successBg : theme.colors.dangerBg,
                }}
              >
                {isGain ? (
                  <TrendingUp size={17} color={theme.colors.success} />
                ) : (
                  <TrendingDown size={17} color={theme.colors.danger} />
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text
                    className="text-[15px] font-semibold"
                    style={{ color: theme.colors.textPrimary }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.symbol ? (
                    <Text className="text-[11px] font-bold" style={{ color: theme.colors.textMuted }}>
                      ({item.symbol})
                    </Text>
                  ) : null}
                </View>
                <Text
                  className="text-[12px] mt-0.5"
                  style={{ color: theme.colors.textMuted }}
                  numberOfLines={1}
                >
                  {INVESTMENT_CATEGORY_LABELS[item.category]}
                  {item.platform ? ` • ${item.platform}` : ''}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-1.5">
              <GlassBadge
                label={pctText}
                variant={isGain ? 'success' : 'danger'}
                size="sm"
              />
              <ChevronRight size={16} color={theme.colors.textMuted} />
            </View>
          </View>

          <View
            className="flex-row items-end justify-between pt-2.5 border-t"
            style={{ borderTopColor: theme.colors.border }}
          >
            <View>
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Nilai Saat Ini
              </Text>
              <CurrencyText
                amount={item.current_value}
                currencyCode={item.currency_code}
                style={{ fontSize: 15, fontWeight: '700' }}
              />
            </View>
            <View className="items-end">
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Untung / Rugi
              </Text>
              <CurrencyText
                amount={item.profit_loss}
                currencyCode={item.currency_code}
                showSign
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: isGain ? theme.colors.success : theme.colors.danger,
                }}
              />
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Investasi"
        subtitle="Pantau portofolio aset Anda"
        showBack
      />

      <View className="flex-1 px-4 pt-1.5">
        <GlassCard
          variant="glass"
          intensity={55}
          style={{ marginBottom: 14 }}
          contentStyle={{ padding: 18 }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text
              className="text-[12px] font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              Total Nilai Portofolio
            </Text>
            <GlassBadge
              label={`${isOverallGain ? '+' : ''}${summary.totalReturnPct.toFixed(1)}%`}
              variant={isOverallGain ? 'success' : 'danger'}
              size="sm"
            />
          </View>

          <CurrencyText
            amount={summary.totalValue}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}
          />

          <View
            className="flex-row items-center justify-between mt-3.5 pt-3 border-t gap-3"
            style={{ borderTopColor: theme.colors.border }}
          >
            <View className="flex-1">
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Total Modal
              </Text>
              <CurrencyText
                amount={summary.totalInvested}
                style={{ fontSize: 14, fontWeight: '700' }}
              />
            </View>
            <View
              className="w-[1px] self-stretch opacity-70"
              style={{ backgroundColor: theme.colors.border }}
            />
            <View className="flex-1">
              <Text className="text-[11px] mb-0.5" style={{ color: theme.colors.textMuted }}>
                Total Untung / Rugi
              </Text>
              <CurrencyText
                amount={summary.totalProfitLoss}
                showSign
                style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: isOverallGain ? theme.colors.success : theme.colors.danger,
                }}
              />
            </View>
          </View>
        </GlassCard>

        <View className="mb-3.5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
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
                    style={{
                      color: active ? theme.colors.buttonText : theme.colors.textSecondary,
                    }}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {isError ? (
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Gagal memuat portofolio investasi.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : !isLoading && filteredInvestments.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon={<TrendingUp size={34} color={theme.colors.textMuted} />}
              title="Belum ada portofolio investasi"
              description="Catat reksa dana, saham, emas, atau instrumen investasi lainnya untuk memantau pertumbuhan nilai aset Anda."
              actionTitle="Tambah Investasi"
              onAction={() => router.push(ROUTES.INVESTMENTS.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={filteredInvestments}
            keyExtractor={(item) => item.investment_id}
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
        accessibilityLabel="Tambah investasi"
        onPress={() => router.push(ROUTES.INVESTMENTS.NEW as any)}
      />
    </ScreenContainer>
  );
};

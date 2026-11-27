import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Target, Calendar, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { FabButton } from '../../../components/ui/fab-button';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { useSavings } from '../hooks/useSavings';
import { GoalStatus } from '../../../types/database.types';
import { formatDate } from '../../../utils/date';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

type GoalFilter = 'all' | GoalStatus;

const FILTER_TABS: { label: string; value: GoalFilter }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Tercapai', value: 'completed' },
  { label: 'Dijeda', value: 'paused' },
];

export const GoalsScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [statusFilter, setStatusFilter] = useState<GoalFilter>('all');
  const { data: goals, isLoading, isError, error, refetch } = useSavings(statusFilter);

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'Tercapai', variant: 'success' as const };
      case 'paused':
        return { label: 'Dijeda', variant: 'warning' as const };
      case 'cancelled':
        return { label: 'Dibatalkan', variant: 'danger' as const };
      default:
        return { label: 'Aktif', variant: 'default' as const };
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Goals"
        subtitle="Target tabungan & impian Anda"
      />

      <View className="flex-1 px-4 pt-1.5">
        <View className="flex-row flex-wrap gap-2 mb-3.5">
          {FILTER_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                activeOpacity={0.75}
                onPress={() => setStatusFilter(tab.value)}
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
              message={(error as Error)?.message || 'Gagal memuat daftar goals.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : !isLoading && (!goals || goals.length === 0) ? (
          <GlassCard>
            <EmptyState
              icon={<Target size={34} color={theme.colors.textMuted} />}
              title="Belum ada goals"
              description="Buat target tabungan seperti Dana Darurat, Gadget, atau Liburan untuk memantau progres Anda."
              actionTitle="Buat Goal Baru"
              onAction={() => router.push(ROUTES.SAVINGS.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={goals || []}
            keyExtractor={(item) => item.goal_id}
            onRefresh={() => {
              refetch();
            }}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            renderItem={({ item }) => {
              const badge = getStatusBadge(item.status);
              const pct = Math.min(Math.round(item.progress_percentage || 0), 100);

              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => router.push(ROUTES.SAVINGS.DETAIL(item.goal_id) as any)}
                >
                  <GlassCard style={{ marginBottom: 12 }} contentStyle={{ padding: 16 }}>
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center flex-1 mr-2">
                        <View
                          className="w-[38px] h-[38px] rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: theme.colors.cardMuted }}
                        >
                          <Target size={18} color={theme.colors.textPrimary} />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-[15px] font-semibold"
                            style={{ color: theme.colors.textPrimary }}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          {item.target_date ? (
                            <View className="flex-row items-center gap-1 mt-0.5">
                              <Calendar size={11} color={theme.colors.textMuted} />
                              <Text
                                className="text-[11px]"
                                style={{ color: theme.colors.textMuted }}
                              >
                                {formatDate(item.target_date, 'medium')}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>

                      <View className="flex-row items-center gap-1.5">
                        <GlassBadge label={badge.label} variant={badge.variant} size="sm" />
                        <ChevronRight size={16} color={theme.colors.textMuted} />
                      </View>
                    </View>

                    <ProgressChart percentage={pct} height={8} style={{ marginBottom: 12 }} />

                    <View className="flex-row items-end justify-between">
                      <View>
                        <Text
                          className="text-[11px] mb-0.5"
                          style={{ color: theme.colors.textMuted }}
                        >
                          Terkumpul
                        </Text>
                        <CurrencyText
                          amount={item.saved_amount}
                          currencyCode={item.currency_code}
                          style={{ fontSize: 13, fontWeight: '700' }}
                        />
                      </View>
                      <View className="items-center">
                        <Text
                          className="text-[13px] font-bold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {pct}%
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text
                          className="text-[11px] mb-0.5"
                          style={{ color: theme.colors.textMuted }}
                        >
                          Target
                        </Text>
                        <CurrencyText
                          amount={item.target_amount}
                          currencyCode={item.currency_code}
                          style={{ fontSize: 13, fontWeight: '700' }}
                        />
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      <FabButton
        hasTabBar
        accessibilityLabel="Buat goal baru"
        onPress={() => router.push(ROUTES.SAVINGS.NEW as any)}
      />
    </ScreenContainer>
  );
};

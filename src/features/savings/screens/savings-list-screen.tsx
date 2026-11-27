import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Target } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { useSavings } from '../hooks/useSavings';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const SavingsListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { data: goals, isLoading, refetch } = useSavings();

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Goals"
        showBack
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Plus size={20} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.SAVINGS.NEW as any),
              },
            ]}
          />
        }
      />
      <View className="flex-1 p-4">
        {goals?.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon={<Target size={36} color={theme.colors.textMuted} />}
              title="Belum ada goals"
              description="Tetapkan target finansial Anda dan pantau progres pencapaiannya."
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
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(ROUTES.SAVINGS.DETAIL(item.goal_id) as any)}
              >
                <GlassCard style={{ marginBottom: 14 }} contentStyle={{ padding: 18 }}>
                  <View className="flex-row justify-between items-center mb-2.5">
                    <Text
                      className="text-[16px] font-semibold flex-1 mr-2"
                      style={{ color: theme.colors.textPrimary }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-[14px] font-semibold"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {Math.round(item.progress_percentage || 0)}%
                    </Text>
                  </View>

                  <ProgressChart
                    percentage={item.progress_percentage || 0}
                    height={8}
                    style={{ marginBottom: 12 }}
                  />

                  <View className="flex-row justify-between items-center">
                    <Text className="text-[12px]" style={{ color: theme.colors.textSecondary }}>
                      Terkumpul:{' '}
                      <CurrencyText
                        amount={Number(item.saved_amount || 0)}
                        style={{ fontWeight: '600' }}
                      />
                    </Text>
                    <Text className="text-[12px]" style={{ color: theme.colors.textSecondary }}>
                      Target:{' '}
                      <CurrencyText
                        amount={Number(item.target_amount || 0)}
                        style={{ fontWeight: '600' }}
                      />
                    </Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

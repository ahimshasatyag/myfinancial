import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { useBudgets } from '../hooks/useBudgets';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const BudgetListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { data: budgets, isLoading, refetch } = useBudgets();

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Alokasi Anggaran"
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Plus size={20} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.BUDGETS.NEW as any),
              },
            ]}
          />
        }
      />
      <View style={styles.content}>
        {budgets?.length === 0 ? (
          <GlassCard>
            <EmptyState
              title="Belum ada anggaran"
              description="Tetapkan batas pengeluaran bulanan agar keuangan tetap terkontrol."
              actionTitle="Buat Anggaran"
              onAction={() => router.push(ROUTES.BUDGETS.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={budgets || []}
            keyExtractor={(item) => item.budget_id}
            onRefresh={refetch}
            refreshing={isLoading}
            renderItem={({ item }) => (
              <GlassCard style={styles.card}>
                <View style={styles.topRow}>
                  <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
                    {item.budget_name}
                  </Text>
                  <Text style={[styles.percent, { color: theme.colors.textSecondary }]}>
                    {Math.round(item.percentage_used || 0)}%
                  </Text>
                </View>
                <ProgressChart percentage={item.percentage_used || 0} height={10} style={styles.progress} />
                <View style={styles.bottomRow}>
                  <Text style={[styles.spent, { color: theme.colors.textSecondary }]}>
                    Terpakai:{' '}
                    <CurrencyText amount={Number(item.total_spent || 0)} style={styles.bold} />
                  </Text>
                  <Text style={[styles.total, { color: theme.colors.textSecondary }]}>
                    Batas:{' '}
                    <CurrencyText amount={Number(item.total_budget || 0)} style={styles.bold} />
                  </Text>
                </View>
              </GlassCard>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 18,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  percent: {
    fontSize: 14,
    fontWeight: '600',
  },
  progress: {
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spent: {
    fontSize: 12,
  },
  total: {
    fontSize: 12,
  },
  bold: {
    fontWeight: '600',
  },
});

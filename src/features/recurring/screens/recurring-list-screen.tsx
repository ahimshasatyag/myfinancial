import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Repeat } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { CurrencyText } from '../../../components/common/currency-text';
import { EmptyState } from '../../../components/common/empty-state';
import { useRecurring } from '../hooks/useRecurring';
import { useTheme } from '../../../providers/theme-provider';

export const RecurringListScreen: React.FC = () => {
  const { theme } = useTheme();
  const { data: recurring, isLoading, refetch } = useRecurring();

  return (
    <ScreenContainer>
      <ScreenHeader title="Transaksi Berulang" showBack />
      <View style={styles.content}>
        {recurring?.length === 0 ? (
          <GlassCard>
            <EmptyState
              icon={<Repeat size={36} color={theme.colors.textMuted} />}
              title="Belum ada transaksi berulang"
              description="Jadwalkan langganan, tagihan rutin, atau gaji bulanan Anda."
            />
          </GlassCard>
        ) : (
          <FlatList
            data={recurring || []}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={isLoading}
            renderItem={({ item }) => (
              <GlassCard style={styles.card}>
                <View style={styles.left}>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.freq, { color: theme.colors.textSecondary }]}>
                    Setiap {item.frequency} • Jatuh tempo: {item.next_run_date}
                  </Text>
                </View>
                <CurrencyText
                  amount={item.transaction_type === 'income' ? Number(item.amount) : -Number(item.amount)}
                  colored
                  showSign
                  style={styles.amount}
                />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  freq: {
    fontSize: 12,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});

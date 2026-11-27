import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  HandCoins,
  Landmark,
  Repeat,
  Tag,
  Target,
  TrendingUp,
} from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

interface QuickActionItem {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const iconColor = theme.colors.textPrimary;

  const rows: QuickActionItem[][] = [
    [
      {
        label: 'Pemasukan',
        icon: <ArrowDownLeft size={20} color={iconColor} />,
        onPress: () =>
          router.push({ pathname: ROUTES.TRANSACTIONS.NEW as any, params: { type: 'income' } }),
      },
      {
        label: 'Pengeluaran',
        icon: <ArrowUpRight size={20} color={iconColor} />,
        onPress: () =>
          router.push({ pathname: ROUTES.TRANSACTIONS.NEW as any, params: { type: 'expense' } }),
      },
      {
        label: 'Akun',
        icon: <Landmark size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.ACCOUNTS.LIST as any),
      },
      {
        label: 'Kategori',
        icon: <Tag size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.CATEGORIES.LIST as any),
      },
    ],
    [
      {
        label: 'Investasi',
        icon: <TrendingUp size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.INVESTMENTS.LIST as any),
      },
      {
        label: 'Utang',
        icon: <HandCoins size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.DEBTS.LIST as any),
      },
      {
        label: 'Goals',
        icon: <Target size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.TABS.GOALS as any),
      },
      {
        label: 'Automasi',
        icon: <Repeat size={20} color={iconColor} />,
        onPress: () => router.push(ROUTES.RECURRING.LIST as any),
      },
    ],
  ];

  return (
    <GlassCard style={styles.card} contentStyle={styles.cardContent}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Menu Utama</Text>
      </View>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((act) => (
              <TouchableOpacity
                key={act.label}
                activeOpacity={0.75}
                onPress={act.onPress}
                accessibilityLabel={act.label}
                style={styles.item}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: theme.colors.cardMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  {act.icon}
                </View>
                <Text
                  numberOfLines={1}
                  style={[styles.label, { color: theme.colors.textSecondary }]}
                >
                  {act.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardContent: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});

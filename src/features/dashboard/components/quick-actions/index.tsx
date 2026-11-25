import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Landmark, Tag } from 'lucide-react-native';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const actions = [
    {
      label: 'Pemasukan',
      icon: <ArrowDownLeft size={21} color={theme.colors.textPrimary} />,
      onPress: () =>
        router.push({ pathname: ROUTES.TRANSACTIONS.NEW as any, params: { type: 'income' } }),
    },
    {
      label: 'Pengeluaran',
      icon: <ArrowUpRight size={21} color={theme.colors.textPrimary} />,
      onPress: () =>
        router.push({ pathname: ROUTES.TRANSACTIONS.NEW as any, params: { type: 'expense' } }),
    },
    {
      label: 'Akun',
      icon: <Landmark size={21} color={theme.colors.textPrimary} />,
      onPress: () => router.push(ROUTES.ACCOUNTS.LIST as any),
    },
    {
      label: 'Kategori',
      icon: <Tag size={21} color={theme.colors.textPrimary} />,
      onPress: () => router.push(ROUTES.CATEGORIES.LIST as any),
    },
  ];

  return (
    <View className="flex-row justify-between mb-5 px-1">
      {actions.map((act) => (
        <TouchableOpacity
          key={act.label}
          activeOpacity={0.75}
          onPress={act.onPress}
          accessibilityLabel={act.label}
          className="items-center flex-1"
        >
          <View
            className="w-13 h-13 rounded-2xl border items-center justify-center mb-1.5"
            style={{
              width: 52,
              height: 52,
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }}
          >
            {act.icon}
          </View>
          <Text className="text-[11px] font-medium" style={{ color: theme.colors.textSecondary }}>
            {act.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

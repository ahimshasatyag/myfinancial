import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Clock, XCircle } from 'lucide-react-native';
import { CurrencyText } from '../../../../components/common/currency-text';
import { DateText } from '../../../../components/common/date-text';
import { TransactionStatus } from '../../../../types/database.types';
import { useTheme } from '../../../../providers/theme-provider';

export interface TransactionCardProps {
  title: string;
  amount: number;
  currencyCode?: string;
  type: 'income' | 'expense';
  status?: TransactionStatus;
  date: string;
  categoryName?: string;
  accountName?: string;
  onPress: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  title,
  amount,
  currencyCode = 'IDR',
  type,
  status = 'completed',
  date,
  categoryName,
  accountName,
  onPress,
}) => {
  const { theme } = useTheme();
  const isIncome = type === 'income';
  const isCancelled = status === 'cancelled';
  const isPending = status === 'pending';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 px-4"
      style={{ opacity: isCancelled ? 0.5 : 1 }}
    >
      <View className="flex-row items-center flex-1 mr-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: theme.colors.cardMuted }}
        >
          {isCancelled ? (
            <XCircle size={18} color={theme.colors.textMuted} />
          ) : isPending ? (
            <Clock size={18} color={theme.colors.textSecondary} />
          ) : isIncome ? (
            <ArrowDownLeft size={18} color={theme.colors.textPrimary} />
          ) : (
            <ArrowUpRight size={18} color={theme.colors.textPrimary} />
          )}
        </View>
        <View className="flex-1">
          <Text
            className="text-[15px] font-semibold mb-0.5"
            style={{
              color: theme.colors.textPrimary,
              textDecorationLine: isCancelled ? 'line-through' : 'none',
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <Text className="text-xs" style={{ color: theme.colors.textSecondary }}>
              {isIncome ? 'Income' : 'Expense'}
              {categoryName ? ` • ${categoryName}` : ''}
              {accountName ? ` • ${accountName}` : ''}
              {isPending ? ' • Pending' : isCancelled ? ' • Batal' : ''}
            </Text>
            <Text className="text-xs mx-1" style={{ color: theme.colors.textMuted }}>
              •
            </Text>
            <DateText date={date} format="relative" />
          </View>
        </View>
      </View>

      <CurrencyText
        amount={isIncome ? amount : -amount}
        currencyCode={currencyCode}
        showSign
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: isCancelled ? theme.colors.textMuted : theme.colors.textPrimary,
          textDecorationLine: isCancelled ? 'line-through' : 'none',
        }}
      />
    </TouchableOpacity>
  );
};

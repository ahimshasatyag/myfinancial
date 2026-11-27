import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Plus } from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { CurrencyText } from '../../../../components/common/currency-text';
import { CurrencyTotal } from '../../../../utils/transaction';
import { useUIStore } from '../../../../store/ui-store';
import { useTheme } from '../../../../providers/theme-provider';

export interface BalanceCardProps {
  totalBalance: number;
  currencyCode?: string;
  balancesByCurrency?: CurrencyTotal[];
  onAddTransaction?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  currencyCode = 'IDR',
  balancesByCurrency = [],
  onAddTransaction,
}) => {
  const { theme } = useTheme();
  const { isBalanceHidden, toggleBalanceHidden } = useUIStore();

  const otherCurrencies = balancesByCurrency.filter((b) => b.currencyCode !== currencyCode);

  return (
    <GlassCard variant="glass" intensity={55} style={{ marginBottom: 16 }}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Text
            className="text-[13px] font-medium mr-2"
            style={{ color: theme.colors.textSecondary }}
          >
            Total Saldo ({currencyCode})
          </Text>
          <TouchableOpacity
            onPress={toggleBalanceHidden}
            activeOpacity={0.7}
            accessibilityLabel={isBalanceHidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isBalanceHidden ? (
              <EyeOff size={16} color={theme.colors.textMuted} />
            ) : (
              <Eye size={16} color={theme.colors.textMuted} />
            )}
          </TouchableOpacity>
        </View>
        {onAddTransaction && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddTransaction}
            accessibilityLabel="Tambah transaksi baru"
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: theme.colors.button }}
          >
            <Plus size={16} color={theme.colors.buttonText} />
          </TouchableOpacity>
        )}
      </View>

      <CurrencyText
        amount={totalBalance}
        currencyCode={currencyCode}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={{ fontSize: 32, fontWeight: '800', letterSpacing: -0.5 }}
      />

      {otherCurrencies.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {otherCurrencies.map((item) => (
            <View
              key={item.currencyCode}
              className="px-2.5 py-1 rounded-full border flex-row items-center gap-1"
              style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.cardMuted }}
            >
              <Text className="text-[11px] font-semibold" style={{ color: theme.colors.textMuted }}>
                {item.currencyCode}
              </Text>
              <CurrencyText
                amount={item.total}
                currencyCode={item.currencyCode}
                style={{ fontSize: 11, fontWeight: '700' }}
              />
            </View>
          ))}
        </View>
      )}
    </GlassCard>
  );
};

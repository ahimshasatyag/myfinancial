import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { formatCurrency } from '../../../utils/currency';
import { useUIStore } from '../../../store/ui-store';
import { useTheme } from '../../../providers/theme-provider';

export interface CurrencyTextProps {
  amount: number;
  currencyCode?: string;
  style?: StyleProp<TextStyle>;
  colored?: boolean;
  showSign?: boolean;
}

export const CurrencyText: React.FC<CurrencyTextProps> = ({
  amount,
  currencyCode = 'IDR',
  style,
  colored = false,
  showSign = false,
}) => {
  const { theme } = useTheme();
  const isBalanceHidden = useUIStore((state) => state.isBalanceHidden);

  if (isBalanceHidden) {
    return <Text style={[{ color: theme.colors.textPrimary }, style]}>••••••••</Text>;
  }

  const formatted = formatCurrency(amount, currencyCode);
  const sign = showSign && amount > 0 ? '+' : '';

  let color: string = theme.colors.textPrimary;
  if (colored) {
    if (amount > 0) color = theme.colors.success;
    else if (amount < 0) color = theme.colors.danger;
  }

  return (
    <Text style={[{ color }, style]}>
      {sign}
      {formatted}
    </Text>
  );
};

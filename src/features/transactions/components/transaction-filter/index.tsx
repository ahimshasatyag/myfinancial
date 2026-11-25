import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../../providers/theme-provider';

export interface TransactionFilterProps {
  currentType: 'all' | 'income' | 'expense';
  onSelectType: (type: 'all' | 'income' | 'expense') => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  currentType,
  onSelectType,
}) => {
  const { theme } = useTheme();

  const options: { label: string; value: 'all' | 'income' | 'expense' }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Pengeluaran', value: 'expense' },
    { label: 'Pemasukan', value: 'income' },
  ];

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = currentType === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelectType(opt.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.colors.button : theme.colors.card,
                borderColor: active ? theme.colors.button : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: active ? theme.colors.buttonText : theme.colors.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});

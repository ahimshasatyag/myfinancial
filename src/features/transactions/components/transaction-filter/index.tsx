import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { GlassBottomSheet } from '../../../../components/ui/glass-bottom-sheet';
import { useTheme } from '../../../../providers/theme-provider';

export type TransactionTypeFilter = 'all' | 'income' | 'expense';

export interface AccountFilterOption {
  id: string;
  name: string;
}

export interface TransactionFilterProps {
  currentType: TransactionTypeFilter;
  onSelectType: (type: TransactionTypeFilter) => void;
  accounts: AccountFilterOption[];
  currentAccountId: string;
  onSelectAccount: (accountId: string) => void;
}

const typeOptions: { label: string; value: TransactionTypeFilter }[] = [
  { label: 'Semua Tipe', value: 'all' },
  { label: 'Pengeluaran', value: 'expense' },
  { label: 'Pemasukan', value: 'income' },
];

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  currentType,
  onSelectType,
  accounts,
  currentAccountId,
  onSelectAccount,
}) => {
  const { theme, isDark } = useTheme();
  const [activeModal, setActiveModal] = useState<'type' | 'account' | null>(null);

  const accountOptions = useMemo(
    () => [
      { label: 'Semua Akun', value: 'all' },
      ...accounts.map((acc) => ({ label: acc.name, value: acc.id })),
    ],
    [accounts]
  );

  const selectedTypeLabel =
    typeOptions.find((o) => o.value === currentType)?.label || 'Semua Tipe';
  const selectedAccountLabel =
    accountOptions.find((o) => o.value === currentAccountId)?.label || 'Semua Akun';

  const isTypeFiltered = currentType !== 'all';
  const isAccountFiltered = currentAccountId !== 'all';

  return (
    <>
      <View className="flex-row gap-2.5 mb-3.5">
        {/* Dropdown 1: Tipe Transaksi */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setActiveModal('type')}
          className="flex-1 flex-row items-center justify-between px-3 py-2.5 rounded-xl border"
          style={{
            backgroundColor: isTypeFiltered
              ? isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : '#F3F4F6'
              : isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : '#F9FAFB',
            borderColor: isTypeFiltered
              ? theme.colors.button
              : isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <View className="flex-row items-center gap-1 flex-1 mr-1.5">
            <Text className="text-[12px] font-medium" style={{ color: theme.colors.textSecondary }}>
              Tipe:
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12px] shrink"
              style={{
                color: isTypeFiltered ? theme.colors.button : theme.colors.textPrimary,
                fontWeight: isTypeFiltered ? '700' : '500',
              }}
            >
              {selectedTypeLabel}
            </Text>
          </View>
          <ChevronDown size={15} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Dropdown 2: Filter Akun */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setActiveModal('account')}
          className="flex-1 flex-row items-center justify-between px-3 py-2.5 rounded-xl border"
          style={{
            backgroundColor: isAccountFiltered
              ? isDark
                ? 'rgba(255, 255, 255, 0.12)'
                : '#F3F4F6'
              : isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : '#F9FAFB',
            borderColor: isAccountFiltered
              ? theme.colors.button
              : isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <View className="flex-row items-center gap-1 flex-1 mr-1.5">
            <Text className="text-[12px] font-medium" style={{ color: theme.colors.textSecondary }}>
              Akun:
            </Text>
            <Text
              numberOfLines={1}
              className="text-[12px] shrink"
              style={{
                color: isAccountFiltered ? theme.colors.button : theme.colors.textPrimary,
                fontWeight: isAccountFiltered ? '700' : '500',
              }}
            >
              {selectedAccountLabel}
            </Text>
          </View>
          <ChevronDown size={15} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Picker Modal */}
      <GlassBottomSheet
        visible={activeModal !== null}
        onClose={() => setActiveModal(null)}
      >
        <View
          className="pb-3.5 mb-2 border-b"
          style={{ borderBottomColor: 'rgba(150, 150, 150, 0.2)' }}
        >
          <Text className="text-[16px] font-bold" style={{ color: theme.colors.textPrimary }}>
            {activeModal === 'type' ? 'Pilih Tipe Transaksi' : 'Pilih Akun'}
          </Text>
        </View>

        <ScrollView className="max-h-72 py-1.5" showsVerticalScrollIndicator={false}>
          <View className="gap-1">
            {(activeModal === 'type' ? typeOptions : accountOptions).map((opt) => {
              const isSelected =
                activeModal === 'type'
                  ? currentType === opt.value
                  : currentAccountId === opt.value;

              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (activeModal === 'type') {
                      onSelectType(opt.value as TransactionTypeFilter);
                    } else {
                      onSelectAccount(opt.value);
                    }
                    setActiveModal(null);
                  }}
                  className="flex-row items-center justify-between py-3 px-3 rounded-[10px]"
                  style={
                    isSelected
                      ? {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.04)',
                        }
                      : undefined
                  }
                >
                  <Text
                    className="text-[14px]"
                    style={{
                      color: isSelected ? theme.colors.button : theme.colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Check size={18} color={theme.colors.button} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </GlassBottomSheet>
    </>
  );
};

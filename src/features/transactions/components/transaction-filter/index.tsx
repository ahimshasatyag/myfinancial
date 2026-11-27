import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';
import { GlassBottomSheet } from '../../../../components/ui/glass-bottom-sheet';
import { useTheme } from '../../../../providers/theme-provider';

export type TransactionTypeFilter = 'all' | 'income' | 'expense';
export type TransactionStatusFilter = 'all' | 'completed' | 'pending' | 'cancelled';

export interface TransactionFilterProps {
  currentType: TransactionTypeFilter;
  onSelectType: (type: TransactionTypeFilter) => void;
  currentStatus: TransactionStatusFilter;
  onSelectStatus: (status: TransactionStatusFilter) => void;
}

const typeOptions: { label: string; value: TransactionTypeFilter }[] = [
  { label: 'Semua Tipe', value: 'all' },
  { label: 'Pengeluaran', value: 'expense' },
  { label: 'Pemasukan', value: 'income' },
];

const statusOptions: { label: string; value: TransactionStatusFilter }[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Batal', value: 'cancelled' },
];

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  currentType,
  onSelectType,
  currentStatus,
  onSelectStatus,
}) => {
  const { theme, isDark } = useTheme();
  const [activeModal, setActiveModal] = useState<'type' | 'status' | null>(null);

  const selectedTypeLabel =
    typeOptions.find((o) => o.value === currentType)?.label || 'Semua Tipe';
  const selectedStatusLabel =
    statusOptions.find((o) => o.value === currentStatus)?.label || 'Semua Status';

  const isTypeFiltered = currentType !== 'all';
  const isStatusFiltered = currentStatus !== 'all';

  return (
    <>
      <View style={styles.container}>
        {/* Dropdown 1: Tipe Transaksi */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setActiveModal('type')}
          style={[
            styles.dropdownBtn,
            {
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
            },
          ]}
        >
          <View style={styles.btnContent}>
            <Text style={[styles.btnLabel, { color: theme.colors.textSecondary }]}>Tipe:</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.btnValue,
                {
                  color: isTypeFiltered ? theme.colors.button : theme.colors.textPrimary,
                  fontWeight: isTypeFiltered ? '700' : '500',
                },
              ]}
            >
              {selectedTypeLabel}
            </Text>
          </View>
          <ChevronDown size={15} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Dropdown 2: Status Transaksi */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setActiveModal('status')}
          style={[
            styles.dropdownBtn,
            {
              backgroundColor: isStatusFiltered
                ? isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : '#F3F4F6'
                : isDark
                ? 'rgba(255, 255, 255, 0.05)'
                : '#F9FAFB',
              borderColor: isStatusFiltered
                ? theme.colors.button
                : isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
        >
          <View style={styles.btnContent}>
            <Text style={[styles.btnLabel, { color: theme.colors.textSecondary }]}>Status:</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.btnValue,
                {
                  color: isStatusFiltered ? theme.colors.button : theme.colors.textPrimary,
                  fontWeight: isStatusFiltered ? '700' : '500',
                },
              ]}
            >
              {selectedStatusLabel}
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
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: theme.colors.textPrimary }]}>
            {activeModal === 'type' ? 'Pilih Tipe Transaksi' : 'Pilih Status Transaksi'}
          </Text>
        </View>

        <View style={styles.optionsList}>
          {(activeModal === 'type' ? typeOptions : statusOptions).map((opt) => {
            const isSelected =
              activeModal === 'type'
                ? currentType === opt.value
                : currentStatus === opt.value;

            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => {
                  if (activeModal === 'type') {
                    onSelectType(opt.value as TransactionTypeFilter);
                  } else {
                    onSelectStatus(opt.value as TransactionStatusFilter);
                  }
                  setActiveModal(null);
                }}
                style={[
                  styles.optionRow,
                  isSelected && {
                    backgroundColor: isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: isSelected ? theme.colors.button : theme.colors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {isSelected && <Check size={18} color={theme.colors.button} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  dropdownBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 6,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  btnValue: {
    fontSize: 12,
    flexShrink: 1,
  },
  sheetHeader: {
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionsList: {
    paddingVertical: 6,
    gap: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionLabel: {
    fontSize: 14,
  },
});

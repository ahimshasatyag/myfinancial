import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '../../../../components/ui/glass-card';
import { GlassInput } from '../../../../components/ui/glass-input';
import { GlassButton } from '../../../../components/ui/glass-button';
import { TRANSACTION_TYPES, PAYMENT_METHODS } from '../../../../constants/transaction';
import { SUPPORTED_CURRENCIES } from '../../../../constants/currency';
import { ROUTES } from '../../../../constants/routes';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from '../../../../types/database.types';
import { CreateTransactionInput } from '../../types/transaction.types';
import { useTheme } from '../../../../providers/theme-provider';
import { parseCurrencyInput, formatCurrency } from '../../../../utils/currency';
import { getTodayDateString } from '../../../../utils/date';

const STATUS_OPTIONS: { label: string; value: TransactionStatus }[] = [
  { label: 'Selesai', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Batal', value: 'cancelled' },
];

export interface TransactionFormAccountOption {
  id: string;
  name: string;
  currencyCode: string;
}

export interface TransactionFormCategoryOption {
  id: string;
  name: string;
  transactionType: TransactionType;
}

export interface TransactionFormProps {
  initialType?: TransactionType;
  initialAccountId?: string;
  initialValues?: Partial<CreateTransactionInput>;
  submitLabel?: string;
  accounts: TransactionFormAccountOption[];
  categories: TransactionFormCategoryOption[];
  errors?: Record<string, string>;
  formError?: string | null;
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialType = 'expense',
  initialAccountId,
  initialValues,
  submitLabel = 'Simpan Transaksi',
  accounts,
  categories,
  errors = {},
  formError,
  onSubmit,
  loading = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  const [type, setType] = useState<TransactionType>(
    initialValues?.transactionType || initialType
  );
  const [selectedAccountId, setSelectedAccountId] = useState(
    initialValues?.accountId || initialAccountId || accounts[0]?.id || ''
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialValues?.categoryId || ''
  );
  const [amountStr, setAmountStr] = useState(
    initialValues?.amount
      ? formatCurrency(initialValues.amount, initialValues.currencyCode || 'IDR', {
          showSymbol: false,
        })
      : ''
  );
  const [title, setTitle] = useState(initialValues?.title || '');
  const [merchant, setMerchant] = useState(initialValues?.merchant || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    initialValues?.paymentMethod ?? 'cash'
  );
  const [date, setDate] = useState(initialValues?.transactionDate || getTodayDateString());
  const [referenceNumber, setReferenceNumber] = useState(initialValues?.referenceNumber || '');
  const [status, setStatus] = useState<TransactionStatus>(initialValues?.status || 'completed');
  const [notes, setNotes] = useState(initialValues?.notes || '');

  // Pastikan default account terpilih ketika data accounts selesai dimuat
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(initialAccountId || accounts[0].id);
    }
  }, [accounts, selectedAccountId, initialAccountId]);

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId),
    [accounts, selectedAccountId]
  );
  const currencyCode = selectedAccount?.currencyCode || initialValues?.currencyCode || 'IDR';

  // PRD §10.5: hanya tampilkan kategori yang sesuai tipe transaksi (income/expense)
  const filteredCategories = useMemo(
    () => categories.filter((c) => c.transactionType === type),
    [categories, type]
  );

  // Reset kategori jika berpindah tipe dan kategori saat ini tidak cocok
  useEffect(() => {
    if (
      selectedCategoryId &&
      !filteredCategories.some((c) => c.id === selectedCategoryId)
    ) {
      setSelectedCategoryId('');
    }
  }, [type, filteredCategories, selectedCategoryId]);

  const handleAmountChange = (text: string) => {
    const decimalDigits = SUPPORTED_CURRENCIES[currencyCode]?.decimalDigits ?? 0;
    if (decimalDigits > 0) {
      setAmountStr(text.replace(/[^0-9.,]/g, ''));
      return;
    }
    const numeric = parseCurrencyInput(text);
    setAmountStr(numeric ? formatCurrency(numeric, currencyCode, { showSymbol: false }) : '');
  };

  const handleSubmit = async () => {
    const decimalDigits = SUPPORTED_CURRENCIES[currencyCode]?.decimalDigits ?? 0;
    const rawAmount = parseCurrencyInput(amountStr, { allowDecimals: decimalDigits > 0 });

    await onSubmit({
      transactionType: type,
      amount: rawAmount,
      currencyCode,
      title,
      accountId: selectedAccountId,
      categoryId: selectedCategoryId || null,
      merchant: merchant || null,
      paymentMethod,
      transactionDate: date,
      referenceNumber: referenceNumber || null,
      status,
      notes: notes || null,
    });
  };

  return (
    <View className="py-2 pb-10">
      {formError && (
        <View
          className="p-3 rounded-xl border mb-4"
          style={{ backgroundColor: theme.colors.dangerBg, borderColor: theme.colors.danger }}
        >
          <Text className="text-[13px] text-center font-medium" style={{ color: theme.colors.danger }}>
            {formError}
          </Text>
        </View>
      )}

      {/* Type Toggle */}
      <View
        className="flex-row rounded-2xl p-1 mb-4"
        style={{ backgroundColor: theme.colors.cardMuted }}
      >
        {TRANSACTION_TYPES.map((t) => {
          const isActive = type === t.value;
          return (
            <TouchableOpacity
              key={t.value}
              activeOpacity={0.75}
              onPress={() => setType(t.value)}
              className="flex-1 py-2.5 items-center justify-center rounded-xl"
              style={isActive ? { backgroundColor: theme.colors.button } : undefined}
            >
              <Text
                className="text-sm"
                style={{
                  color: isActive ? theme.colors.buttonText : theme.colors.textSecondary,
                  fontWeight: isActive ? '600' : '500',
                }}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <GlassCard style={{ marginBottom: 16 }}>
        {/* Amount Input */}
        <GlassInput
          label={`Nominal (${currencyCode})`}
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={handleAmountChange}
          error={errors.amount}
          style={{ fontSize: 22, fontWeight: '700' }}
        />

        {/* Title Input */}
        <GlassInput
          label="Judul Transaksi"
          placeholder={type === 'income' ? 'Contoh: Gaji Bulanan' : 'Contoh: Makan Siang'}
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        {/* Account Selector */}
        <View className="mb-4">
          <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
            Pilih Akun / Dompet
          </Text>
          {accounts.length === 0 ? (
            <GlassButton
              title="+ Buat Akun Terlebih Dahulu"
              variant="outline"
              size="sm"
              onPress={() => router.push(ROUTES.ACCOUNTS.NEW as any)}
            />
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    activeOpacity={0.75}
                    onPress={() => setSelectedAccountId(acc.id)}
                    className="px-3.5 py-2 rounded-full border"
                    style={{
                      backgroundColor: isSelected ? theme.colors.button : theme.colors.input,
                      borderColor: isSelected ? theme.colors.button : theme.colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: isSelected ? theme.colors.buttonText : theme.colors.textPrimary }}
                    >
                      {acc.name} ({acc.currencyCode})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {errors.accountId && (
            <Text className="text-xs mt-1" style={{ color: theme.colors.danger }}>
              {errors.accountId}
            </Text>
          )}
        </View>

        {/* Category Selector (filtered by transactionType) */}
        <View className="mb-4">
          <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
            Kategori ({type === 'income' ? 'Pemasukan' : 'Pengeluaran'})
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.75}
                  onPress={() => setSelectedCategoryId(isSelected ? '' : cat.id)}
                  className="px-3.5 py-2 rounded-full border"
                  style={{
                    backgroundColor: isSelected ? theme.colors.button : theme.colors.input,
                    borderColor: isSelected ? theme.colors.button : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: isSelected ? theme.colors.buttonText : theme.colors.textPrimary }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date */}
        <GlassInput
          label="Tanggal (YYYY-MM-DD)"
          placeholder="2026-11-25"
          value={date}
          onChangeText={setDate}
          error={errors.transactionDate}
        />

        {/* Payment Method */}
        <View className="mb-4">
          <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
            Metode Pembayaran
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = paymentMethod === pm.value;
              return (
                <TouchableOpacity
                  key={pm.value}
                  activeOpacity={0.75}
                  onPress={() => setPaymentMethod(pm.value)}
                  className="px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: isSelected ? theme.colors.button : theme.colors.input,
                    borderColor: isSelected ? theme.colors.button : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: isSelected ? theme.colors.buttonText : theme.colors.textPrimary }}
                  >
                    {pm.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Status (PRD §13.3: pending/cancelled tidak memengaruhi saldo & laporan) */}
        <View className="mb-4">
          <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
            Status Transaksi
          </Text>
          <View className="flex-row gap-2">
            {STATUS_OPTIONS.map((st) => {
              const isSelected = status === st.value;
              return (
                <TouchableOpacity
                  key={st.value}
                  activeOpacity={0.75}
                  onPress={() => setStatus(st.value)}
                  className="px-3.5 py-2 rounded-full border"
                  style={{
                    backgroundColor: isSelected ? theme.colors.button : theme.colors.input,
                    borderColor: isSelected ? theme.colors.button : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: isSelected ? theme.colors.buttonText : theme.colors.textPrimary }}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <GlassInput
          label="Merchant / Sumber (Opsional)"
          placeholder="Contoh: Kopi Kenangan, PT Maju Jaya"
          value={merchant}
          onChangeText={setMerchant}
        />

        <GlassInput
          label="Nomor Referensi (Opsional)"
          placeholder="No. struk / invoice"
          value={referenceNumber}
          onChangeText={setReferenceNumber}
        />

        <GlassInput
          label="Catatan Tambahan (Opsional)"
          placeholder="Keterangan..."
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </GlassCard>

      <GlassButton
        title={submitLabel}
        onPress={handleSubmit}
        loading={loading}
        size="lg"
        className="w-full"
      />
    </View>
  );
};

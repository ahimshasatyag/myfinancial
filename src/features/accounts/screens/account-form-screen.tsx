import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { AppSwitch } from '../../../components/ui/app-switch';
import { LoadingOverlay } from '../../../components/common/loading-overlay';
import { useAccountDetail, useAccounts } from '../hooks/useAccounts';
import { createAccountSchema, extractZodFieldErrors } from '../schemas/account.schema';
import { ACCOUNT_TYPE_OPTIONS } from '../types/account.types';
import { AccountType } from '../../../types/database.types';
import { SUPPORTED_CURRENCIES } from '../../../constants/currency';
import { parseCurrencyInput } from '../../../utils/currency';
import { useTheme } from '../../../providers/theme-provider';

const CURRENCY_CODES = Object.keys(SUPPORTED_CURRENCIES);

export const AccountFormScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const { theme } = useTheme();

  const { createAccount, updateAccount, isCreating, isUpdating } = useAccounts();
  const { data: existing, isLoading: isLoadingDetail } = useAccountDetail(id);

  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('bank');
  const [currencyCode, setCurrencyCode] = useState('IDR');
  const [institutionName, setInstitutionName] = useState('');
  const [last4, setLast4] = useState('');
  const [balanceStr, setBalanceStr] = useState('');
  const [includeInTotal, setIncludeInTotal] = useState(true);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (existing && isEdit) {
      setName(existing.name || '');
      setAccountType(existing.account_type);
      setCurrencyCode(existing.currency_code || 'IDR');
      setInstitutionName(existing.institution_name || '');
      setLast4(existing.account_number_last4 || '');
      setBalanceStr(String(existing.opening_balance ?? 0));
      setIncludeInTotal(existing.include_in_total ?? true);
      setNotes(existing.notes || '');
    }
  }, [existing, isEdit]);

  const handleSave = async () => {
    setFormError(null);
    const allowDecimals = (SUPPORTED_CURRENCIES[currencyCode]?.decimalDigits ?? 0) > 0;
    const openingBalance = parseCurrencyInput(balanceStr, {
      allowNegative: accountType === 'credit_card',
      allowDecimals,
    });

    const payload = {
      name,
      accountType,
      currencyCode,
      institutionName: institutionName || null,
      accountNumberLast4: last4.trim() || null,
      openingBalance,
      includeInTotal,
      notes: notes || null,
    };

    const parsed = createAccountSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(extractZodFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    try {
      if (isEdit && id) {
        await updateAccount({ id, input: parsed.data });
      } else {
        await createAccount(parsed.data);
      }
      router.back();
    } catch (e: any) {
      setFormError(e?.message || 'Gagal menyimpan akun');
    }
  };

  if (isEdit && isLoadingDetail) {
    return <LoadingOverlay visible message="Memuat data akun..." />;
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={isEdit ? 'Edit Akun' : 'Tambah Akun / Rekening'} showBack />
      <KeyboardWrapper className="px-4 pt-3 pb-10">
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

        <GlassCard style={{ marginBottom: 16 }}>
          <GlassInput
            label="Nama Akun"
            placeholder="Misal: BCA Utama, Dompet Tunai"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          {/* Account Type Selector */}
          <View className="mb-4">
            <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
              Jenis Akun
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {ACCOUNT_TYPE_OPTIONS.map((opt) => {
                const active = accountType === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.75}
                    onPress={() => setAccountType(opt.value)}
                    className="px-3.5 py-2 rounded-full border"
                    style={{
                      backgroundColor: active ? theme.colors.button : theme.colors.input,
                      borderColor: active ? theme.colors.button : theme.colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: active ? theme.colors.buttonText : theme.colors.textPrimary }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Currency Selector */}
          <View className="mb-4">
            <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
              Mata Uang
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CURRENCY_CODES.map((code) => {
                const active = currencyCode === code;
                return (
                  <TouchableOpacity
                    key={code}
                    activeOpacity={0.75}
                    onPress={() => setCurrencyCode(code)}
                    className="px-3.5 py-2 rounded-full border"
                    style={{
                      backgroundColor: active ? theme.colors.button : theme.colors.input,
                      borderColor: active ? theme.colors.button : theme.colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: active ? theme.colors.buttonText : theme.colors.textPrimary }}
                    >
                      {code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <GlassInput
            label={`Saldo Awal (${currencyCode})`}
            placeholder={accountType === 'credit_card' ? 'Contoh: -1000000 untuk tagihan awal' : '0'}
            keyboardType={accountType === 'credit_card' ? 'numbers-and-punctuation' : 'numeric'}
            value={balanceStr}
            onChangeText={setBalanceStr}
            helperText={
              accountType === 'credit_card'
                ? 'Utang awal kartu kredit dicatat sebagai angka negatif (sesuai PRD).'
                : undefined
            }
            error={errors.openingBalance}
          />

          <GlassInput
            label="Nama Institusi / Bank (Opsional)"
            placeholder="Misal: Bank Central Asia, GoPay"
            value={institutionName}
            onChangeText={setInstitutionName}
            error={errors.institutionName}
          />

          <GlassInput
            label="4 Digit Terakhir Rekening (Opsional)"
            placeholder="1234"
            keyboardType="number-pad"
            maxLength={4}
            value={last4}
            onChangeText={(t) => setLast4(t.replace(/[^0-9]/g, '').slice(0, 4))}
            error={errors.accountNumberLast4}
          />

          <GlassInput
            label="Catatan (Opsional)"
            placeholder="Keterangan tambahan..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View className="flex-row items-center justify-between pt-2">
            <View className="flex-1 mr-3">
              <Text className="text-sm font-medium" style={{ color: theme.colors.textPrimary }}>
                Masukkan ke Total Saldo
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: theme.colors.textSecondary }}>
                Hitung saldo akun ini dalam ringkasan total dashboard
              </Text>
            </View>
            <AppSwitch value={includeInTotal} onValueChange={setIncludeInTotal} />
          </View>
        </GlassCard>

        <GlassButton
          title={isEdit ? 'Simpan Perubahan' : 'Simpan Akun'}
          onPress={handleSave}
          loading={isCreating || isUpdating}
          size="lg"
          className="w-full"
        />
      </KeyboardWrapper>
    </ScreenContainer>
  );
};

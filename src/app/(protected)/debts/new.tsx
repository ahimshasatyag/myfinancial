import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useDebts } from '../../../features/debts/hooks/useDebts';
import { DebtType } from '../../../features/debts/services/debtService';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';

export default function NewDebtScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createDebt, isCreating } = useDebts();

  const [type, setType] = useState<DebtType>('payable');
  const [title, setTitle] = useState('');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [principalStr, setPrincipalStr] = useState('');
  const [paidStr, setPaidStr] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);
    const trimmedTitle = title.trim();
    const trimmedCounterparty = counterpartyName.trim();
    const principalAmount = parseCurrencyInput(principalStr);
    const paidAmount = paidStr.trim() ? parseCurrencyInput(paidStr) : 0;

    if (!trimmedTitle) {
      setErrorMsg('Judul utang/piutang wajib diisi.');
      return;
    }
    if (!trimmedCounterparty) {
      setErrorMsg('Nama pihak (pemberi/peminjam) wajib diisi.');
      return;
    }
    if (principalAmount <= 0) {
      setErrorMsg('Total nominal harus lebih dari 0.');
      return;
    }
    if (dueDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate.trim())) {
      setErrorMsg('Format tanggal jatuh tempo harus YYYY-MM-DD (contoh: 2026-12-31).');
      return;
    }

    try {
      await createDebt({
        type,
        title: trimmedTitle,
        counterpartyName: trimmedCounterparty,
        principalAmount,
        paidAmount,
        dueDate: dueDate.trim() || null,
        notes: notes.trim() || null,
      });
      router.back();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan catatan utang.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Catat Utang / Piutang" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassCard style={styles.formCard} contentStyle={styles.formContent}>
          <Text style={[styles.typeLabel, { color: theme.colors.textSecondary }]}>Jenis</Text>
          <View style={styles.typeRow}>
            {(['payable', 'receivable'] as DebtType[]).map((t) => {
              const active = type === t;
              return (
                <TouchableOpacity
                  key={t}
                  activeOpacity={0.75}
                  onPress={() => setType(t)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: active ? theme.colors.button : theme.colors.cardMuted,
                      borderColor: active ? theme.colors.button : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: active ? theme.colors.buttonText : theme.colors.textSecondary },
                    ]}
                  >
                    {t === 'payable' ? 'Utang (Kewajiban)' : 'Piutang (Tagihan)'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <GlassInput
            label="Judul"
            placeholder={type === 'payable' ? 'Misal: Cicilan Motor, Paylater' : 'Misal: Pinjaman Budi'}
            value={title}
            onChangeText={setTitle}
          />
          <GlassInput
            label={type === 'payable' ? 'Pemberi Pinjaman / Bank' : 'Nama Peminjam'}
            placeholder={type === 'payable' ? 'Misal: Bank BCA, Andi' : 'Misal: Budi Santoso'}
            value={counterpartyName}
            onChangeText={setCounterpartyName}
          />
          <GlassInput
            label="Total Nominal (Rp)"
            placeholder="0"
            keyboardType="numeric"
            value={principalStr}
            onChangeText={setPrincipalStr}
          />
          <GlassInput
            label="Sudah Dibayar (Rp, Opsional)"
            placeholder="0"
            keyboardType="numeric"
            value={paidStr}
            onChangeText={setPaidStr}
          />
          <GlassInput
            label="Tanggal Jatuh Tempo (YYYY-MM-DD, Opsional)"
            placeholder="2026-12-31"
            value={dueDate}
            onChangeText={setDueDate}
          />
          <GlassInput
            label="Catatan (Opsional)"
            placeholder="Bunga, cicilan per bulan, dll..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {errorMsg ? (
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errorMsg}</Text>
          ) : null}

          <GlassButton
            title="Simpan Catatan"
            onPress={handleSave}
            loading={isCreating}
            size="lg"
            style={styles.btn}
          />
        </GlassCard>
      </KeyboardWrapper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  formCard: {
    marginBottom: 24,
  },
  formContent: {
    padding: 18,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  btn: {
    marginTop: 12,
  },
});

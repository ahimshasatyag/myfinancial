import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useSavings } from '../../../features/savings/hooks/useSavings';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';

export default function NewSavingsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createGoal, isCreating } = useSavings();

  const [name, setName] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [initialAmountStr, setInitialAmountStr] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);
    const trimmedName = name.trim();
    const targetAmount = parseCurrencyInput(targetAmountStr);
    const currentAmount = initialAmountStr.trim() ? parseCurrencyInput(initialAmountStr) : 0;

    if (!trimmedName) {
      setErrorMsg('Nama goal wajib diisi.');
      return;
    }
    if (targetAmount <= 0) {
      setErrorMsg('Target nominal harus lebih dari 0.');
      return;
    }
    if (targetDate.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(targetDate.trim())) {
      setErrorMsg('Format tanggal harus YYYY-MM-DD (contoh: 2026-12-31).');
      return;
    }

    try {
      await createGoal({
        name: trimmedName,
        targetAmount,
        currentAmount,
        targetDate: targetDate.trim() || null,
        description: description.trim() || null,
      });
      router.back();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan goal. Silakan coba lagi.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Buat Goal Baru" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassCard style={styles.formCard} contentStyle={styles.formContent}>
          <GlassInput
            label="Nama Goal"
            placeholder="Misal: Dana Darurat, Laptop Baru, Liburan"
            value={name}
            onChangeText={setName}
          />
          <GlassInput
            label="Target Nominal (Rp)"
            placeholder="0"
            keyboardType="numeric"
            value={targetAmountStr}
            onChangeText={setTargetAmountStr}
          />
          <GlassInput
            label="Dana Awal Terkumpul (Rp, Opsional)"
            placeholder="0"
            keyboardType="numeric"
            value={initialAmountStr}
            onChangeText={setInitialAmountStr}
          />
          <GlassInput
            label="Target Tanggal (YYYY-MM-DD, Opsional)"
            placeholder="2026-12-31"
            value={targetDate}
            onChangeText={setTargetDate}
          />
          <GlassInput
            label="Catatan / Deskripsi (Opsional)"
            placeholder="Rencana menabung per bulan..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {errorMsg ? (
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>{errorMsg}</Text>
          ) : null}

          <GlassButton
            title="Simpan Goal"
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
  errorText: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  btn: {
    marginTop: 12,
  },
});

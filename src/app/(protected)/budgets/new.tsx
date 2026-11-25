import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useBudgets } from '../../../features/budgets/hooks/useBudgets';
import { parseCurrencyInput } from '../../../utils/currency';
import { getMonthStartAndEnd } from '../../../utils/date';

export default function NewBudgetScreen() {
  const router = useRouter();
  const { createBudget, isCreating } = useBudgets();
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    const { startDate, endDate } = getMonthStartAndEnd();
    await createBudget({
      name,
      totalAmount: parseCurrencyInput(amountStr),
      startDate,
      endDate,
    });
    router.back();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Buat Anggaran Baru" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassInput
          label="Nama Anggaran"
          placeholder="Misal: Anggaran Bulanan Umum"
          value={name}
          onChangeText={setName}
        />
        <GlassInput
          label="Batas Maksimal Pengeluaran (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        <GlassButton
          title="Simpan Anggaran"
          onPress={handleSave}
          loading={isCreating}
          size="lg"
          style={styles.btn}
        />
      </KeyboardWrapper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  btn: {
    marginTop: 16,
  },
});

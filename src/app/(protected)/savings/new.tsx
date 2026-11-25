import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useSavings } from '../../../features/savings/hooks/useSavings';
import { parseCurrencyInput } from '../../../utils/currency';

export default function NewSavingsScreen() {
  const router = useRouter();
  const { createGoal, isCreating } = useSavings();
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    await createGoal({
      name,
      targetAmount: parseCurrencyInput(amountStr),
      targetDate: targetDate || undefined,
    });
    router.back();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Target Tabungan Baru" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassInput
          label="Nama Target Impian"
          placeholder="Misal: Dana Darurat, Liburan Jepang"
          value={name}
          onChangeText={setName}
        />
        <GlassInput
          label="Target Nominal (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        <GlassInput
          label="Target Tanggal (YYYY-MM-DD, Opsional)"
          placeholder="2026-12-31"
          value={targetDate}
          onChangeText={setTargetDate}
        />
        <GlassButton
          title="Simpan Target"
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

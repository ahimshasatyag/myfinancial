import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';

export default function NewRecurringScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <ScreenContainer>
      <ScreenHeader title="Tambah Transaksi Berulang" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassInput
          label="Judul Jadwal"
          placeholder="Misal: Netflix, Listrik Bulanan"
          value={title}
          onChangeText={setTitle}
        />
        <GlassInput
          label="Jumlah Nominal (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <GlassButton
          title="Simpan Jadwal"
          onPress={() => router.back()}
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

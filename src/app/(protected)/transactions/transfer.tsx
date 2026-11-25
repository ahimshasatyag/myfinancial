import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useTransactionForm } from '../../../features/transactions/hooks/use-transaction-form';
import { supabase } from '../../../lib/supabase/client';
import { useAuth } from '../../../providers/auth-provider';
import { parseCurrencyInput } from '../../../utils/currency';
import { getTodayDateString } from '../../../utils/date';

export default function TransferScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { submitTransfer, isLoading } = useTransactionForm();

  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');

  const { data: accounts } = useQuery({
    queryKey: ['accounts', userId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('accounts')
        .select('id, name')
        .eq('user_id', userId!);
      return (data || []) as { id: string; name: string }[];
    },
    enabled: !!userId,
  });

  const handleTransfer = async () => {
    const success = await submitTransfer({
      fromAccountId: fromAccountId || accounts?.[0]?.id || '',
      toAccountId: toAccountId || accounts?.[1]?.id || '',
      amount: parseCurrencyInput(amountStr),
      transferDate: getTodayDateString(),
      notes: notes || null,
    });
    if (success) {
      router.back();
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Transfer Antar Akun" showBack />
      <KeyboardWrapper style={styles.content}>
        <GlassInput
          label="Nominal Transfer (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        <GlassInput
          label="Catatan (Opsional)"
          placeholder="Tujuan transfer..."
          value={notes}
          onChangeText={setNotes}
        />
        <GlassButton
          title="Kirim Transfer"
          onPress={handleTransfer}
          loading={isLoading}
          size="lg"
          style={styles.submitBtn}
        />
      </KeyboardWrapper>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  submitBtn: {
    marginTop: 16,
  },
});

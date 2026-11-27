import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useInvestments } from '../../../features/investments/hooks/useInvestments';
import {
  INVESTMENT_CATEGORY_LABELS,
  InvestmentCategory,
} from '../../../features/investments/services/investmentService';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';

const CATEGORIES: InvestmentCategory[] = [
  'mutual_fund',
  'stock',
  'gold',
  'crypto',
  'bond',
  'deposit',
  'other',
];

export default function NewInvestmentScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { createInvestment, isCreating } = useInvestments();

  const [category, setCategory] = useState<InvestmentCategory>('mutual_fund');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [platform, setPlatform] = useState('');
  const [investedStr, setInvestedStr] = useState('');
  const [currentStr, setCurrentStr] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);
    const trimmedName = name.trim();
    const investedAmount = parseCurrencyInput(investedStr);
    const currentValue = currentStr.trim() ? parseCurrencyInput(currentStr) : investedAmount;

    if (!trimmedName) {
      setErrorMsg('Nama aset investasi wajib diisi.');
      return;
    }
    if (investedAmount <= 0) {
      setErrorMsg('Modal awal harus lebih dari 0.');
      return;
    }

    try {
      await createInvestment({
        category,
        name: trimmedName,
        symbol: symbol.trim() || null,
        platform: platform.trim() || null,
        investedAmount,
        currentValue,
        notes: notes.trim() || null,
      });
      router.back();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan aset investasi.');
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Tambah Investasi" showBack />
      <KeyboardWrapper style={{ padding: 16 }}>
        <GlassCard style={{ marginBottom: 24 }} contentStyle={{ padding: 18 }}>
          <Text
            className="text-[13px] font-medium mb-2"
            style={{ color: theme.colors.textSecondary }}
          >
            Kategori Instrumen
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.75}
                  onPress={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: active ? theme.colors.button : theme.colors.cardMuted,
                    borderColor: active ? theme.colors.button : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-[12px] font-semibold"
                    style={{
                      color: active ? theme.colors.buttonText : theme.colors.textSecondary,
                    }}
                  >
                    {INVESTMENT_CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <GlassInput
            label="Nama Aset Investasi"
            placeholder="Misal: Bank Central Asia, Bibit RDPU, Emas Antam"
            value={name}
            onChangeText={setName}
          />
          <GlassInput
            label="Kode / Simbol (Opsional)"
            placeholder="Misal: BBCA, BTC, XAU"
            autoCapitalize="characters"
            value={symbol}
            onChangeText={setSymbol}
          />
          <GlassInput
            label="Platform / Sekuritas (Opsional)"
            placeholder="Misal: Bibit, Stockbit, Pegadaian"
            value={platform}
            onChangeText={setPlatform}
          />
          <GlassInput
            label="Total Modal Awal (Rp)"
            placeholder="0"
            keyboardType="numeric"
            value={investedStr}
            onChangeText={setInvestedStr}
          />
          <GlassInput
            label="Nilai Pasar Saat Ini (Rp, Opsional)"
            placeholder="Kosongkan jika sama dengan modal awal"
            keyboardType="numeric"
            value={currentStr}
            onChangeText={setCurrentStr}
          />
          <GlassInput
            label="Catatan (Opsional)"
            placeholder="Strategi DCA, target jangka panjang..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {errorMsg ? (
            <Text className="text-[13px] my-1.5" style={{ color: theme.colors.danger }}>
              {errorMsg}
            </Text>
          ) : null}

          <GlassButton
            title="Simpan Investasi"
            onPress={handleSave}
            loading={isCreating}
            size="lg"
            style={{ marginTop: 12 }}
          />
        </GlassCard>
      </KeyboardWrapper>
    </ScreenContainer>
  );
}

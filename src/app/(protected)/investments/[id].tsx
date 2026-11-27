import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Sparkles, Trash2, RefreshCw } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassButton } from '../../../components/ui/glass-button';
import { GlassModal } from '../../../components/ui/glass-modal';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { CurrencyText } from '../../../components/common/currency-text';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import {
  useInvestmentDetail,
  useInvestments,
} from '../../../features/investments/hooks/useInvestments';
import {
  INVESTMENT_CATEGORY_LABELS,
  InvestmentTxType,
} from '../../../features/investments/services/investmentService';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

type ModalMode = InvestmentTxType | 'update_value' | null;

const TX_LABELS: Record<InvestmentTxType, string> = {
  buy: 'Beli / Top Up',
  sell: 'Jual / Tarik',
  dividend: 'Dividen / Imbal Hasil',
};

export default function InvestmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { data, isLoading, refetch, error } = useInvestmentDetail(id);
  const {
    addTransaction,
    updateCurrentValue,
    deleteInvestment,
    isAddingTx,
    isUpdatingValue,
    isDeleting,
  } = useInvestments();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const investment = data?.investment;
  const transactions = data?.transactions || [];
  const isGain = (investment?.profit_loss || 0) >= 0;

  const openModal = (mode: Exclude<ModalMode, null>) => {
    setFormError(null);
    setNotes('');
    setAmountStr(mode === 'update_value' && investment ? String(investment.current_value) : '');
    setModalMode(mode);
  };

  const handleSubmitModal = async () => {
    if (!id || !modalMode) return;
    setFormError(null);
    const amount = parseCurrencyInput(amountStr);

    if (modalMode === 'update_value') {
      if (amount < 0) {
        setFormError('Nilai pasar tidak boleh negatif.');
        return;
      }
      try {
        await updateCurrentValue({ investmentId: id, currentValue: amount });
        setModalMode(null);
        await refetch();
      } catch (err: any) {
        setFormError(err?.message || 'Gagal memperbarui nilai pasar.');
      }
      return;
    }

    if (amount <= 0) {
      setFormError('Nominal harus lebih dari 0.');
      return;
    }

    try {
      await addTransaction({
        investmentId: id,
        txType: modalMode,
        amount,
        notes: notes.trim() || null,
      });
      setModalMode(null);
      await refetch();
    } catch (err: any) {
      setFormError(err?.message || 'Gagal mencatat transaksi investasi.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteInvestment(id);
    setDeleteDialogVisible(false);
    router.back();
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Detail Investasi"
        showBack
        rightAction={
          investment ? (
            <HeaderActions
              actions={[
                {
                  icon: <Trash2 size={18} color={theme.colors.danger} />,
                  onPress: () => setDeleteDialogVisible(true),
                },
              ]}
            />
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <GlassCard>
            <Text className="text-[13px] text-center" style={{ color: theme.colors.danger }}>
              Gagal memuat detail investasi.
            </Text>
          </GlassCard>
        ) : !investment ? (
          <GlassCard>
            <Text className="text-[13px] text-center" style={{ color: theme.colors.textSecondary }}>
              {isLoading ? 'Memuat detail investasi...' : 'Aset tidak ditemukan.'}
            </Text>
          </GlassCard>
        ) : (
          <>
            <GlassCard
              variant="glass"
              style={{ marginBottom: 14 }}
              contentStyle={{ padding: 20 }}
            >
              <View className="flex-row items-start justify-between gap-3 mb-2">
                <View className="flex-1">
                  <Text
                    className="text-[20px] font-bold"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {investment.name}
                    {investment.symbol ? ` (${investment.symbol})` : ''}
                  </Text>
                  <Text className="text-[12px] mt-0.5" style={{ color: theme.colors.textSecondary }}>
                    {INVESTMENT_CATEGORY_LABELS[investment.category]}
                    {investment.platform ? ` • ${investment.platform}` : ''}
                  </Text>
                </View>
                <GlassBadge
                  label={`${isGain ? '+' : ''}${investment.return_percentage.toFixed(1)}%`}
                  variant={isGain ? 'success' : 'danger'}
                  size="sm"
                />
              </View>

              {investment.notes ? (
                <Text
                  className="text-[13px] leading-[18px] mb-3"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {investment.notes}
                </Text>
              ) : null}

              <View className="mt-2 mb-4">
                <Text className="text-[12px]" style={{ color: theme.colors.textMuted }}>
                  Nilai Pasar Saat Ini
                </Text>
                <CurrencyText
                  amount={investment.current_value}
                  currencyCode={investment.currency_code}
                  style={{ fontSize: 28, fontWeight: '800', marginTop: 2 }}
                />
              </View>

              <View
                className="flex-row justify-between pt-3.5 border-t gap-3"
                style={{ borderTopColor: theme.colors.border }}
              >
                <View className="flex-1">
                  <Text className="text-[12px]" style={{ color: theme.colors.textMuted }}>
                    Total Modal
                  </Text>
                  <CurrencyText
                    amount={investment.invested_amount}
                    currencyCode={investment.currency_code}
                    style={{ fontSize: 15, fontWeight: '600', marginTop: 3 }}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px]" style={{ color: theme.colors.textMuted }}>
                    Untung / Rugi
                  </Text>
                  <CurrencyText
                    amount={investment.profit_loss}
                    currencyCode={investment.currency_code}
                    showSign
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      marginTop: 3,
                      color: isGain ? theme.colors.success : theme.colors.danger,
                    }}
                  />
                </View>
              </View>
            </GlassCard>

            <View className="flex-row gap-2.5 mb-2.5">
              <GlassButton
                title="+ Beli / Top Up"
                onPress={() => openModal('buy')}
                style={{ flex: 1 }}
              />
              <GlassButton
                title="- Jual"
                variant="outline"
                onPress={() => openModal('sell')}
                style={{ flex: 1 }}
              />
            </View>

            <View className="flex-row gap-2.5 mb-5">
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => openModal('update_value')}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border"
                style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}
              >
                <RefreshCw size={15} color={theme.colors.textPrimary} />
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Update Nilai Pasar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => openModal('dividend')}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border"
                style={{ borderColor: theme.colors.border, backgroundColor: theme.colors.card }}
              >
                <Sparkles size={15} color={theme.colors.success} />
                <Text
                  className="text-[12px] font-semibold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Catat Dividen
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              className="text-[16px] font-semibold mb-2.5"
              style={{ color: theme.colors.textPrimary }}
            >
              Riwayat Transaksi
            </Text>

            {transactions.length === 0 ? (
              <GlassCard contentStyle={{ padding: 18 }}>
                <Text
                  className="text-[13px] text-center"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Belum ada riwayat beli, jual, atau dividen untuk aset ini.
                </Text>
              </GlassCard>
            ) : (
              <GlassCard contentStyle={{ paddingVertical: 4, paddingHorizontal: 16 }}>
                {transactions.map((item, idx) => {
                  const isSell = item.tx_type === 'sell';
                  const isDiv = item.tx_type === 'dividend';
                  return (
                    <View
                      key={item.id}
                      className="flex-row items-center py-3 gap-3"
                      style={
                        idx < transactions.length - 1
                          ? { borderBottomWidth: 1, borderBottomColor: theme.colors.border }
                          : undefined
                      }
                    >
                      <View
                        className="w-[34px] h-[34px] rounded-full items-center justify-center"
                        style={{
                          backgroundColor: isSell
                            ? theme.colors.dangerBg
                            : theme.colors.successBg,
                        }}
                      >
                        {isDiv ? (
                          <Sparkles size={16} color={theme.colors.success} />
                        ) : isSell ? (
                          <ArrowUpRight size={16} color={theme.colors.danger} />
                        ) : (
                          <ArrowDownLeft size={16} color={theme.colors.success} />
                        )}
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-[14px] font-semibold"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {TX_LABELS[item.tx_type]}
                        </Text>
                        <Text className="text-[12px] mt-0.5" style={{ color: theme.colors.textMuted }}>
                          {formatDate(item.tx_date, 'medium')}
                          {item.notes ? ` • ${item.notes}` : ''}
                        </Text>
                      </View>
                      <CurrencyText
                        amount={isSell ? -item.amount : item.amount}
                        currencyCode={investment.currency_code}
                        showSign
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: isSell ? theme.colors.danger : theme.colors.success,
                        }}
                      />
                    </View>
                  );
                })}
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>

      <GlassModal visible={modalMode !== null} onClose={() => setModalMode(null)}>
        <Text
          className="text-[17px] font-bold mb-3.5"
          style={{ color: theme.colors.textPrimary }}
        >
          {modalMode === 'update_value'
            ? 'Update Nilai Pasar Saat Ini'
            : modalMode
            ? TX_LABELS[modalMode]
            : ''}
        </Text>
        <GlassInput
          label={modalMode === 'update_value' ? 'Nilai Pasar Baru (Rp)' : 'Nominal (Rp)'}
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        {modalMode !== 'update_value' ? (
          <GlassInput
            label="Catatan (Opsional)"
            placeholder="Misal: Beli rutin bulanan"
            value={notes}
            onChangeText={setNotes}
          />
        ) : null}
        {formError ? (
          <Text className="text-[13px] my-1.5" style={{ color: theme.colors.danger }}>
            {formError}
          </Text>
        ) : null}
        <View className="flex-row justify-end gap-2.5 mt-3.5">
          <GlassButton
            title="Batal"
            variant="outline"
            size="sm"
            onPress={() => setModalMode(null)}
            style={{ minWidth: 90 }}
          />
          <GlassButton
            title="Simpan"
            size="sm"
            loading={isAddingTx || isUpdatingValue}
            onPress={handleSubmitModal}
            style={{ minWidth: 90 }}
          />
        </View>
      </GlassModal>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        title="Hapus Aset Investasi?"
        message="Aset investasi beserta seluruh riwayat transaksinya akan dihapus permanen."
        confirmLabel="Hapus"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </ScreenContainer>
  );
}

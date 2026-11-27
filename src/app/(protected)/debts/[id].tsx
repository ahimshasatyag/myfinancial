import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, CheckCircle2, Trash2 } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassButton } from '../../../components/ui/glass-button';
import { GlassModal } from '../../../components/ui/glass-modal';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import { useDebtDetail, useDebts } from '../../../features/debts/hooks/useDebts';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

export default function DebtDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { data, isLoading, refetch, error } = useDebtDetail(id);
  const { addPayment, markAsPaid, deleteDebt, isPaying, isMarkingPaid, isDeleting } = useDebts();

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const debt = data?.debt;
  const payments = data?.payments || [];
  const isPayable = debt?.type === 'payable';
  const isPaid = debt?.status === 'paid';

  const handleOpenPayModal = () => {
    setAmountStr('');
    setNotes('');
    setFormError(null);
    setPayModalVisible(true);
  };

  const handleSubmitPayment = async () => {
    if (!id) return;
    setFormError(null);
    const amount = parseCurrencyInput(amountStr);
    if (amount <= 0) {
      setFormError('Nominal pembayaran harus lebih dari 0.');
      return;
    }

    try {
      await addPayment({
        debtId: id,
        amount,
        notes: notes.trim() || null,
      });
      setPayModalVisible(false);
      await refetch();
    } catch (err: any) {
      setFormError(err?.message || 'Gagal mencatat pembayaran.');
    }
  };

  const handleMarkPaid = async () => {
    if (!id || !debt) return;
    await markAsPaid({ debtId: id, remainingAmount: debt.remaining_amount });
    await refetch();
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteDebt(id);
    setDeleteDialogVisible(false);
    router.back();
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Detail Utang"
        showBack
        rightAction={
          debt ? (
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
        contentContainerStyle={styles.content}
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
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              Gagal memuat detail utang.
            </Text>
          </GlassCard>
        ) : !debt ? (
          <GlassCard>
            <Text style={[styles.mutedText, { color: theme.colors.textSecondary }]}>
              {isLoading ? 'Memuat detail...' : 'Data tidak ditemukan.'}
            </Text>
          </GlassCard>
        ) : (
          <>
            <GlassCard variant="glass" style={styles.summaryCard} contentStyle={styles.summaryContent}>
              <View style={styles.titleRow}>
                <View style={styles.titleCol}>
                  <Text style={[styles.debtTitle, { color: theme.colors.textPrimary }]}>
                    {debt.title}
                  </Text>
                  <Text style={[styles.counterparty, { color: theme.colors.textSecondary }]}>
                    {isPayable ? 'Pemberi: ' : 'Peminjam: '}
                    {debt.counterparty_name}
                  </Text>
                </View>
                <GlassBadge
                  label={isPaid ? 'Lunas' : isPayable ? 'Utang' : 'Piutang'}
                  variant={isPaid ? 'success' : isPayable ? 'danger' : 'default'}
                  size="sm"
                />
              </View>

              {debt.notes ? (
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {debt.notes}
                </Text>
              ) : null}

              <View style={styles.amountHeader}>
                <View>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Sisa {isPayable ? 'Utang' : 'Piutang'}
                  </Text>
                  <CurrencyText
                    amount={debt.remaining_amount}
                    currencyCode={debt.currency_code}
                    style={[styles.mainAmount, { color: theme.colors.textPrimary }]}
                  />
                </View>
                <Text style={[styles.percentText, { color: theme.colors.textPrimary }]}>
                  {Math.round(debt.progress_percentage)}%
                </Text>
              </View>

              <ProgressChart
                percentage={debt.progress_percentage}
                height={10}
                style={styles.progressBar}
              />

              <View style={[styles.metricsGrid, { borderTopColor: theme.colors.border }]}>
                <View style={styles.metricCol}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Total Pokok
                  </Text>
                  <CurrencyText
                    amount={debt.principal_amount}
                    currencyCode={debt.currency_code}
                    style={[styles.metricValue, { color: theme.colors.textPrimary }]}
                  />
                </View>
                <View style={styles.metricCol}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Sudah Dibayar
                  </Text>
                  <CurrencyText
                    amount={debt.paid_amount}
                    currencyCode={debt.currency_code}
                    style={[styles.metricValue, { color: theme.colors.success }]}
                  />
                </View>
              </View>

              {debt.due_date ? (
                <View style={styles.dateRow}>
                  <Calendar size={14} color={theme.colors.textMuted} />
                  <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                    Jatuh tempo: {formatDate(debt.due_date, 'medium')}
                  </Text>
                </View>
              ) : null}
            </GlassCard>

            {!isPaid ? (
              <View style={styles.actionRow}>
                <GlassButton
                  title="Catat Pembayaran"
                  onPress={handleOpenPayModal}
                  style={styles.actionBtn}
                />
                <GlassButton
                  title="Tandai Lunas"
                  variant="outline"
                  loading={isMarkingPaid}
                  onPress={handleMarkPaid}
                  style={styles.actionBtn}
                />
              </View>
            ) : null}

            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Riwayat Pembayaran
            </Text>

            {payments.length === 0 ? (
              <GlassCard contentStyle={styles.emptyHistory}>
                <Text style={[styles.mutedText, { color: theme.colors.textSecondary }]}>
                  Belum ada riwayat pembayaran dicatat.
                </Text>
              </GlassCard>
            ) : (
              <GlassCard contentStyle={styles.historyList}>
                {payments.map((item, idx) => (
                  <View
                    key={item.id}
                    style={[
                      styles.historyItem,
                      idx < payments.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[styles.historyIcon, { backgroundColor: theme.colors.successBg }]}
                    >
                      <CheckCircle2 size={16} color={theme.colors.success} />
                    </View>
                    <View style={styles.historyMeta}>
                      <Text style={[styles.historyTitle, { color: theme.colors.textPrimary }]}>
                        Pembayaran Cicilan
                      </Text>
                      <Text style={[styles.historySub, { color: theme.colors.textMuted }]}>
                        {formatDate(item.payment_date, 'medium')}
                        {item.notes ? ` • ${item.notes}` : ''}
                      </Text>
                    </View>
                    <CurrencyText
                      amount={item.amount}
                      currencyCode={debt.currency_code}
                      style={[styles.historyAmount, { color: theme.colors.success }]}
                    />
                  </View>
                ))}
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>

      <GlassModal visible={payModalVisible} onClose={() => setPayModalVisible(false)}>
        <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
          Catat Pembayaran
        </Text>
        <GlassInput
          label="Nominal Pembayaran (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        <GlassInput
          label="Catatan (Opsional)"
          placeholder="Misal: Cicilan bulan ke-2"
          value={notes}
          onChangeText={setNotes}
        />
        {formError ? (
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>{formError}</Text>
        ) : null}
        <View style={styles.modalBtnRow}>
          <GlassButton
            title="Batal"
            variant="outline"
            size="sm"
            onPress={() => setPayModalVisible(false)}
            style={styles.modalBtn}
          />
          <GlassButton
            title="Simpan"
            size="sm"
            loading={isPaying}
            onPress={handleSubmitPayment}
            style={styles.modalBtn}
          />
        </View>
      </GlassModal>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        title="Hapus Catatan?"
        message="Catatan utang/piutang beserta seluruh riwayat pembayarannya akan dihapus permanen."
        confirmLabel="Hapus"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    marginBottom: 14,
  },
  summaryContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  titleCol: {
    flex: 1,
  },
  debtTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  counterparty: {
    fontSize: 13,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
    marginBottom: 12,
  },
  mainAmount: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 2,
  },
  percentText: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 12,
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  dateText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  emptyHistory: {
    padding: 18,
  },
  historyList: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  historyIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMeta: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  historySub: {
    fontSize: 12,
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  modalBtn: {
    minWidth: 90,
  },
  errorText: {
    fontSize: 13,
    marginVertical: 6,
  },
  mutedText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

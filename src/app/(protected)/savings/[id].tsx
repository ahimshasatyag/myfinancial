import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  PauseCircle,
  PlayCircle,
  Trash2,
} from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassButton } from '../../../components/ui/glass-button';
import { GlassModal } from '../../../components/ui/glass-modal';
import { GlassInput } from '../../../components/ui/glass-input';
import { ProgressChart } from '../../../components/charts/progress-chart';
import { CurrencyText } from '../../../components/common/currency-text';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import { useGoalDetail, useSavings } from '../../../features/savings/hooks/useSavings';
import { useTheme } from '../../../providers/theme-provider';
import { parseCurrencyInput } from '../../../utils/currency';
import { GoalStatus } from '../../../types/database.types';

const STATUS_LABELS: Record<GoalStatus, string> = {
  active: 'Aktif',
  completed: 'Tercapai',
  paused: 'Dijeda',
  cancelled: 'Dibatalkan',
};

export default function SavingsDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { data, isLoading, refetch, error } = useGoalDetail(id);
  const {
    addContribution,
    updateGoalStatus,
    deleteGoal,
    isContributing,
    isUpdating,
    isDeleting,
  } = useSavings();

  const [modalAction, setModalAction] = useState<'contribution' | 'withdrawal' | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const goal = data?.goal;
  const contributions = data?.contributions || [];

  const handleOpenModal = (action: 'contribution' | 'withdrawal') => {
    setAmountStr('');
    setNotes('');
    setFormError(null);
    setModalAction(action);
  };

  const handleSubmitContribution = async () => {
    if (!id || !modalAction) return;
    setFormError(null);

    const amount = parseCurrencyInput(amountStr);
    if (amount <= 0) {
      setFormError('Nominal harus lebih dari 0.');
      return;
    }

    if (modalAction === 'withdrawal' && goal && amount > goal.saved_amount) {
      setFormError('Nominal penarikan melebihi dana yang terkumpul.');
      return;
    }

    try {
      await addContribution({
        goalId: id,
        action: modalAction,
        amount,
        notes: notes.trim() || null,
      });
      setModalAction(null);
      await refetch();
    } catch (err: any) {
      setFormError(err?.message || 'Gagal mencatat mutasi dana.');
    }
  };

  const handleTogglePause = async () => {
    if (!id || !goal) return;
    const nextStatus: GoalStatus = goal.status === 'paused' ? 'active' : 'paused';
    await updateGoalStatus({ goalId: id, status: nextStatus });
    await refetch();
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteGoal(id);
    setDeleteDialogVisible(false);
    router.back();
  };

  const statusColor =
    goal?.status === 'completed'
      ? theme.colors.success
      : goal?.status === 'paused'
      ? theme.colors.textMuted
      : theme.colors.textPrimary;

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Detail Goal"
        showBack
        rightAction={
          goal ? (
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
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { refetch(); }} />}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <GlassCard>
            <Text style={[styles.errorText, { color: theme.colors.danger }]}>
              Gagal memuat detail goal.
            </Text>
          </GlassCard>
        ) : !goal ? (
          <GlassCard>
            <Text style={[styles.mutedText, { color: theme.colors.textSecondary }]}>
              {isLoading ? 'Memuat detail goal...' : 'Goal tidak ditemukan.'}
            </Text>
          </GlassCard>
        ) : (
          <>
            <GlassCard variant="glass" style={styles.summaryCard} contentStyle={styles.summaryContent}>
              <View style={styles.titleRow}>
                <Text style={[styles.goalName, { color: theme.colors.textPrimary }]}>
                  {goal.name}
                </Text>
                <View style={[styles.statusBadge, { borderColor: theme.colors.border }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {STATUS_LABELS[goal.status]}
                  </Text>
                </View>
              </View>

              {goal.description ? (
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {goal.description}
                </Text>
              ) : null}

              <View style={styles.amountHeader}>
                <View>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Terkumpul
                  </Text>
                  <CurrencyText
                    amount={goal.saved_amount}
                    style={[styles.savedAmount, { color: theme.colors.textPrimary }]}
                  />
                </View>
                <Text style={[styles.percentText, { color: theme.colors.textPrimary }]}>
                  {Math.round(goal.progress_percentage)}%
                </Text>
              </View>

              <ProgressChart
                percentage={goal.progress_percentage}
                height={10}
                style={styles.progressBar}
              />

              <View style={[styles.metricsGrid, { borderTopColor: theme.colors.border }]}>
                <View style={styles.metricCol}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Target
                  </Text>
                  <CurrencyText
                    amount={goal.target_amount}
                    style={[styles.metricValue, { color: theme.colors.textPrimary }]}
                  />
                </View>
                <View style={styles.metricCol}>
                  <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>
                    Sisa Target
                  </Text>
                  <CurrencyText
                    amount={goal.remaining_amount}
                    style={[styles.metricValue, { color: theme.colors.textPrimary }]}
                  />
                </View>
              </View>

              {goal.target_date ? (
                <View style={styles.dateRow}>
                  <Calendar size={14} color={theme.colors.textMuted} />
                  <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                    Target tanggal: {goal.target_date}
                  </Text>
                </View>
              ) : null}
            </GlassCard>

            <View style={styles.actionRow}>
              <GlassButton
                title="+ Tambah Dana"
                onPress={() => handleOpenModal('contribution')}
                style={styles.actionBtn}
              />
              <GlassButton
                title="- Tarik Dana"
                variant="outline"
                onPress={() => handleOpenModal('withdrawal')}
                style={styles.actionBtn}
              />
            </View>

            {goal.status !== 'completed' ? (
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={isUpdating}
                onPress={handleTogglePause}
                style={[styles.pauseRow, { borderColor: theme.colors.border }]}
              >
                {goal.status === 'paused' ? (
                  <PlayCircle size={18} color={theme.colors.textPrimary} />
                ) : (
                  <PauseCircle size={18} color={theme.colors.textSecondary} />
                )}
                <Text style={[styles.pauseText, { color: theme.colors.textPrimary }]}>
                  {goal.status === 'paused' ? 'Aktifkan Kembali Goal' : 'Jeda Sementara Goal'}
                </Text>
              </TouchableOpacity>
            ) : null}

            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Riwayat Kontribusi
            </Text>

            {contributions.length === 0 ? (
              <GlassCard contentStyle={styles.emptyHistory}>
                <Text style={[styles.mutedText, { color: theme.colors.textSecondary }]}>
                  Belum ada riwayat setoran atau penarikan pada goal ini.
                </Text>
              </GlassCard>
            ) : (
              <GlassCard contentStyle={styles.historyList}>
                {contributions.map((item, idx) => {
                  const isAdd = item.action === 'contribution';
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.historyItem,
                        idx < contributions.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: theme.colors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.historyIcon,
                          {
                            backgroundColor: isAdd
                              ? 'rgba(16, 185, 129, 0.12)'
                              : 'rgba(239, 68, 68, 0.12)',
                          },
                        ]}
                      >
                        {isAdd ? (
                          <ArrowDownLeft size={16} color={theme.colors.success} />
                        ) : (
                          <ArrowUpRight size={16} color={theme.colors.danger} />
                        )}
                      </View>
                      <View style={styles.historyMeta}>
                        <Text style={[styles.historyTitle, { color: theme.colors.textPrimary }]}>
                          {isAdd ? 'Setoran Dana' : 'Penarikan Dana'}
                        </Text>
                        <Text style={[styles.historySub, { color: theme.colors.textMuted }]}>
                          {item.contribution_date}
                          {item.notes ? ` • ${item.notes}` : ''}
                        </Text>
                      </View>
                      <CurrencyText
                        amount={isAdd ? item.amount : -item.amount}
                        showSign
                        style={[
                          styles.historyAmount,
                          { color: isAdd ? theme.colors.success : theme.colors.danger },
                        ]}
                      />
                    </View>
                  );
                })}
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>

      <GlassModal
        visible={modalAction !== null}
        onClose={() => setModalAction(null)}
      >
        <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
          {modalAction === 'contribution' ? 'Tambah Dana Goal' : 'Tarik Dana Goal'}
        </Text>
        <GlassInput
          label="Nominal (Rp)"
          placeholder="0"
          keyboardType="numeric"
          value={amountStr}
          onChangeText={setAmountStr}
        />
        <GlassInput
          label="Catatan (Opsional)"
          placeholder="Misal: Sisihkan gaji bulan ini"
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
            onPress={() => setModalAction(null)}
            style={styles.modalBtn}
          />
          <GlassButton
            title="Simpan"
            size="sm"
            loading={isContributing}
            onPress={handleSubmitContribution}
            style={styles.modalBtn}
          />
        </View>
      </GlassModal>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        title="Hapus Goal?"
        message="Goal beserta seluruh riwayat kontribusinya akan dihapus permanen."
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  goalName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
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
  savedAmount: {
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
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
  },
  pauseText: {
    fontSize: 13,
    fontWeight: '600',
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

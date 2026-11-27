import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Plus, Target } from 'lucide-react-native';
import { GlassCard } from '../../../../components/ui/glass-card';
import { ProgressChart } from '../../../../components/charts/progress-chart';
import { CurrencyText } from '../../../../components/common/currency-text';
import { GoalOverviewItem } from '../../../savings/services/savingsService';
import { useTheme } from '../../../../providers/theme-provider';
import { ROUTES } from '../../../../constants/routes';

export interface GoalsPreviewProps {
  goals: GoalOverviewItem[];
}

export const GoalsPreview: React.FC<GoalsPreviewProps> = ({ goals }) => {
  const router = useRouter();
  const { theme } = useTheme();

  // Tampilkan maksimal 2 data goals di dashboard
  const visibleGoals = goals.slice(0, 2);

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Goals</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(ROUTES.TABS.GOALS as any)}
          style={styles.seeAllBtn}
        >
          <Text style={[styles.seeAllText, { color: theme.colors.textSecondary }]}>
            Lihat Semua
          </Text>
          <ChevronRight size={14} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {visibleGoals.length === 0 ? (
        <GlassCard contentStyle={styles.emptyCard}>
          <View style={styles.emptyLeft}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.cardMuted }]}>
              <Target size={18} color={theme.colors.textPrimary} />
            </View>
            <View style={styles.emptyTextCol}>
              <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                Belum ada goals
              </Text>
              <Text style={[styles.emptySub, { color: theme.colors.textMuted }]}>
                Mulai target tabungan pertamamu
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push(ROUTES.SAVINGS.NEW as any)}
            style={[styles.emptyBtn, { backgroundColor: theme.colors.button }]}
          >
            <Plus size={14} color={theme.colors.buttonText} />
            <Text style={[styles.emptyBtnText, { color: theme.colors.buttonText }]}>Buat</Text>
          </TouchableOpacity>
        </GlassCard>
      ) : (
        <GlassCard contentStyle={styles.listCard}>
          {visibleGoals.map((goal, index) => {
            const pct = Math.min(Math.round(goal.progress_percentage || 0), 100);
            const isLast = index === visibleGoals.length - 1;

            return (
              <TouchableOpacity
                key={goal.goal_id}
                activeOpacity={0.75}
                onPress={() => router.push(ROUTES.SAVINGS.DETAIL(goal.goal_id) as any)}
                style={[
                  styles.goalItem,
                  !isLast && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    paddingBottom: 14,
                    marginBottom: 14,
                  },
                ]}
              >
                <View style={styles.goalTopRow}>
                  <View style={styles.goalTitleRow}>
                    <View style={[styles.iconBox, { backgroundColor: theme.colors.cardMuted }]}>
                      <Target size={16} color={theme.colors.textPrimary} />
                    </View>
                    <Text
                      style={[styles.goalName, { color: theme.colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {goal.name}
                    </Text>
                  </View>
                  <Text style={[styles.goalPercent, { color: theme.colors.textPrimary }]}>
                    {pct}%
                  </Text>
                </View>

                <ProgressChart percentage={pct} height={6} style={styles.progress} />

                <View style={styles.goalBottomRow}>
                  <CurrencyText
                    amount={goal.saved_amount}
                    currencyCode={goal.currency_code}
                    style={[styles.savedText, { color: theme.colors.textPrimary }]}
                  />
                  <Text style={[styles.targetText, { color: theme.colors.textMuted }]}>
                    dari{' '}
                    <CurrencyText
                      amount={goal.target_amount}
                      currencyCode={goal.currency_code}
                      style={[styles.targetVal, { color: theme.colors.textSecondary }]}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyTextCol: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  emptyBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listCard: {
    padding: 16,
  },
  goalItem: {},
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  goalPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progress: {
    marginBottom: 8,
  },
  goalBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetText: {
    fontSize: 12,
  },
  targetVal: {
    fontSize: 12,
    fontWeight: '600',
  },
});

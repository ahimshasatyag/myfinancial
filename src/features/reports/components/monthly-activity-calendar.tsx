import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react-native';
import { GlassCard } from '../../../components/ui/glass-card';
import { CurrencyText } from '../../../components/common/currency-text';
import { useTheme } from '../../../providers/theme-provider';
import {
  DailyFinancialSummary,
  formatCalendarAmount,
} from '../services/reportService';

export interface MonthlyActivityCalendarProps {
  currentDate: Date;
  onChangeDate: (date: Date) => void;
  dailyData: Record<string, DailyFinancialSummary>;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = ['SN', 'SL', 'RB', 'KM', 'JM', 'SB', 'MG'];

export const MonthlyActivityCalendar: React.FC<MonthlyActivityCalendarProps> = ({
  currentDate,
  onChangeDate,
  dailyData,
  isLoading,
}) => {
  const { theme, isDark } = useTheme();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Format month and year label in uppercase: "NOVEMBER 2026"
  const monthLabel = useMemo(() => {
    return currentDate
      .toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      .toUpperCase();
  }, [currentDate]);

  // Today string for comparison: "YYYY-MM-DD"
  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;
  }, []);

  // Determine initial selected day (today if same month, otherwise day 1 or first day with transactions)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
      return todayStr;
    }
    return `${year}-${String(month + 1).padStart(2, '0')}-01`;
  });

  // Calculate calendar grid cells
  const { leadingEmptyDays, trailingEmptyDays, daysList } = useMemo(() => {
    const daysCount = new Date(year, month + 1, 0).getDate();
    const firstDayJs = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    // Monday-first indexing: Monday is 0, Sunday is 6
    const leadingEmpty = (firstDayJs + 6) % 7;

    const list: Array<{ dayNumber: number; dateStr: string }> = [];
    for (let d = 1; d <= daysCount; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      list.push({ dayNumber: d, dateStr });
    }

    const totalCells = leadingEmpty + daysCount;
    const trailingEmpty = (7 - (totalCells % 7)) % 7;

    return {
      leadingEmptyDays: leadingEmpty,
      trailingEmptyDays: trailingEmpty,
      daysList: list,
    };
  }, [year, month]);

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    onChangeDate(prev);
    setSelectedDate(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-01`);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    onChangeDate(next);
    setSelectedDate(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`);
  };

  const selectedDayData = dailyData[selectedDate] || {
    date: selectedDate,
    dayNumber: Number(selectedDate.split('-')[2] || 1),
    totalIncome: 0,
    totalExpense: 0,
    transactions: [],
  };

  const formatSelectedDateHeader = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <GlassCard style={styles.container}>
      {/* 1. Header: Aktivitas Bulan Ini */}
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Aktivitas Bulan Ini</Text>

      {/* 2. Month Selector & Navigation: < NOVEMBER 2026 > */}
      <View style={styles.monthNavRow}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={[
            styles.navButton,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
          activeOpacity={0.7}
          accessibilityLabel="Bulan sebelumnya"
        >
          <ChevronLeft size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.monthLabel, { color: theme.colors.textSecondary }]}>{monthLabel}</Text>

        <TouchableOpacity
          onPress={handleNextMonth}
          style={[
            styles.navButton,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            },
          ]}
          activeOpacity={0.7}
          accessibilityLabel="Bulan berikutnya"
        >
          <ChevronRight size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 3. Days of Week: SN SL RB KM JM SB MG */}
      <View style={styles.daysOfWeekRow}>
        {DAYS_OF_WEEK.map((dayName, idx) => (
          <View key={idx} style={styles.dayOfWeekCol}>
            <Text
              style={[
                styles.dayOfWeekText,
                {
                  color: idx === 6 ? '#EF4444' : theme.colors.textMuted,
                  fontWeight: idx === 6 ? '700' : '600',
                },
              ]}
            >
              {dayName}
            </Text>
          </View>
        ))}
      </View>

      {/* 4. Uniform 7-Column Calendar Grid */}
      <View style={styles.gridContainer}>
        {/* Leading empty slots */}
        {Array.from({ length: leadingEmptyDays }).map((_, idx) => (
          <View key={`empty-lead-${idx}`} style={styles.cellWrapper}>
            <View
              style={[
                styles.emptyCell,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                },
              ]}
            />
          </View>
        ))}

        {/* Days of Month */}
        {daysList.map(({ dayNumber, dateStr }) => {
          const item = dailyData[dateStr];
          const expense = item?.totalExpense || 0;
          const income = item?.totalIncome || 0;
          const hasExpense = expense > 0;
          const hasIncome = income > 0;
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;

          // Determine cell background color
          let cellBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F9FAFB';
          let cellBorder = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

          if (hasExpense) {
            cellBg = isDark ? 'rgba(244, 63, 94, 0.16)' : '#FFF1F2';
            cellBorder = isDark ? 'rgba(244, 63, 94, 0.28)' : '#FFE4E6';
          } else if (hasIncome) {
            cellBg = isDark ? 'rgba(16, 185, 129, 0.16)' : '#ECFDF5';
            cellBorder = isDark ? 'rgba(16, 185, 129, 0.28)' : '#D1FAE5';
          }

          if (isSelected) {
            cellBg = isDark ? 'rgba(251, 113, 133, 0.24)' : '#FFE4E6';
            cellBorder = '#FB7185';
          } else if (isToday) {
            cellBorder = theme.colors.button;
          }

          return (
            <TouchableOpacity
              key={dateStr}
              style={styles.cellWrapper}
              activeOpacity={0.75}
              onPress={() => setSelectedDate(dateStr)}
            >
              <View
                style={[
                  styles.cell,
                  {
                    backgroundColor: cellBg,
                    borderColor: cellBorder,
                    borderWidth: isSelected ? 1.8 : 1,
                  },
                ]}
              >
                {/* Day number top-left */}
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected
                        ? (isDark ? '#FDA4AF' : '#E11D48')
                        : isToday
                        ? theme.colors.button
                        : (isDark ? '#F3F4F6' : '#1F2937'),
                      fontWeight: isSelected || isToday ? '700' : '600',
                    },
                  ]}
                >
                  {dayNumber}
                </Text>

                {/* Amounts bottom-right */}
                <View style={styles.amountsCol}>
                  {hasExpense && (
                    <Text
                      style={[
                        styles.expenseText,
                        { color: isDark ? '#FB7185' : '#E11D48' },
                      ]}
                      numberOfLines={1}
                    >
                      -{formatCalendarAmount(expense)}
                    </Text>
                  )}
                  {hasIncome && (
                    <Text
                      style={[
                        styles.incomeText,
                        { color: isDark ? '#34D399' : '#059669' },
                      ]}
                      numberOfLines={1}
                    >
                      +{formatCalendarAmount(income)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Trailing empty slots to complete the final row */}
        {Array.from({ length: trailingEmptyDays }).map((_, idx) => (
          <View key={`empty-trail-${idx}`} style={styles.cellWrapper}>
            <View
              style={[
                styles.emptyCell,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* 5. Selected Day Detail Section */}
      <View
        style={[
          styles.detailContainer,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <View style={styles.detailHeader}>
          <CalendarIcon size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailDateText, { color: theme.colors.textPrimary }]}>
            {formatSelectedDateHeader(selectedDate)}
          </Text>
        </View>

        {/* Quick summary badges with vertical label/value layout to avoid text wrap */}
        <View style={styles.summaryBadgesRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.16)' : '#FEE2E2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
              },
            ]}
          >
            <View style={styles.badgeHeader}>
              <ArrowDownRight size={15} color="#EF4444" />
              <Text style={[styles.badgeLabel, { color: isDark ? '#FCA5A5' : '#DC2626' }]}>
                Keluar
              </Text>
            </View>
            <CurrencyText
              amount={selectedDayData.totalExpense}
              style={[styles.badgeValue, { color: isDark ? '#F87171' : '#B91C1C' }]}
            />
          </View>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.16)' : '#D1FAE5',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
              },
            ]}
          >
            <View style={styles.badgeHeader}>
              <ArrowUpRight size={15} color="#10B981" />
              <Text style={[styles.badgeLabel, { color: isDark ? '#6EE7B7' : '#059669' }]}>
                Masuk
              </Text>
            </View>
            <CurrencyText
              amount={selectedDayData.totalIncome}
              style={[styles.badgeValue, { color: isDark ? '#34D399' : '#047857' }]}
            />
          </View>
        </View>

        {/* Transaction list for selected day */}
        {selectedDayData.transactions && selectedDayData.transactions.length > 0 ? (
          <View style={styles.txList}>
            {selectedDayData.transactions.map((tx) => {
              const isExp = tx.transaction_type === 'expense';
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txItem,
                    {
                      borderBottomColor: isDark
                        ? 'rgba(255, 255, 255, 0.06)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                >
                  <View style={styles.txInfo}>
                    <Text
                      numberOfLines={1}
                      style={[styles.txTitle, { color: theme.colors.textPrimary }]}
                    >
                      {tx.title}
                    </Text>
                    {tx.category_name && (
                      <Text
                        numberOfLines={1}
                        style={[styles.txCategory, { color: theme.colors.textSecondary }]}
                      >
                        {tx.category_name}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: isExp ? (isDark ? '#F87171' : '#DC2626') : (isDark ? '#34D399' : '#059669') },
                    ]}
                  >
                    {isExp ? '-' : '+'}
                    <CurrencyText amount={tx.amount} style={{ fontWeight: '700' }} />
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.emptyDayText, { color: theme.colors.textMuted }]}>
            Tidak ada transaksi pada tanggal ini.
          </Text>
        )}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeekCol: {
    width: '14.285%',
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -2.5,
  },
  cellWrapper: {
    width: '14.285%',
    padding: 2.5,
  },
  emptyCell: {
    height: 54, // Fixed height matching day cells
    borderRadius: 8,
    borderWidth: 1,
  },
  cell: {
    height: 54, // Fixed height: ensures every cell in every row is identically sized
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 3,
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 11,
    alignSelf: 'flex-start',
  },
  amountsCol: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
  },
  expenseText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 12,
  },
  incomeText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 12,
  },
  detailContainer: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailDateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryBadgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  badge: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  txList: {
    marginTop: 6,
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  txInfo: {
    flex: 1,
    marginRight: 10,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  txCategory: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
  },
  emptyDayText: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
    fontStyle: 'italic',
  },
});

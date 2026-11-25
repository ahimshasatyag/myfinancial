import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ChevronRight, Tag } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { HeaderActions } from '../../../components/navigation/header-actions';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassBadge } from '../../../components/ui/glass-badge';
import { EmptyState } from '../../../components/common/empty-state';
import { ErrorState } from '../../../components/common/error-state';
import { useCategories } from '../hooks/useCategories';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

type FilterType = 'all' | 'expense' | 'income';

export const CategoryListScreen: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const { data: categories, isLoading, isError, error, refetch } = useCategories(
    filterType === 'all' ? undefined : { type: filterType }
  );

  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    (categories || []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const tabs: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Pengeluaran', value: 'expense' },
    { label: 'Pemasukan', value: 'income' },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Kategori Transaksi"
        showBack
        rightAction={
          <HeaderActions
            actions={[
              {
                icon: <Plus size={20} color={theme.colors.textPrimary} />,
                onPress: () => router.push(ROUTES.CATEGORIES.NEW as any),
              },
            ]}
          />
        }
      />

      <View className="flex-1 px-4 pt-3">
        {/* Filter chips */}
        <View className="flex-row gap-2 mb-4">
          {tabs.map((t) => {
            const active = filterType === t.value;
            return (
              <TouchableOpacity
                key={t.value}
                activeOpacity={0.75}
                onPress={() => setFilterType(t.value)}
                className="px-4 py-2 rounded-full border"
                style={{
                  backgroundColor: active ? theme.colors.button : theme.colors.card,
                  borderColor: active ? theme.colors.button : theme.colors.border,
                }}
              >
                <Text
                  className="text-[13px] font-medium"
                  style={{ color: active ? theme.colors.buttonText : theme.colors.textSecondary }}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isError ? (
          <GlassCard>
            <ErrorState
              message={(error as Error)?.message || 'Gagal memuat daftar kategori.'}
              onRetry={() => refetch()}
            />
          </GlassCard>
        ) : !isLoading && (!categories || categories.length === 0) ? (
          <GlassCard>
            <EmptyState
              title="Belum ada kategori"
              description="Buat kategori pemasukan atau pengeluaran untuk mengelompokkan transaksi Anda."
              actionTitle="Tambah Kategori"
              onAction={() => router.push(ROUTES.CATEGORIES.NEW as any)}
            />
          </GlassCard>
        ) : (
          <FlatList
            data={categories || []}
            keyExtractor={(item) => item.id}
            onRefresh={refetch}
            refreshing={isLoading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => {
              const parentName = item.parent_id ? parentMap.get(item.parent_id) : null;
              return (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => router.push(ROUTES.CATEGORIES.DETAIL(item.id) as any)}
                >
                  <GlassCard
                    style={{ marginBottom: 10, opacity: item.is_active ? 1 : 0.55 }}
                    contentStyle={{
                      padding: 14,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View className="flex-row items-center flex-1 mr-3">
                      <View
                        className="w-9 h-9 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: theme.colors.cardMuted }}
                      >
                        <Tag size={16} color={theme.colors.textPrimary} />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text
                            className="text-[15px] font-semibold"
                            style={{ color: theme.colors.textPrimary }}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          {!item.is_active && <GlassBadge label="Nonaktif" size="sm" />}
                        </View>
                        <Text className="text-xs mt-0.5" style={{ color: theme.colors.textSecondary }}>
                          {item.transaction_type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          {parentName ? ` • Sub dari ${parentName}` : ''}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={16} color={theme.colors.textMuted} />
                  </GlassCard>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

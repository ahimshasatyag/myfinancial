import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Archive, RotateCcw, Trash2 } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { ConfirmationDialog } from '../../../components/common/confirmation-dialog';
import { LoadingOverlay } from '../../../components/common/loading-overlay';
import { useCategories, useCategoryDetail } from '../hooks/useCategories';
import { createCategorySchema } from '../schemas/category.schema';
import { TransactionType } from '../../../types/database.types';
import { TRANSACTION_TYPES } from '../../../constants/transaction';
import { useTheme } from '../../../providers/theme-provider';

export const CategoryFormScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const { theme } = useTheme();

  const {
    data: allCategories,
    createCategory,
    updateCategory,
    toggleCategoryActive,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCategories();
  const { data: existing, isLoading: isLoadingDetail } = useCategoryDetail(id);

  const [name, setName] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [parentId, setParentId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (existing && isEdit) {
      setName(existing.name || '');
      setTransactionType(existing.transaction_type);
      setParentId(existing.parent_id || null);
      setDescription(existing.description || '');
    }
  }, [existing, isEdit]);

  const parentOptions = useMemo(
    () =>
      (allCategories || []).filter(
        (c) =>
          c.transaction_type === transactionType &&
          c.is_active &&
          !c.parent_id &&
          c.id !== id
      ),
    [allCategories, transactionType, id]
  );

  const handleSave = async () => {
    setFormError(null);
    const parsed = createCategorySchema.safeParse({
      name,
      transactionType,
      parentId,
      description: description || null,
    });

    if (!parsed.success) {
      setNameError(parsed.error.issues[0]?.message);
      return;
    }

    setNameError(undefined);
    try {
      if (isEdit && id) {
        await updateCategory({ id, input: parsed.data });
      } else {
        await createCategory(parsed.data);
      }
      router.back();
    } catch (e: any) {
      setFormError(e?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleToggleActive = async () => {
    if (!existing) return;
    try {
      await toggleCategoryActive({ id: existing.id, isActive: !existing.is_active });
      router.back();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message || 'Tidak dapat mengubah status kategori.');
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    try {
      await deleteCategory(existing.id);
      setShowDeleteConfirm(false);
      router.back();
    } catch (e: any) {
      setShowDeleteConfirm(false);
      Alert.alert(
        'Tidak Dapat Menghapus',
        e?.message || 'Kategori sudah dipakai transaksi. Nonaktifkan kategori saja.'
      );
    }
  };

  if (isEdit && isLoadingDetail) {
    return <LoadingOverlay visible message="Memuat data kategori..." />;
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} showBack />
      <KeyboardWrapper className="px-4 pt-3 pb-10">
        {formError && (
          <View
            className="p-3 rounded-xl border mb-4"
            style={{ backgroundColor: theme.colors.dangerBg, borderColor: theme.colors.danger }}
          >
            <Text className="text-[13px] text-center font-medium" style={{ color: theme.colors.danger }}>
              {formError}
            </Text>
          </View>
        )}

        <GlassCard style={{ marginBottom: 16 }}>
          {/* Transaction Type */}
          <View className="flex-row rounded-xl p-1 mb-4" style={{ backgroundColor: theme.colors.cardMuted }}>
            {TRANSACTION_TYPES.map((t) => {
              const active = transactionType === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  activeOpacity={0.75}
                  onPress={() => {
                    setTransactionType(t.value);
                    setParentId(null);
                  }}
                  className="flex-1 py-2.5 items-center rounded-lg"
                  style={active ? { backgroundColor: theme.colors.button } : undefined}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color: active ? theme.colors.buttonText : theme.colors.textSecondary,
                      fontWeight: active ? '600' : '500',
                    }}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <GlassInput
            label="Nama Kategori"
            placeholder="Misal: Kopi, Langganan Streaming"
            value={name}
            onChangeText={setName}
            error={nameError}
          />

          {/* Optional Parent Category (Subcategory support per PRD §10.4) */}
          {parentOptions.length > 0 && (
            <View className="mb-4">
              <Text className="text-[13px] font-medium mb-2" style={{ color: theme.colors.textSecondary }}>
                Kategori Induk (Opsional — untuk subkategori)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setParentId(null)}
                  className="px-3.5 py-2 rounded-full border"
                  style={{
                    backgroundColor: !parentId ? theme.colors.button : theme.colors.input,
                    borderColor: !parentId ? theme.colors.button : theme.colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: !parentId ? theme.colors.buttonText : theme.colors.textPrimary }}
                  >
                    Tidak ada (Utama)
                  </Text>
                </TouchableOpacity>
                {parentOptions.map((cat) => {
                  const active = parentId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.75}
                      onPress={() => setParentId(cat.id)}
                      className="px-3.5 py-2 rounded-full border"
                      style={{
                        backgroundColor: active ? theme.colors.button : theme.colors.input,
                        borderColor: active ? theme.colors.button : theme.colors.border,
                      }}
                    >
                      <Text
                        className="text-xs font-medium"
                        style={{ color: active ? theme.colors.buttonText : theme.colors.textPrimary }}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <GlassInput
            label="Deskripsi (Opsional)"
            placeholder="Keterangan singkat..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </GlassCard>

        <GlassButton
          title={isEdit ? 'Simpan Perubahan' : 'Simpan Kategori'}
          onPress={handleSave}
          loading={isCreating || isUpdating}
          size="lg"
          className="w-full"
        />

        {isEdit && existing && (
          <View className="flex-row gap-2.5 mt-3">
            <GlassButton
              title={existing.is_active ? 'Nonaktifkan' : 'Aktifkan'}
              variant="outline"
              onPress={handleToggleActive}
              loading={isUpdating}
              size="md"
              leftIcon={
                existing.is_active ? (
                  <Archive size={16} color={theme.colors.textPrimary} />
                ) : (
                  <RotateCcw size={16} color={theme.colors.textPrimary} />
                )
              }
              style={{ flex: 1 }}
            />
            <GlassButton
              title="Hapus"
              variant="outline"
              onPress={() => setShowDeleteConfirm(true)}
              size="md"
              leftIcon={<Trash2 size={16} color={theme.colors.danger} />}
              textStyle={{ color: theme.colors.danger }}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </KeyboardWrapper>

      <ConfirmationDialog
        visible={showDeleteConfirm}
        title="Hapus Kategori?"
        message="Kategori yang sudah dipakai pada transaksi tidak bisa dihapus paksa — gunakan opsi Nonaktifkan jika perlu."
        confirmLabel="Hapus"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScreenContainer>
  );
};

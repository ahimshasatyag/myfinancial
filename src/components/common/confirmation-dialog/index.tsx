import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassModal } from '../../ui/glass-modal';
import { GlassButton } from '../../ui/glass-button';
import { useTheme } from '../../../providers/theme-provider';

export interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const { theme } = useTheme();

  return (
    <GlassModal visible={visible} onClose={onCancel}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>{message}</Text>
      <View style={styles.buttonRow}>
        <GlassButton
          title={cancelLabel}
          onPress={onCancel}
          variant="outline"
          size="sm"
          style={styles.button}
        />
        <GlassButton
          title={confirmLabel}
          onPress={onConfirm}
          variant={confirmVariant}
          size="sm"
          loading={loading}
          style={styles.button}
        />
      </View>
    </GlassModal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 80,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Database, Download } from 'lucide-react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassButton } from '../../../components/ui/glass-button';
import { backupService } from '../../../services/backup-service';
import { useAuth } from '../../../providers/auth-provider';
import { useTheme } from '../../../providers/theme-provider';

export default function BackupScreen() {
  const { userId } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBackup = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await backupService.exportUserData(userId);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Cadangan Data" showBack />
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <Database size={40} color={theme.colors.textPrimary} style={styles.icon} />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Ekspor Data JSON</Text>
          <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
            Unduh seluruh riwayat transaksi, rekening, anggaran, dan target tabungan Anda dalam format JSON aman.
          </Text>
          <GlassButton
            title="Mulai Cadangkan"
            onPress={handleBackup}
            loading={loading}
            size="lg"
            leftIcon={<Download size={18} color={theme.colors.buttonText} />}
            style={styles.btn}
          />
          {success && (
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              Cadangan berhasil dibuat!
            </Text>
          )}
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  btn: {
    width: '100%',
  },
  successText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '600',
  },
});

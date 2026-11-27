import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Database, DollarSign, LogOut, Moon, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { AppAvatar } from '../../../components/ui/app-avatar';
import { GlassCard } from '../../../components/ui/glass-card';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../providers/auth-provider';
import { useTheme } from '../../../providers/theme-provider';

export const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const { theme, mode, setThemePreference, themePreference } = useTheme();

  const handleToggleTheme = () => {
    const next = themePreference === 'light' ? 'dark' : themePreference === 'dark' ? 'system' : 'light';
    setThemePreference(next);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES.AUTH.WELCOME as any);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Pengaturan" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(ROUTES.PROFILE.INDEX as any)}
        >
          <GlassCard style={styles.profileCard}>
            <AppAvatar name={profile?.full_name} size={50} />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
                {profile?.full_name || 'Pengguna'}
              </Text>
              <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
                Ketuk untuk edit profil
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </GlassCard>
        </TouchableOpacity>

        {/* General Settings */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Preferensi</Text>
        <GlassCard style={styles.menuCard}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleToggleTheme} style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Moon size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>Tema Aplikasi</Text>
            </View>
            <Text style={[styles.menuValue, { color: theme.colors.textSecondary }]}>
              {themePreference === 'system' ? 'Sistem' : themePreference === 'dark' ? 'Gelap' : 'Terang'}
            </Text>
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(ROUTES.SETTINGS.CURRENCY as any)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <DollarSign size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>Mata Uang</Text>
            </View>
            <Text style={[styles.menuValue, { color: theme.colors.textSecondary }]}>IDR (Rp)</Text>
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(ROUTES.SETTINGS.NOTIFICATIONS as any)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Bell size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>Notifikasi</Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        {/* Security & Data */}
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Data & Keamanan</Text>
        <GlassCard style={styles.menuCard}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(ROUTES.SETTINGS.BACKUP as any)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Database size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>Cadangkan Data</Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(ROUTES.SETTINGS.PRIVACY as any)}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Shield size={20} color={theme.colors.textPrimary} />
              <Text style={[styles.menuText, { color: theme.colors.textPrimary }]}>Kebijakan Privasi</Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleSignOut} style={styles.logoutBtn}>
          <LogOut size={18} color={theme.colors.danger} />
          <Text style={[styles.logoutText, { color: theme.colors.danger }]}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 20,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    padding: 0,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuValue: {
    fontSize: 13,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

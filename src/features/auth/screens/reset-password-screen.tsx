import { useRouter } from 'expo-router';
import { Lock, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Layout components
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';
import { ScreenContainer } from '../../../components/layout/screen-container';

// UI components
import { AppDivider } from '../../../components/ui/app-divider';
import { GlassButton } from '../../../components/ui/glass-button';
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';

// Navigation & Common components
import { LoadingOverlay } from '../../../components/common/loading-overlay';

// Feature components & hooks
import { ROUTES } from '../../../constants/routes';
import { supabase } from '../../../lib/supabase/client';
import { useTheme } from '../../../providers/theme-provider';
import { AuthHeader } from '../components/auth-header';

export const ResetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Entrance animation pada UI Thread
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const isNative = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: isNative,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: isNative,
      }),
    ]).start();
  }, []);

  const handleUpdate = async () => {
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      router.replace(ROUTES.AUTH.LOGIN as any);
    } catch (e: any) {
      setError(e.message || 'Gagal mengubah kata sandi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <Animated.View
        style={{
          flex: 1,
          opacity: entranceAnim,
          transform: [{ translateY: translateYAnim }],
        }}
      >
        <KeyboardWrapper className="px-5 pt-4 pb-8 justify-center">
          {/* Header Identitas */}
          <AuthHeader
            title="Atur Ulang Kata Sandi"
            subtitle="Buat kata sandi baru yang aman untuk akun budgetku Anda"
          />

          {/* CARD GLASSMORPHIC: Membungkus form pengaturan ulang kata sandi */}
          <GlassCard
            variant="glass"
            intensity={55}
            className="border border-border-light dark:border-border-dark rounded-3xl shadow-lg mb-4"
            contentStyle={{ padding: 20 }}
          >
            {/* Notifikasi Error jika validasi atau update gagal */}
            {error && (
              <View className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">
                <Text className="text-[13px] text-center font-medium text-red-500">
                  {error}
                </Text>
              </View>
            )}

            {/* Input Kata Sandi Baru */}
            <GlassInput
              label="Kata Sandi Baru"
              placeholder="Minimal 8 karakter"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={isDark ? '#A3A3A3' : '#737373'} />}
              className="mb-4"
            />

            {/* Input Konfirmasi Kata Sandi */}
            <GlassInput
              label="Konfirmasi Kata Sandi"
              placeholder="Ulangi kata sandi baru"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={<ShieldCheck size={20} color={isDark ? '#A3A3A3' : '#737373'} />}
              className="mb-4"
            />

            {/* Tombol Simpan Kata Sandi */}
            <GlassButton
              title="Simpan Kata Sandi"
              onPress={handleUpdate}
              loading={loading}
              size="lg"
              variant="primary"
              className="w-full mt-1"
            />

            <AppDivider className="my-4" />

            {/* Navigasi Pembatalan / Kembali ke Login */}
            <View className="flex-row justify-center items-center py-1">
              <Text
                className="text-sm"
                style={{ color: isDark ? '#A3A3A3' : '#737373' }}
              >
                Batalkan dan{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.replace(ROUTES.AUTH.LOGIN as any)}
                hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
              >
                <Text
                  className="text-sm font-semibold underline"
                  style={{ color: isDark ? '#FFFFFF' : '#111111' }}
                >
                  Kembali ke Masuk
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </KeyboardWrapper>
      </Animated.View>

      <LoadingOverlay visible={loading} message="Menyimpan kata sandi baru..." />
    </ScreenContainer>
  );
};

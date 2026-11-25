import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';

// Layout components
import { ScreenContainer } from '../../../components/layout/screen-container';
import { KeyboardWrapper } from '../../../components/layout/keyboard-wrapper';

// UI components
import { GlassCard } from '../../../components/ui/glass-card';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { AppDivider } from '../../../components/ui/app-divider';

// Navigation & Common components
import { LoadingOverlay } from '../../../components/common/loading-overlay';

// Feature components & hooks
import { AuthHeader } from '../components/auth-header';
import { useAuthForm } from '../hooks/use-auth-form';
import { useTheme } from '../../../providers/theme-provider';
import { ROUTES } from '../../../constants/routes';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, errorMessage } = useAuthForm();

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

  const handleLogin = async () => {
    const success = await login({ email, password });
    if (success) {
      router.replace(ROUTES.TABS.DASHBOARD as any);
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
          {/* Header Identitas Aplikasi */}
          <AuthHeader
            title="BUDGETKU"
            subtitle="Login akun Anda untuk mengakses financial planning"
          />

          {/* CARD GLASSMORPHIC: Membungkus form Email, Kata Sandi, Tombol Masuk, & Tautan Daftar */}
          <GlassCard
            variant="glass"
            intensity={55}
            className="border border-border-light dark:border-border-dark rounded-3xl shadow-lg mb-4"
            contentStyle={{ padding: 20 }}
          >
            {/* Notifikasi Error jika login gagal */}
            {errorMessage && (
              <View className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">
                <Text className="text-[13px] text-center font-medium text-red-500">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Input Email */}
            <GlassInput
              label="Email"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={20} color={isDark ? '#A3A3A3' : '#737373'} />}
              className="mb-4"
            />

            {/* Input Kata Sandi */}
            <GlassInput
              label="Kata Sandi"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={isDark ? '#A3A3A3' : '#737373'} />}
              className="mb-4"
            />

            {/* Lupa Kata Sandi */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push(ROUTES.AUTH.FORGOT_PASSWORD as any)}
              className="self-end -mt-1 mb-5"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                className="text-[13px]"
                style={{ color: isDark ? '#A3A3A3' : '#737373' }}
              >
                Lupa kata sandi?
              </Text>
            </TouchableOpacity>

            {/* Tombol Masuk (GlassButton) */}
            <GlassButton
              title="Masuk"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              variant="primary"
              className="w-full"
            />

            {/* Pembatas halus sebelum teks daftar */}
            <AppDivider className="my-4" />

            {/* Navigasi Pendaftaran Akun tepat di bawah tombol Masuk */}
            <View className="flex-row justify-center items-center py-1">
              <Text
                className="text-sm"
                style={{ color: isDark ? '#A3A3A3' : '#737373' }}
              >
                Belum punya akun?{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push(ROUTES.AUTH.REGISTER as any)}
                hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
              >
                <Text
                  className="text-sm font-semibold underline"
                  style={{ color: isDark ? '#FFFFFF' : '#111111' }}
                >
                  Daftar Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </KeyboardWrapper>
      </Animated.View>

      {/* Loading Overlay untuk visualisasi proses autentikasi */}
      <LoadingOverlay visible={loading} message="Memverifikasi kredensial..." />
    </ScreenContainer>
  );
};

import { useRouter } from 'expo-router';
import { CheckCircle2, Mail } from 'lucide-react-native';
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
import { useTheme } from '../../../providers/theme-provider';
import { AuthHeader } from '../components/auth-header';
import { authService } from '../services/auth-service';

export const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
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

  const handleReset = async () => {
    if (!email) {
      setError('Masukkan email Anda');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.resetPasswordForEmail(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message || 'Gagal mengirim instruksi reset');
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
            title="Lupa Kata Sandi"
            subtitle="Masukkan email akun Anda untuk menerima tautan pemulihan kata sandi"
          />

          {/* CARD GLASSMORPHIC: Membungkus instruksi & form pemulihan */}
          <GlassCard
            variant="glass"
            intensity={55}
            className="border border-border-light dark:border-border-dark rounded-3xl shadow-lg mb-4"
            contentStyle={{ padding: 20 }}
          >
            {sent ? (
              /* Tampilan Sukses Pengiriman Email Pemulihan */
              <View className="items-center py-2">
                <View className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-green-500/15">
                  <CheckCircle2 size={36} color="#22C55E" />
                </View>

                <Text
                  className="text-base font-semibold text-center mb-2"
                  style={{ color: isDark ? '#FFFFFF' : '#111111' }}
                >
                  Instruksi Terkirim
                </Text>

                <Text
                  className="text-[13px] text-center mb-6 leading-5"
                  style={{ color: isDark ? '#A3A3A3' : '#737373' }}
                >
                  Tautan pemulihan telah dikirim ke{' '}
                  <Text
                    className="font-semibold"
                    style={{ color: isDark ? '#FFFFFF' : '#111111' }}
                  >
                    {email}
                  </Text>
                  . Silakan cek kotak masuk atau folder spam Anda.
                </Text>

                <GlassButton
                  title="Kembali ke Masuk"
                  onPress={() => router.replace(ROUTES.AUTH.LOGIN as any)}
                  size="lg"
                  variant="primary"
                  className="w-full"
                />
              </View>
            ) : (
              /* Form Input Email untuk Pengiriman Instruksi */
              <>
                {error && (
                  <View className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">
                    <Text className="text-[13px] text-center font-medium text-red-500">
                      {error}
                    </Text>
                  </View>
                )}

                <GlassInput
                  label="Email Terdaftar"
                  placeholder="nama@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon={<Mail size={20} color={isDark ? '#A3A3A3' : '#737373'} />}
                  className="mb-5"
                />

                <GlassButton
                  title="Kirim Instruksi Pemulihan"
                  onPress={handleReset}
                  loading={loading}
                  size="lg"
                  variant="primary"
                  className="w-full"
                />

                <AppDivider className="my-4" />

                {/* Tautan kembali ke halaman Login tepat di bawah button kirim instruksi */}
                <View className="flex-row justify-center items-center py-1">
                  <Text
                    className="text-sm"
                    style={{ color: isDark ? '#A3A3A3' : '#737373' }}
                  >
                    Sudah memiliki akun?{' '}
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
                      Masuk
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </GlassCard>
        </KeyboardWrapper>
      </Animated.View>

      <LoadingOverlay visible={loading} message="Mengirim tautan pemulihan..." />
    </ScreenContainer>
  );
};

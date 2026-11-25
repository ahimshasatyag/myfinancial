import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../../providers/auth-provider';
import { ROUTES } from '../../../constants/routes';

// Lebar progress track yang konsisten dan pas di semua viewport (320px - 4K)
const TRACK_WIDTH = 260;

interface StageInfo {
  text: string;
  isComplete: boolean;
}

const STAGES: StageInfo[] = [
  { text: 'Menghubungkan ke server...', isComplete: false },
  { text: 'Menyinkronkan data...', isComplete: false },
  { text: 'Hampir selesai...', isComplete: false },
  { text: 'Sinkronisasi berhasil', isComplete: true },
];

export const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Animasi berjalan pada UI Thread (Native Driver GPU transform di Mobile, JS fallback di Web)
  const isNative = Platform.OS !== 'web';
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Nilai awal opacity = 1 agar langsung tampil di layar sejak SSR / frame pertama (tanpa blank hitam)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  // State teroptimasi untuk membatasi re-render React
  const [stageIndex, setStageIndex] = useState(0);
  const [percent, setPercent] = useState(0);
  const lastPercentRef = useRef(0);
  const currentStageRef = useRef(0);
  const hasNavigated = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCompleteNavigation = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    // requestAnimationFrame menjamin transisi rute dipanggil setelah animasi frame selesai
    requestAnimationFrame(() => {
      if (isAuthenticated) {
        router.replace(ROUTES.TABS.DASHBOARD as any);
      } else {
        router.replace(ROUTES.AUTH.LOGIN as any);
      }
    });
  };

  useEffect(() => {
    // 1. Throttled listener: membatasi re-render React (hanya per kelipatan 5%)
    const listenerId = progressAnim.addListener(({ value }) => {
      const p = Math.min(100, Math.round(value * 100));

      if (p - lastPercentRef.current >= 5 || p === 100) {
        lastPercentRef.current = p;
        setPercent(p);
      }

      let nextStage = 0;
      if (p >= 100) nextStage = 3;
      else if (p >= 80) nextStage = 2;
      else if (p >= 20) nextStage = 1;

      if (nextStage !== currentStageRef.current) {
        currentStageRef.current = nextStage;
        setStageIndex(nextStage);
      }
    });

    // 2. Loading Line Animation di UI Thread via GPU transform (translateX)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: isNative,
    }).start(({ finished }) => {
      if (finished) {
        timeoutRef.current = setTimeout(() => {
          // 3. Exit Animation (Fade out + subtle scale & lift)
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 380,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: isNative,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.96,
              duration: 380,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: isNative,
            }),
            Animated.timing(translateYAnim, {
              toValue: -8,
              duration: 380,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: isNative,
            }),
          ]).start(() => {
            handleCompleteNavigation();
          });
        }, 600);
      }
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      progressAnim.removeListener(listenerId);
    };
  }, [isAuthenticated, isNative]);

  // Interpolasi translateX (Hardware-Accelerated GPU Transform: dari -260px ke 0px)
  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-TRACK_WIDTH, 0],
  });

  const currentStage = STAGES[stageIndex];

  return (
    <View
      className="flex-1 w-full h-full bg-[#090909] items-center justify-center"
      renderToHardwareTextureAndroid
      shouldRasterizeIOS
    >
      <StatusBar style="light" />

      <Animated.View
        style={{
          width: '100%',
          maxWidth: 420,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
        }}
        className="w-full max-w-[420px] items-center justify-center px-6"
      >
        {/* GIF Logo Animated: Aspect ratio 16:9, centered, responsive */}
        <View className="w-full max-w-[280px] h-[160px] items-center justify-center mb-8 overflow-hidden">
          <Image
            source={require('../../../../assets/images/logo/budgetku.gif')}
            className="w-full h-full max-w-[280px] max-h-[160px]"
            resizeMode="contain"
          />
        </View>

        {/* Loading Progress Bar Line */}
        <View className="w-[260px] items-center">
          {/* Progress Track (Background Line) */}
          <View
            className="w-[260px] h-[3.5px] bg-white/20 rounded-full overflow-hidden"
            style={{
              width: TRACK_WIDTH,
              height: 3.5,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {/* Moving Indicator Bar (Fill Line) - Memiliki style eksplisit agar selalu ter-render */}
            <Animated.View
              style={{
                width: TRACK_WIDTH,
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                transform: [{ translateX }],
              }}
            />
          </View>

          {/* Keterangan Status Berdasarkan Tahapan & Persentase */}
          <View className="w-[260px] flex-row justify-between items-center mt-2.5">
            <Text
              className={`flex-1 text-[11px] tracking-wide mr-2 ${
                currentStage.isComplete ? 'text-[#E5E5E5] font-semibold' : 'text-[#737373] font-medium'
              }`}
              style={{
                color: currentStage.isComplete ? '#E5E5E5' : '#737373',
                fontSize: 11,
                fontWeight: currentStage.isComplete ? '600' : '500',
              }}
              numberOfLines={1}
            >
              {currentStage.text}
            </Text>
            <Text
              className={`text-[11px] font-semibold ${
                currentStage.isComplete ? 'text-white' : 'text-[#A3A3A3]'
              }`}
              style={{
                color: currentStage.isComplete ? '#FFFFFF' : '#A3A3A3',
                fontSize: 11,
                fontWeight: '600',
              }}
            >
              {percent}%
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeftRight,
  BarChart3,
  Home,
  LayoutDashboard,
  PieChart,
  Search,
  Settings,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';

export interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation?: any;
  emitter?: any;
  navigateToTab?: (routeKey: string) => void;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  emitter,
  navigateToTab,
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [tabsWidth, setTabsWidth] = useState<number>(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isInitialized = useRef<boolean>(false);

  // Filter visible routes (in case any route has href: null or tabBarButton: () => null)
  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key] || {};
    return options?.href !== null;
  });

  const activeIndex = visibleRoutes.findIndex(
    (route: any) => state.routes[state.index]?.key === route.key
  );
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;

  const tabCount = visibleRoutes.length || 1;
  const horizontalPadding = 4;
  const availableWidth = tabsWidth > 0 ? tabsWidth - horizontalPadding * 2 : 0;
  const tabWidth = availableWidth > 0 ? availableWidth / tabCount : 0;
  const pillMargin = 2;
  const pillWidth = Math.max(tabWidth - pillMargin * 2, 0);

  useEffect(() => {
    if (tabWidth > 0) {
      const targetX = currentIndex * tabWidth + pillMargin;
      if (!isInitialized.current) {
        slideAnim.setValue(targetX);
        isInitialized.current = true;
      } else {
        Animated.spring(slideAnim, {
          toValue: targetX,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
          mass: 0.8,
        }).start();
      }
    }
  }, [currentIndex, tabWidth]);

  const getIcon = (routeName: string, isFocused: boolean) => {
    const activeColor = isDark ? '#FFFFFF' : theme.colors.button;
    const inactiveColor = isDark ? 'rgba(255, 255, 255, 0.7)' : theme.colors.textMuted;
    const color = isFocused ? activeColor : inactiveColor;
    const size = 22;

    switch (routeName.toLowerCase()) {
      case 'index':
      case 'home':
        if (isFocused) {
          // Silhouette filled house matching the image
          return (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.293 2.293a1 1 0 0 1 1.414 0l8.5 8.5A1 1 0 0 1 21 12v8a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v5a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-8a1 1 0 0 1 .293-.707l8-8z"
              />
            </Svg>
          );
        }
        return <Home size={size} color={color} strokeWidth={2} />;

      case 'feed':
        return (
          <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={isFocused ? 2.4 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Rect x="4" y="5" width="13" height="15" rx="3" />
            <Path d="M8 10h5" />
            <Path d="M8 14h3" />
            <Circle cx="17" cy="5" r="2.5" fill={color} stroke="none" />
          </Svg>
        );

      case 'search':
        return <Search size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;

      case 'transactions':
        return <ArrowLeftRight size={size} color={color} strokeWidth={isFocused ? 2.4 : 2} />;

      case 'budgets':
        return <PieChart size={size} color={color} strokeWidth={isFocused ? 2.4 : 2} />;

      case 'reports':
        return <BarChart3 size={size} color={color} strokeWidth={isFocused ? 2.4 : 2} />;

      case 'settings':
        return <Settings size={size} color={color} strokeWidth={isFocused ? 2.4 : 2} />;

      default:
        return <LayoutDashboard size={size} color={color} strokeWidth={isFocused ? 2.4 : 2} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName.toLowerCase()) {
      case 'index':
      case 'home':
        return 'Home';
      case 'feed':
        return 'Feed';
      case 'search':
        return 'Search';
      case 'transactions':
        return 'Transaksi';
      case 'budgets':
        return 'Anggaran';
      case 'reports':
        return 'Laporan';
      case 'settings':
        return 'Settings';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          bottom: Math.max(insets.bottom, 16),
          shadowOpacity: isDark ? 0.45 : 0.15,
        },
      ]}
    >
      <View
        style={[
          styles.tabBarContainer,
          {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      >
        <BlurView
          intensity={85}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(24, 24, 27, 0.82)' : 'rgba(255, 255, 255, 0.88)',
            },
          ]}
        />

        <View
          style={styles.tabsRow}
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            if (width > 0 && width !== tabsWidth) {
              setTabsWidth(width);
            }
          }}
        >
          {/* Animated active pill indicator */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePillContainer,
              {
                width: pillWidth,
                transform: [{ translateX: slideAnim }],
                opacity: tabsWidth > 0 ? 1 : 0,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.12)',
              },
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.08)']
                  : ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.1)']
              }
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.activePillGradient}
            />
          </Animated.View>

          {/* Tab items */}
          {visibleRoutes.map((route: any, index: number) => {
            const { options } = descriptors[route.key] || {};
            const isFocused = currentIndex === index;

            const activeColor = isDark ? '#FFFFFF' : theme.colors.button;
            const inactiveColor = isDark ? 'rgba(255, 255, 255, 0.7)' : theme.colors.textMuted;
            const color = isFocused ? activeColor : inactiveColor;

            const onPress = () => {
              const event = (emitter ?? navigation)?.emit?.({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event?.defaultPrevented) {
                if (navigateToTab) {
                  navigateToTab(route.key);
                } else if (navigation?.navigate) {
                  navigation.navigate(route.name);
                }
              }
            };

            const onLongPress = () => {
              (emitter ?? navigation)?.emit?.({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const icon =
              options?.tabBarIcon !== undefined
                ? typeof options.tabBarIcon === 'function'
                  ? options.tabBarIcon({ focused: isFocused, color, size: 22 })
                  : options.tabBarIcon
                : getIcon(route.name, isFocused);

            const label =
              options?.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options?.title !== undefined
                ? options.title
                : getLabel(route.name);

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options?.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
                activeOpacity={0.75}
              >
                {icon}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? (isDark ? '#FFFFFF' : theme.colors.text)
                        : (isDark ? 'rgba(255, 255, 255, 0.7)' : theme.colors.textMuted),
                      fontWeight: isFocused ? '600' : '500',
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 66,
    borderRadius: 33,
    // Outer shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
    zIndex: 100,
  },
  tabBarContainer: {
    flex: 1,
    borderRadius: 33,
    overflow: 'hidden',
    borderWidth: 1.2,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  activePillContainer: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    left: 4,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
  },
  activePillGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.1,
  },
});

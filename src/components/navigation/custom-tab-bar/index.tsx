import { BlurView } from 'expo-blur';
import { ArrowLeftRight, BarChart3, LayoutDashboard, PieChart, Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const getIcon = (routeName: string, isFocused: boolean) => {
    const color = isFocused ? theme.colors.button : theme.colors.textMuted;
    const size = 22;

    switch (routeName) {
      case 'index':
        return <LayoutDashboard size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'transactions':
        return <ArrowLeftRight size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'budgets':
        return <PieChart size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'reports':
        return <BarChart3 size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'settings':
        return <Settings size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
      default:
        return <LayoutDashboard size={size} color={color} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Beranda';
      case 'transactions':
        return 'Transaksi';
      case 'budgets':
        return 'Anggaran';
      case 'reports':
        return 'Laporan';
      case 'settings':
        return 'Pengaturan';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <BlurView
        intensity={60}
        tint={isDark ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFill,
          {
            // Standard: Light: White glass | Dark: Dark glass
            backgroundColor: isDark ? 'rgba(21, 21, 21, 0.88)' : 'rgba(255, 255, 255, 0.88)',
          },
        ]}
      />
      <View style={styles.tabsRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

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

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {getIcon(route.name, isFocused)}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? theme.colors.button : theme.colors.textMuted,
                    fontWeight: isFocused ? '600' : '400',
                  },
                ]}
              >
                {getLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

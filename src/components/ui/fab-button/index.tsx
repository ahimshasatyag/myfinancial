import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../providers/theme-provider';

export interface FabButtonProps {
  onPress: () => void;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  /** Set true on bottom-tab screens so the FAB floats cleanly above CustomTabBar */
  hasTabBar?: boolean;
  style?: ViewStyle;
}

export const FabButton: React.FC<FabButtonProps> = ({
  onPress,
  icon,
  accessibilityLabel = 'Tambah baru',
  hasTabBar = false,
  style,
}) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomOffset = hasTabBar
    ? Math.max(insets.bottom, 16) + 82
    : Math.max(insets.bottom, 20) + 8;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="absolute right-5 w-14 h-14 rounded-full items-center justify-center z-50"
      style={[
        {
          bottom: bottomOffset,
          backgroundColor: theme.colors.button,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark ? 0.45 : 0.22,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
    >
      {icon ?? <Plus size={24} color={theme.colors.buttonText} strokeWidth={2.5} />}
    </TouchableOpacity>
  );
};

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface AppCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? theme.colors.button : theme.colors.border,
            backgroundColor: checked ? theme.colors.button : 'transparent',
            borderRadius: theme.radius.xs,
          },
        ]}
      >
        {checked && <Check size={14} color={theme.colors.buttonText} strokeWidth={3} />}
      </View>
      {label && <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
});

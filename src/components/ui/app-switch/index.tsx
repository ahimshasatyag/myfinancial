import React from 'react';
import { Switch, SwitchProps, Platform } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export const AppSwitch: React.FC<SwitchProps> = (props) => {
  const { theme, isDark } = useTheme();

  return (
    <Switch
      trackColor={{
        false: isDark ? '#333333' : '#E5E5E5',
        true: isDark ? '#FFFFFF' : '#171717',
      }}
      thumbColor={props.value ? (isDark ? '#111111' : '#FFFFFF') : isDark ? '#888888' : '#FFFFFF'}
      ios_backgroundColor={isDark ? '#333333' : '#E5E5E5'}
      {...props}
    />
  );
};

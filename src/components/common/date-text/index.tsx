import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { formatDate } from '../../../utils/date';
import { useTheme } from '../../../providers/theme-provider';

export interface DateTextProps {
  date: string | Date;
  format?: 'short' | 'medium' | 'long' | 'relative';
  style?: StyleProp<TextStyle>;
}

export const DateText: React.FC<DateTextProps> = ({ date, format = 'medium', style }) => {
  const { theme } = useTheme();

  return (
    <Text style={[{ color: theme.colors.textSecondary, fontSize: 13 }, style]}>
      {formatDate(date, format)}
    </Text>
  );
};

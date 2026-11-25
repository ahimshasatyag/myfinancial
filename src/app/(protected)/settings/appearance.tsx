import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { GlassCard } from '../../../components/ui/glass-card';
import { useTheme } from '../../../providers/theme-provider';

export default function AppearanceScreen() {
  const { theme, setThemePreference, themePreference } = useTheme();

  const options: { label: string; value: 'light' | 'dark' | 'system'; desc: string }[] = [
    { label: 'Terang (Light)', value: 'light', desc: 'Latar belakang #F5F5F5, tombol #171717' },
    { label: 'Gelap (Dark)', value: 'dark', desc: 'Latar belakang #090909, tombol #F5F5F5' },
    { label: 'Ikuti Sistem', value: 'system', desc: 'Menyesuaikan dengan mode sistem operasi' },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader title="Tampilan & Tema" showBack />
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          {options.map((opt, idx) => {
            const active = themePreference === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => setThemePreference(opt.value)}
                style={[
                  styles.item,
                  idx < options.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                  },
                ]}
              >
                <View>
                  <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{opt.label}</Text>
                  <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>{opt.desc}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: active ? theme.colors.button : theme.colors.border,
                    },
                  ]}
                >
                  {active && (
                    <View style={[styles.radioDot, { backgroundColor: theme.colors.button }]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

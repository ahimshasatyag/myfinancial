import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../../components/layout/screen-container';
import { ScreenHeader } from '../../../components/layout/screen-header';
import { AppAvatar } from '../../../components/ui/app-avatar';
import { GlassInput } from '../../../components/ui/glass-input';
import { GlassButton } from '../../../components/ui/glass-button';
import { useAuth } from '../../../providers/auth-provider';
import { supabase } from '../../../lib/supabase/client';

export const ProfileScreen: React.FC = () => {
  const { profile, refreshUser } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    await (supabase as any).from('profiles').update({ full_name: name }).eq('id', profile.id);
    await refreshUser();
    setLoading(false);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Profil Pengguna" showBack />
      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <AppAvatar name={name} size={72} />
        </View>
        <GlassInput label="Nama Lengkap" value={name} onChangeText={setName} />
        <GlassButton title="Simpan Perubahan" onPress={handleSave} loading={loading} size="lg" />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

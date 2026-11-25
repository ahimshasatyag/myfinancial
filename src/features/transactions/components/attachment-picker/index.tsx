import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { useTheme } from '../../../../providers/theme-provider';

export interface AttachmentPickerProps {
  imageUri?: string | null;
  onSelectImage: (uri: string | null) => void;
}

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({ imageUri, onSelectImage }) => {
  const { theme } = useTheme();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onSelectImage(result.assets[0].uri);
    }
  };

  if (imageUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <TouchableOpacity
          onPress={() => onSelectImage(null)}
          style={[styles.removeBtn, { backgroundColor: theme.colors.button }]}
        >
          <X size={14} color={theme.colors.buttonText} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={pickImage}
      style={[
        styles.pickerBox,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.cardMuted,
        },
      ]}
    >
      <ImageIcon size={22} color={theme.colors.textMuted} />
      <Text style={[styles.pickerText, { color: theme.colors.textSecondary }]}>
        Unggah Struk Bukti Transaksi
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pickerBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  pickerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  previewContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

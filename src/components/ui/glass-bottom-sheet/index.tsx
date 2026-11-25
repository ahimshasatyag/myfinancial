import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../providers/theme-provider';

export interface GlassBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}

export const GlassBottomSheet: React.FC<GlassBottomSheetProps> = ({
  visible,
  onClose,
  children,
  contentStyle,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContent,
                {
                  backgroundColor: theme.colors.modal,
                  borderColor: theme.colors.border,
                  borderTopLeftRadius: theme.radius['2xl'],
                  borderTopRightRadius: theme.radius['2xl'],
                  paddingBottom: Math.max(insets.bottom, 20),
                },
                contentStyle,
              ]}
            >
              <View style={styles.indicatorContainer}>
                <View style={[styles.indicator, { backgroundColor: theme.colors.border }]} />
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  indicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
});

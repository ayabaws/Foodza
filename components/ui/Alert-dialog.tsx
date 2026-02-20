import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function AlertDialog({
  visible,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Annuler',
}: AlertDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>

            {onConfirm && (
              <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmText}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#A64B2A',
  },
  confirmText: {
    color: 'white',
    fontWeight: '600',
  },
});
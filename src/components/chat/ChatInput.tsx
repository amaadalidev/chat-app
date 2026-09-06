import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  isUploading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  onPickImage,
  isUploading = false,
}) => {
  const canSend = value.trim().length > 0 && !isUploading;

  return (
    <View style={styles.container}>
      {/* Plus Attachment Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={onPickImage}
        disabled={isUploading}
        activeOpacity={0.7}
      >
        <Text style={styles.plusIcon}>+</Text>
      </TouchableOpacity>

      {/* Pill Input Container */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <TouchableOpacity
          style={styles.emojiButton}
          activeOpacity={0.7}
        >
          <Text style={styles.emojiIcon}>😊</Text>
        </TouchableOpacity>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          canSend ? styles.sendActive : styles.sendInactive,
        ]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.8}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.sendIcon}>➤</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 22,
    color: '#4F46E5',
    fontWeight: '400',
    lineHeight: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    paddingVertical: 8,
    maxHeight: 100,
  },
  emojiButton: {
    paddingLeft: 8,
  },
  emojiIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  sendInactive: {
    backgroundColor: '#818CF8',
    opacity: 0.6,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    transform: [{ rotate: '0deg' }],
  },
});

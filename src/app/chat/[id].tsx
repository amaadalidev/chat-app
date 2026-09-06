import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInput } from '../../components/chat/ChatInput';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { Avatar } from '../../components/ui/Avatar';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { LoadingView } from '../../components/ui/LoadingView';
import { imagePickerService } from '../../services/imagePickerService';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatViewModel } from '../../viewmodels/useChatViewModel';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    receiverId: string;
    receiverName: string;
    receiverPhoto: string;
    receiverOnline: string;
  }>();

  const conversationId = params.id || '';
  const receiverId = params.receiverId || '';
  const receiverName = params.receiverName || 'Chat';
  const receiverPhoto = params.receiverPhoto || null;
  const isReceiverOnline = params.receiverOnline === 'true';

  const currentUser = useAuthStore((state) => state.user);

  const {
    messages,
    inputText,
    isLoading,
    isLoadingMore,
    isUploadingImage,
    isOtherUserTyping,
    error,
    handleInputChange,
    handleSendMessage,
    handleSendImage,
    loadMoreMessages,
    handleDeleteMessage,
    clearError,
  } = useChatViewModel(conversationId, receiverId);

  const handlePickAndSendImage = async () => {
    try {
      const uri = await imagePickerService.pickImageFromLibrary();
      if (uri) {
        await handleSendImage(uri);
      }
    } catch {
      // Handled in viewmodel / service
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Custom Top Navigation Bar matching Mockup */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Avatar
            uri={receiverPhoto}
            name={receiverName}
            size="sm"
            isOnline={isReceiverOnline}
            showPresence
          />
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitleText} numberOfLines={1}>
              {receiverName}
            </Text>
            <Text style={styles.headerStatusText}>
              {isReceiverOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {error ? <ErrorBanner message={error} onDismiss={clearError} /> : null}

      {isLoading ? (
        <LoadingView message="Loading messages..." fullScreen={false} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isCurrentUser={item.senderId === currentUser?.id}
              onDelete={handleDeleteMessage}
            />
          )}
          contentContainerStyle={
            messages.length === 0 ? styles.emptyContainer : styles.messageListContent
          }
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreMessages}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <View style={styles.speechBubbleIllustration}>
                <View style={styles.bubblePrimary}>
                  <Text style={styles.bubbleDots}>•••</Text>
                </View>
                <View style={styles.bubbleSecondary} />
              </View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Start a conversation with {receiverName}
              </Text>
            </View>
          }
          ListHeaderComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="small"
                color="#4F46E5"
                style={styles.loadingMoreSpinner}
              />
            ) : null
          }
        />
      )}

      <TypingIndicator isTyping={isOtherUserTyping} userName={receiverName} />

      <ChatInput
        value={inputText}
        onChangeText={handleInputChange}
        onSend={() => handleSendMessage()}
        onPickImage={handlePickAndSendImage}
        isUploading={isUploadingImage}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  backChevron: {
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '300',
    lineHeight: 28,
    marginRight: 2,
  },
  backText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitleBox: {
    justifyContent: 'center',
  },
  headerTitleText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  headerStatusText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '500',
  },
  menuButton: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 4,
  },
  menuIcon: {
    fontSize: 22,
    color: '#0F172A',
  },
  messageListContent: {
    paddingVertical: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  speechBubbleIllustration: {
    width: 90,
    height: 70,
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubblePrimary: {
    width: 62,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  bubbleSecondary: {
    width: 50,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    position: 'absolute',
    right: 8,
    bottom: 2,
    zIndex: 1,
  },
  bubbleDots: {
    fontSize: 16,
    color: '#818CF8',
    letterSpacing: 2,
    fontWeight: '700',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  loadingMoreSpinner: {
    paddingVertical: 12,
  },
});

import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConversationItem } from '../../components/chat/ConversationItem';
import { BottomTabBar } from '../../components/ui/BottomTabBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { LoadingView } from '../../components/ui/LoadingView';
import { ConversationWithOtherUser } from '../../models/conversation';
import { useConversationsViewModel } from '../../viewmodels/useConversationsViewModel';

export default function ConversationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, isLoading, error } = useConversationsViewModel();

  const handleOpenConversation = (conv: ConversationWithOtherUser) => {
    router.push({
      pathname: '/chat/[id]' as any,
      params: {
        id: conv.id,
        receiverId: conv.otherUser.id,
        receiverName: conv.otherUser.displayName,
        receiverPhoto: conv.otherUser.photoURL || '',
        receiverOnline: conv.otherUser.isOnline ? 'true' : 'false',
      },
    });
  };

  if (isLoading) {
    return <LoadingView message="Loading conversations..." fullScreen={false} />;
  }

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={handleOpenConversation}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Conversations Yet"
            description="Start chatting by browsing users in the New Conversation tab."
            actionTitle="Find People"
            onAction={() => router.push('/(main)/search' as any)}
          />
        }
        contentContainerStyle={
          conversations.length === 0 ? styles.emptyContainer : styles.listContent
        }
      />

      {/* Bottom Tab Navigation */}
      <BottomTabBar activeTab="chats" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  listContent: {
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

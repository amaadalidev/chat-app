import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/ui/Avatar';
import { BottomTabBar } from '../../components/ui/BottomTabBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { LoadingView } from '../../components/ui/LoadingView';
import { UserProfile } from '../../models/user';
import { useSearchViewModel } from '../../viewmodels/useSearchViewModel';

export default function UserSearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    error,
    startConversationWithUser,
  } = useSearchViewModel();

  const handleSelectUser = async (user: UserProfile) => {
    try {
      const conv = await startConversationWithUser(user.id);
      router.push({
        pathname: '/chat/[id]' as any,
        params: {
          id: conv.id,
          receiverId: user.id,
          receiverName: user.displayName,
          receiverPhoto: user.photoURL || '',
          receiverOnline: user.isOnline ? 'true' : 'false',
        },
      });
    } catch {
      // Error handled inside viewmodel
    }
  };

  return (
    <View style={styles.container}>
      {/* Centered Title Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.headerTitle}>New Conversation</Text>
      </View>

      {/* Pill Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchPill}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {error ? <ErrorBanner message={error} /> : null}

      {isLoading ? (
        <LoadingView message="Loading users..." fullScreen={false} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => handleSelectUser(item)}
              activeOpacity={0.65}
            >
              <Avatar
                uri={item.photoURL}
                name={item.displayName}
                size="md"
                isOnline={item.isOnline}
                showPresence
              />
              <View style={styles.userInfo}>
                <Text style={styles.displayName}>{item.displayName}</Text>
                <Text style={styles.emailText}>{item.email}</Text>
                {item.bio ? (
                  <Text style={styles.bioText} numberOfLines={1}>
                    {item.bio}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.chatActionBtn}
                onPress={() => handleSelectUser(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.chatActionIcon}>💬</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            searchQuery.trim().length > 0 ? (
              <EmptyState
                title="No Users Found"
                description={`No user accounts match "${searchQuery}".`}
              />
            ) : (
              <EmptyState
                title="No Users Found"
                description="No other registered users available to chat with yet."
              />
            )
          }
          contentContainerStyle={
            searchResults.length === 0 ? styles.emptyContainer : styles.listContent
          }
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="users" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 8,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  emailText: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 2,
  },
  bioText: {
    color: '#64748B',
    fontSize: 12,
  },
  chatActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatActionIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 62,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

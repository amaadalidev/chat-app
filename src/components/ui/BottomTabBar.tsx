import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabName = 'chats' | 'users' | 'settings';

export interface BottomTabBarProps {
  activeTab: TabName;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.barContent}>
        {/* Chats Tab */}
        <TouchableOpacity
          onPress={() => router.push('/(main)' as any)}
          style={[styles.tabItem, activeTab === 'chats' ? styles.activeTabPill : null]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'chats' ? styles.activeTabIcon : styles.inactiveTabIcon]}>
            💬
          </Text>
        </TouchableOpacity>

        {/* Users / New Conversation Tab */}
        <TouchableOpacity
          onPress={() => router.push('/(main)/search' as any)}
          style={[styles.tabItem, activeTab === 'users' ? styles.activeTabPill : null]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'users' ? styles.activeTabIcon : styles.inactiveTabIcon]}>
            👥
          </Text>
        </TouchableOpacity>

        {/* Profile / Settings Tab */}
        <TouchableOpacity
          onPress={() => router.push('/(main)/profile' as any)}
          style={[styles.tabItem, activeTab === 'settings' ? styles.activeTabPill : null]}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'settings' ? styles.activeTabIcon : styles.inactiveTabIcon]}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabPill: {
    backgroundColor: '#EEF2FF',
  },
  tabIcon: {
    fontSize: 20,
  },
  activeTabIcon: {
    opacity: 1,
  },
  inactiveTabIcon: {
    opacity: 0.45,
  },
});

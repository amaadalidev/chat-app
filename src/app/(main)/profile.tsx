import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { Input } from '../../components/ui/Input';
import { useAuthViewModel } from '../../viewmodels/useAuthViewModel';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { handleLogout, isLoading: isLoggingOut } = useAuthViewModel();
  const {
    user,
    profileForm,
    handleUpdateProfile,
    isLoading: isUpdatingProfile,
    error,
    successMessage,
    clearMessages,
  } = useProfileViewModel();

  const { control } = profileForm;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={styles.placeholderRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            uri={user?.photoURL}
            name={user?.displayName}
            size="xl"
            isOnline={user?.isOnline}
            showPresence
          />
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Form Card */}
        <View style={styles.cardContainer}>
          {error ? <ErrorBanner message={error} onDismiss={clearMessages} /> : null}

          {successMessage ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Display Name"
                placeholder="Your name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                leftIcon={<Text style={styles.inputIcon}>👤</Text>}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Bio"
                placeholder="Hey there! I am using ChatApp."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                leftIcon={<Text style={styles.inputIcon}>💬</Text>}
                error={error?.message}
              />
            )}
          />

          <Button
            title="Save Profile"
            onPress={handleUpdateProfile}
            isLoading={isUpdatingProfile}
            leftIcon={<Text style={styles.btnIcon}>💾</Text>}
            size="md"
            style={styles.saveButton}
          />

          <Button
            title="Sign Out"
            onPress={handleLogout}
            isLoading={isLoggingOut}
            variant="dangerOutline"
            leftIcon={<Text style={styles.signOutIcon}>↪</Text>}
            size="md"
            style={styles.signOutButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 34,
    color: '#0F172A',
    fontWeight: '300',
    lineHeight: 34,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  placeholderRight: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 16,
    color: '#64748B',
  },
  btnIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 4,
  },
  signOutIcon: {
    fontSize: 18,
    color: '#EF4444',
    marginRight: 4,
  },
  saveButton: {
    marginTop: 12,
  },
  signOutButton: {
    marginTop: 12,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: '#059669',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

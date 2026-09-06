import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { authRepository } from '../repositories/AuthRepository';
import { userRepository } from '../repositories/UserRepository';
import { notificationService } from '../services/notificationService';
import { useAuthStore } from '../store/useAuthStore';
import { SplashScreen } from '../components/ui/SplashScreen';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialLoading = useAuthStore((state) => state.isInitialLoading);
  const setUser = useAuthStore((state) => state.setUser);

  // Listen to Firebase Auth state change
  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((profile) => {
      setUser(profile);
    });
    return () => unsubscribe();
  }, [setUser]);

  // Push notification token registration for authenticated user
  useEffect(() => {
    if (user?.id) {
      notificationService.registerForPushNotifications().then((token) => {
        if (token && token !== user.pushToken) {
          userRepository.updateUserProfile(user.id, { pushToken: token }).catch(() => {});
        }
      });
    }
  }, [user]);

  // Auth Protection Navigation Guard
  useEffect(() => {
    if (isInitialLoading) return;

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === '(auth)';
    const inMainGroup = currentSegment === '(main)' || currentSegment === 'chat';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user to login screen
      router.replace('/(auth)/login' as any);
    } else if (isAuthenticated && !inMainGroup) {
      // Redirect authenticated user to main conversation list
      router.replace('/(main)' as any);
    }
  }, [isAuthenticated, isInitialLoading, segments, router]);

  if (isInitialLoading) {
    return <SplashScreen message="Initializing ChatApp..." />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

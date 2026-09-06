import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { LoadingView } from '../components/ui/LoadingView';

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitialLoading = useAuthStore((state) => state.isInitialLoading);

  if (isInitialLoading) {
    return <LoadingView message="Initializing ChatApp..." fullScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href={'/(main)' as any} />;
  }

  return <Redirect href={'/(auth)/login' as any} />;
}

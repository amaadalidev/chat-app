/**
 * Firebase Configuration Options from Expo Environment Variables
 * Pre-configured with EXPO_PUBLIC_ prefix for client side safety.
 */
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDCntyPrWeh5IEkDZiSZbZTCeFYIQcLvT4',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'chatapp-1beb3.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chatapp-1beb3',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'chatapp-1beb3.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '707593388737',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:707593388737:web:d8be2e959b74c27d104a40',
};

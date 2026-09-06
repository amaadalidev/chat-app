export const colors = {
  // Clean Modern Light Theme (Matches Reference Design)
  background: '#F8FAFC', // Crisp soft background
  surface: '#FFFFFF', // Pure white card surface
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Soft input / pill background
  surfaceHover: '#E2E8F0',

  // Brand Accents & Gradients
  primary: '#4F46E5', // Vibrant Indigo/Royal Blue
  primaryDark: '#4338CA',
  primaryLight: '#818CF8',
  primaryMuted: '#EEF2FF', // Active tab / selected pill background
  primaryGlow: 'rgba(79, 70, 229, 0.25)',

  secondary: '#EC4899',
  accent: '#10B981', // Emerald Online Indicator

  // Text Hierarchy
  textPrimary: '#0F172A', // Deep dark slate
  textSecondary: '#64748B', // Medium slate
  textMuted: '#94A3B8', // Placeholder / timestamp gray
  textDisabled: '#CBD5E1',
  textOnPrimary: '#FFFFFF',

  // Real-time Status Colors
  online: '#10B981',
  offline: '#94A3B8',
  error: '#EF4444',
  errorBorder: '#FCA5A5',
  errorMuted: '#FEF2F2',
  warning: '#F59E0B',
  success: '#10B981',

  // Chat Bubble Styling
  sentBubble: '#4F46E5',
  sentBubbleText: '#FFFFFF',
  receivedBubble: '#F1F5F9',
  receivedBubbleText: '#0F172A',

  // Input & Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#4F46E5',
  inputBackground: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputFocusBorder: '#4F46E5',

  // Tab & Floating Bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabBarActivePill: '#EEF2FF',
  tabBarActiveIcon: '#4F46E5',
  tabBarInactiveIcon: '#94A3B8',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export type Colors = typeof colors;

export const COLORS = {
  // Primary Brand — Trustworthy Royal Blue
  primary: '#0066FF',
  primaryDark: '#004CDE',
  primaryLight: '#4D94FF',
  primaryGhost: 'rgba(0, 102, 255, 0.08)',

  // Accent — Emerald Green for success and trust
  accent: '#10B981',
  accentLight: '#34D399',

  // Backgrounds — Clean Light Mode
  background: '#F8FAFC', // Very subtle cool off-white for main background
  surface: '#FFFFFF',    // Pure white for cards/surfaces
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardBorder: '#E2E8F0', // Subtle light border
  
  // Glassmorphism overlays
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(0, 0, 0, 0.05)',

  // Text hierarchy - High contrast for light mode
  text: '#000000',         // Pure black for absolute clarity
  textSecondary: '#333333', // Dark gray for subtext
  textMuted: '#666666',    // Medium gray for placeholders/meta

  // Semantic colors (Standard, professional)
  success: '#059669',
  successLight: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  successBorder: 'rgba(16, 185, 129, 0.2)',

  warning: '#D97706',
  warningLight: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  warningBorder: 'rgba(245, 158, 11, 0.2)',

  danger: '#DC2626',
  dangerLight: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  dangerBorder: 'rgba(239, 68, 68, 0.2)',

  info: '#4F46E5',
  infoLight: '#6366F1',
  infoBg: 'rgba(79, 70, 229, 0.1)',

  // UI elements
  border: '#E2E8F0',
  divider: '#F1F5F9',
  inputBg: '#F8FAFC',
  inputBorder: '#CBD5E1',
  inputFocus: '#0066FF',

  white: '#FFFFFF',
  black: '#000000',

  // Status pill colors
  statusPending: '#D97706',
  statusPendingBg: 'rgba(245, 158, 11, 0.1)',
  statusConfirmed: '#0066FF',
  statusConfirmedBg: 'rgba(0, 102, 255, 0.1)',
  statusActive: '#059669',
  statusActiveBg: 'rgba(16, 185, 129, 0.1)',
  statusCompleted: '#475569',
  statusCompletedBg: 'rgba(71, 85, 105, 0.1)',
  statusCancelled: '#DC2626',
  statusCancelledBg: 'rgba(239, 68, 68, 0.1)',
};

export const SHADOWS = {
  small: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  }
};

export const TYPOGRAPHY = {
  heading1: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  heading2: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  heading3: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
  bodyMedium: { fontSize: 14, fontWeight: '700', letterSpacing: 0.1 },
  caption: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

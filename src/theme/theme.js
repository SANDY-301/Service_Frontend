export const COLORS = {
  // Primary Brand — Deep Indigo Blue (industry standard)
  primary: '#1A56DB',
  primaryDark: '#1342B0',
  primaryLight: '#4F83F1',
  primaryGhost: 'rgba(26, 86, 219, 0.12)',

  // Accent — Teal (complements deep blue)
  accent: '#0891B2',
  accentLight: '#22D3EE',

  // Backgrounds — True dark slate
  background: '#0B1120',
  surface: '#111827',
  card: '#1A2236',
  cardElevated: '#202C42',
  cardBorder: '#2D3A52',

  // Text hierarchy
  text: '#F1F5F9',
  textSecondary: '#8B97B0',
  textMuted: '#4D5E7A',

  // Semantic colors
  success: '#059669',
  successLight: '#10B981',
  successBg: 'rgba(5, 150, 105, 0.12)',
  successBorder: 'rgba(16, 185, 129, 0.3)',

  warning: '#D97706',
  warningLight: '#F59E0B',
  warningBg: 'rgba(217, 119, 6, 0.12)',
  warningBorder: 'rgba(245, 158, 11, 0.3)',

  danger: '#DC2626',
  dangerLight: '#EF4444',
  dangerBg: 'rgba(220, 38, 38, 0.12)',
  dangerBorder: 'rgba(239, 68, 68, 0.3)',

  info: '#7C3AED',
  infoLight: '#8B5CF6',
  infoBg: 'rgba(124, 58, 237, 0.12)',

  // UI elements
  border: '#2D3A52',
  divider: '#1E2D45',
  inputBg: '#0D1626',
  inputBorder: '#2D3A52',
  inputFocus: '#1A56DB',

  white: '#FFFFFF',
  black: '#000000',

  // Status pill colors
  statusPending: '#D97706',
  statusPendingBg: 'rgba(217,119,6,0.12)',
  statusConfirmed: '#1A56DB',
  statusConfirmedBg: 'rgba(26,86,219,0.12)',
  statusActive: '#059669',
  statusActiveBg: 'rgba(5,150,105,0.12)',
  statusCompleted: '#8B97B0',
  statusCompletedBg: 'rgba(139,151,176,0.10)',
  statusCancelled: '#DC2626',
  statusCancelledBg: 'rgba(220,38,38,0.12)',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const TYPOGRAPHY = {
  heading1: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  heading2: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
  heading3: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 14, fontWeight: '400' },
  bodyMedium: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '500' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

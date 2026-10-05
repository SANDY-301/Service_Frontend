import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

const STATUS_CONFIG = {
  VERIFIED:     { bg: COLORS.successBg,   border: COLORS.successBorder,  text: COLORS.successLight,  icon: 'checkmark-circle',  label: 'Verified' },
  ACTIVE:       { bg: COLORS.successBg,   border: COLORS.successBorder,  text: COLORS.successLight,  icon: 'checkmark-circle',  label: 'Active' },
  CONFIRMED:    { bg: COLORS.infoBg,      border: 'rgba(124,58,237,0.3)',text: COLORS.infoLight,     icon: 'radio-button-on',   label: 'Confirmed' },
  COMPLETED:    { bg: COLORS.statusCompletedBg, border: 'rgba(139,151,176,0.25)', text: COLORS.textSecondary, icon: 'checkmark-done-circle', label: 'Completed' },
  PENDING:      { bg: COLORS.warningBg,   border: COLORS.warningBorder,  text: COLORS.warningLight,  icon: 'time-outline',      label: 'Pending' },
  IN_PROGRESS:  { bg: COLORS.primaryGhost,border: 'rgba(26,86,219,0.3)', text: COLORS.primaryLight,  icon: 'sync-outline',      label: 'In Progress' },
  ASSIGNED:     { bg: COLORS.primaryGhost,border: 'rgba(26,86,219,0.3)', text: COLORS.primaryLight,  icon: 'person-outline',    label: 'Assigned' },
  NEEDS_REVIEW: { bg: COLORS.warningBg,   border: COLORS.warningBorder,  text: COLORS.warningLight,  icon: 'alert-circle-outline', label: 'Review' },
  REJECTED:     { bg: COLORS.dangerBg,    border: COLORS.dangerBorder,   text: COLORS.dangerLight,   icon: 'close-circle',      label: 'Rejected' },
  EXPIRED:      { bg: COLORS.dangerBg,    border: COLORS.dangerBorder,   text: COLORS.dangerLight,   icon: 'timer-off-outline', label: 'Expired' },
  CANCELLED:    { bg: COLORS.dangerBg,    border: COLORS.dangerBorder,   text: COLORS.dangerLight,   icon: 'ban-outline',       label: 'Cancelled' },
};

const DEFAULT_CONFIG = {
  bg: 'rgba(45,58,82,0.5)',
  border: COLORS.cardBorder,
  text: COLORS.textSecondary,
  icon: 'ellipse-outline',
  label: null,
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || DEFAULT_CONFIG;
  const label = cfg.label || (status ? status.replace(/_/g, ' ') : 'N/A');

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <Ionicons name={cfg.icon} size={11} color={cfg.text} style={styles.icon} />
      <Text style={[styles.badgeText, { color: cfg.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default StatusBadge;

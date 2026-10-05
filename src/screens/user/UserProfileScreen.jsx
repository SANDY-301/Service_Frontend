import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const PROFILE_FIELDS = [
  { key: 'email',   label: 'Email Address', icon: 'mail-outline' },
  { key: 'mobile',  label: 'Mobile Number', icon: 'call-outline' },
  { key: 'address', label: 'Address',        icon: 'home-outline' },
  { key: 'city',    label: 'City',           icon: 'business-outline' },
  { key: 'pincode', label: 'Pincode',        icon: 'location-outline' },
];

const ROLE_CONFIG = {
  ADMIN:    { icon: 'store-outline',   color: COLORS.warning,  label: 'Store Admin' },
  PROVIDER: { icon: 'wrench-outline',  color: COLORS.success,  label: 'Technician' },
  USER:     { icon: 'person-outline',  color: COLORS.primary,  label: 'Customer' },
};

const UserProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.USER;

  return (
    <View style={styles.container}>
      <Header title="My Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* AVATAR CARD */}
        <View style={styles.avatarCard}>
          <View style={[styles.avatarCircle, { backgroundColor: roleConfig.color }]}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : '??'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || '—'}</Text>
          <Text style={styles.userEmail}>{user?.email || '—'}</Text>
          <View style={[styles.roleChip, {
            backgroundColor: roleConfig.color + '12',
            borderColor: roleConfig.color + '40',
          }]}>
            <Ionicons name={roleConfig.icon} size={13} color={roleConfig.color} />
            <Text style={[styles.roleText, { color: roleConfig.color }]}>
              {roleConfig.label}
            </Text>
          </View>
        </View>

        {/* ACCOUNT DETAILS */}
        <View style={styles.detailsCard}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="person-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Account Details</Text>
          </View>
          {PROFILE_FIELDS.map((f, i) => {
            const val = user?.[f.key];
            if (!val) return null;
            return (
              <View key={f.key} style={[styles.fieldRow, i > 0 && styles.fieldBorder]}>
                <View style={styles.fieldLeft}>
                  <Ionicons name={f.icon} size={16} color={COLORS.textMuted} />
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                </View>
                <Text style={styles.fieldValue}>{val}</Text>
              </View>
            );
          })}

          {user?.companyName ? (
            <View style={[styles.fieldRow, styles.fieldBorder]}>
              <View style={styles.fieldLeft}>
                <Ionicons name="business-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.fieldLabel}>Company / Store</Text>
              </View>
              <Text style={styles.fieldValue}>{user.companyName}</Text>
            </View>
          ) : null}

          {user?.serviceArea ? (
            <View style={[styles.fieldRow, styles.fieldBorder]}>
              <View style={styles.fieldLeft}>
                <Ionicons name="map-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.fieldLabel}>Service Area</Text>
              </View>
              <Text style={styles.fieldValue}>{user.serviceArea}</Text>
            </View>
          ) : null}

          {user?.experienceYears ? (
            <View style={[styles.fieldRow, styles.fieldBorder]}>
              <View style={styles.fieldLeft}>
                <Ionicons name="ribbon-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.fieldLabel}>Experience</Text>
              </View>
              <Text style={styles.fieldValue}>{user.experienceYears} years</Text>
            </View>
          ) : null}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <Ionicons name="log-out" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Sign Out Securely</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 40 },

  avatarCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    ...SHADOWS.medium,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: COLORS.white },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },
  roleText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },

  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fieldBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    marginTop: 10,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default UserProfileScreen;

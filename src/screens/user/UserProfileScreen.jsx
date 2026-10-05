import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const PROFILE_FIELDS = [
  { key: 'email',   label: 'Email Address', icon: 'mail-outline' },
  { key: 'mobile',  label: 'Mobile Number', icon: 'call-outline' },
  { key: 'address', label: 'Address',        icon: 'home-outline' },
  { key: 'city',    label: 'City',           icon: 'business-outline' },
  { key: 'pincode', label: 'Pincode',        icon: 'location-outline' },
];

const UserProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return 'store-outline';
      case 'PROVIDER': return 'wrench-outline';
      default: return 'account-outline';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return COLORS.warningLight;
      case 'PROVIDER': return COLORS.successLight;
      default: return COLORS.primaryLight;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="My Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* AVATAR CARD */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : '??'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || '—'}</Text>
          <Text style={styles.userEmail}>{user?.email || '—'}</Text>
          <View style={[styles.roleChip, { backgroundColor: getRoleColor(user?.role) + '18', borderColor: getRoleColor(user?.role) + '40' }]}>
            <MaterialCommunityIcons name={getRoleIcon(user?.role)} size={12} color={getRoleColor(user?.role)} />
            <Text style={[styles.roleText, { color: getRoleColor(user?.role) }]}>
              {user?.role || 'USER'} ACCOUNT
            </Text>
          </View>
        </View>

        {/* ACCOUNT DETAILS */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Account Details</Text>
          {PROFILE_FIELDS.map((f, i) => {
            const val = user?.[f.key];
            if (!val) return null;
            return (
              <View key={f.key} style={[styles.fieldRow, i > 0 && styles.fieldBorder]}>
                <View style={styles.fieldLeft}>
                  <Ionicons name={f.icon} size={15} color={COLORS.textMuted} />
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                </View>
                <Text style={styles.fieldValue}>{val}</Text>
              </View>
            );
          })}

          {/* Show companyName if admin */}
          {user?.companyName ? (
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeft}>
                <MaterialCommunityIcons name="store-outline" size={15} color={COLORS.textMuted} />
                <Text style={styles.fieldLabel}>Company / Store</Text>
              </View>
              <Text style={styles.fieldValue}>{user.companyName}</Text>
            </View>
          ) : null}

          {/* Show serviceArea if provider */}
          {user?.serviceArea ? (
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeft}>
                <Ionicons name="location-outline" size={15} color={COLORS.textMuted} />
                <Text style={styles.fieldLabel}>Service Area</Text>
              </View>
              <Text style={styles.fieldValue}>{user.serviceArea}</Text>
            </View>
          ) : null}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.85}>
          <MaterialIcons name="logout" size={18} color={COLORS.dangerLight} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Need MaterialIcons for logout
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },

  avatarCard: {
    backgroundColor: COLORS.card, borderRadius: 20, padding: 28,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 14,
  },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  avatarText: { fontSize: 26, fontWeight: '900', color: COLORS.white },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  userEmail: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  roleChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginTop: 12,
  },
  roleText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  detailsCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 14,
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  fieldRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11,
  },
  fieldBorder: { borderTopWidth: 1, borderTopColor: COLORS.divider },
  fieldLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fieldLabel: { fontSize: 13, color: COLORS.textSecondary },
  fieldValue: { fontSize: 13, color: COLORS.text, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBorder,
    borderRadius: 14, paddingVertical: 14,
  },
  logoutText: { color: COLORS.dangerLight, fontSize: 15, fontWeight: '800' },
});

export default UserProfileScreen;

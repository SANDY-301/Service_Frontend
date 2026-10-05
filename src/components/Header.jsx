import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import { AuthContext } from '../context/AuthContext';

const Header = ({ title, showBack = false, onBack, subtitle }) => {
  const { user, logout } = useContext(AuthContext);

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return COLORS.warning;
      case 'PROVIDER': return COLORS.success;
      default: return COLORS.primaryLight;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'PROVIDER': return 'Provider';
      default: return 'Customer';
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={22} color={COLORS.primaryLight} />
            </TouchableOpacity>
          ) : null}
          <View>
            <Text style={styles.title} numberOfLines={1}>{title || 'Homecare Hub'}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        {user ? (
          <View style={styles.rightSection}>
            <View style={[styles.roleChip, { borderColor: getRoleColor(user.role) }]}>
              <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                {getRoleLabel(user.role)}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
              <MaterialIcons name="logout" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 58,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: 10,
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleChip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
});

export default Header;

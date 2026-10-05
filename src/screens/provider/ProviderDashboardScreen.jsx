import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const STATS = [
  { key: 'pending',   label: 'New Requests', icon: 'notifications-outline', color: COLORS.warningLight },
  { key: 'active',    label: 'In Progress',   icon: 'sync-outline',           color: COLORS.primaryLight },
  { key: 'completed', label: 'Completed',     icon: 'checkmark-done-outline', color: COLORS.successLight },
];

const ACTIONS = [
  { screen: 'ProviderBookings', icon: 'list-outline', iconBg: COLORS.primaryGhost,  title: 'Service Requests', sub: 'Accept or reject customer repair requests' },
  { screen: 'ProviderExpertise', icon: 'construct-outline', iconBg: COLORS.successBg, title: 'Expertise & Rates', sub: 'Set your supported categories and service charges' },
];

const ProviderDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bookings/provider-bookings');
      setBookings(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const counts = {
    pending: bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
    active: bookings.filter((b) => b.status === 'ASSIGNED' || b.status === 'IN_PROGRESS').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
  };

  return (
    <View style={styles.container}>
      <Header title="Provider Console" subtitle={user?.serviceArea ? `Serving ${user.serviceArea}` : 'Technician Dashboard'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
      >
        {/* WELCOME */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeSub}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{user?.name || 'Technician'}</Text>
            {user?.experienceYears ? (
              <View style={styles.expTag}>
                <MaterialCommunityIcons name="wrench-outline" size={11} color={COLORS.successLight} />
                <Text style={styles.expText}>{user.experienceYears} yrs experience</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.providerIconWrap}>
            <MaterialCommunityIcons name="account-hard-hat-outline" size={30} color={COLORS.successLight} />
          </View>
        </View>

        {/* STATS */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 24 }} />
        ) : (
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <View key={s.key} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <Text style={[styles.statNum, { color: s.color }]}>{counts[s.key]}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Technician Console</Text>

        {ACTIONS.map((a) => (
          <TouchableOpacity
            key={a.screen}
            style={styles.actionRow}
            onPress={() => navigation.navigate(a.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: a.iconBg }]}>
              <Ionicons name={a.icon} size={20} color={COLORS.primaryLight} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{a.title}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },

  welcomeCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 22,
  },
  welcomeLeft: { flex: 1 },
  welcomeSub: { fontSize: 11, color: COLORS.textMuted },
  welcomeName: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  expTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: COLORS.successBorder,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 8, alignSelf: 'flex-start',
  },
  expText: { fontSize: 10, color: COLORS.successLight, fontWeight: '700' },
  providerIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: COLORS.successBorder,
    alignItems: 'center', justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: COLORS.textMuted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: 'center', marginHorizontal: 3,
  },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statNum: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, fontWeight: '600', textAlign: 'center' },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 10, gap: 12,
  },
  actionIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  actionSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});

export default ProviderDashboardScreen;

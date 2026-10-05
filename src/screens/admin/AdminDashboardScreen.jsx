import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';

const STAT_CARDS = [
  { key: 'pendingBills',     label: 'Pending Bills',      icon: 'document-text-outline',   color: COLORS.warningLight,   screen: 'AdminBillVerification', alert: true },
  { key: 'todaysBookings',   label: "Today's Bookings",   icon: 'calendar-outline',         color: COLORS.primaryLight,   screen: 'AdminBookings' },
  { key: 'totalProducts',    label: 'Products Listed',    icon: 'cube-outline',             color: COLORS.accentLight,    screen: 'AdminProducts' },
  { key: 'activeWarranties', label: 'Active Warranties',  icon: 'shield-checkmark-outline', color: COLORS.successLight },
  { key: 'totalUsers',       label: 'Registered Users',   icon: 'people-outline',           color: COLORS.infoLight },
  { key: 'totalProviders',   label: 'Local Providers',    icon: 'construct-outline',        color: COLORS.success },
];

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/stats/dashboard');
      setStats(res.data);
    } catch (e) {
      console.error(e);
      setStats({ pendingBills: 0, todaysBookings: 0, totalProducts: 0, activeWarranties: 0, totalUsers: 0, totalProviders: 0 });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const ACTIONS = [
    { screen: 'AdminBillVerification', icon: 'document-text-outline', title: 'Bill Verification',       sub: 'Review uploaded receipts & verify warranty claims' },
    { screen: 'AdminProducts',         icon: 'cube-outline',           title: 'Products & Warranty Rules', sub: 'Add models, set service charges & labour costs' },
    { screen: 'AdminSlots',            icon: 'time-outline',           title: 'Slot Configuration',       sub: 'Set daily booking capacity — morning & evening' },
    { screen: 'AdminBookings',         icon: 'list-outline',           title: 'All Bookings',             sub: 'View & update status of all service bookings' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" subtitle={user?.companyName || 'Store Management'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
      >
        {/* WELCOME ROW */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{user?.name || 'Admin'}</Text>
          </View>
          <View style={styles.refreshHint}>
            <Ionicons name="refresh-outline" size={13} color={COLORS.textMuted} />
            <Text style={styles.refreshHintText}>Pull to refresh</Text>
          </View>
        </View>

        {/* STATS GRID */}
        <Text style={styles.sectionTitle}>Overview</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.statsGrid}>
            {STAT_CARDS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.statCard,
                  s.alert && (stats?.[s.key] || 0) > 0 && { borderColor: s.color + '60', backgroundColor: s.color + '0D' },
                ]}
                onPress={() => s.screen && navigation.navigate(s.screen)}
                activeOpacity={s.screen ? 0.75 : 1}
              >
                <View style={[styles.statIconWrap, { backgroundColor: s.color + '18' }]}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <Text style={[styles.statNumber, { color: s.color }]}>
                  {stats?.[s.key] ?? 0}
                </Text>
                <Text style={styles.statLabel}>{s.label}</Text>
                {s.screen ? (
                  <Ionicons name="chevron-forward" size={12} color={COLORS.textMuted} style={styles.statArrow} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Management Console</Text>

        {ACTIONS.map((a) => (
          <TouchableOpacity
            key={a.screen}
            style={styles.actionRow}
            onPress={() => navigation.navigate(a.screen)}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrap}>
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

  welcomeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  welcomeLabel: { fontSize: 12, color: COLORS.textMuted },
  welcomeName: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  refreshHint: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  refreshHintText: { fontSize: 11, color: COLORS.textMuted },

  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: COLORS.textMuted,
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 14,
    width: '48.5%', borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 10,
  },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statNumber: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3, fontWeight: '600' },
  statArrow: { position: 'absolute', top: 14, right: 14 },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 10, gap: 12,
  },
  actionIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  actionSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});

export default AdminDashboardScreen;

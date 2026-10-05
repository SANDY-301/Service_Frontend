import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

const STATUS_OPTIONS = ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const AdminBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bookings/admin-bookings');
      setBookings(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
    } catch (error) {
      Alert.alert('Error', 'Could not update booking status. Please try again.');
    }
  };

  const confirmStatus = (bookingId, status) => {
    Alert.alert(
      'Update Status',
      `Set booking to "${status.replace(/_/g, ' ')}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => handleUpdateStatus(bookingId, status) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Bookings Console" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>All Store Bookings</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{bookings.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Review and update booking statuses</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyText}>Bookings from customers will appear here once placed.</Text>
          </View>
        ) : (
          bookings.map((item) => (
            <View key={item._id} style={styles.card}>

              {/* CARD HEADER */}
              <View style={styles.cardHeader}>
                <View style={styles.customerInfo}>
                  <View style={styles.customerAvatar}>
                    <Text style={styles.customerInitial}>
                      {item.userId?.name ? item.userId.name.substring(0, 1).toUpperCase() : 'C'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.customerName}>{item.userId?.name || '—'}</Text>
                    <Text style={styles.customerMobile}>{item.userId?.mobile || '—'}</Text>
                  </View>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {/* BOOKING DETAILS */}
              <View style={styles.detailRow}>
                <Ionicons name="construct-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.detailText}>
                  {item.categoryId?.name || '—'} → {item.serviceProblemId?.problemName || '—'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{item.selectedDate} · {item.selectedSlot}</Text>
              </View>

              {/* STATUS BUTTONS */}
              <View style={styles.statusSection}>
                <Text style={styles.statusLabel}>Update Status</Text>
                <View style={styles.statusBtnRow}>
                  {STATUS_OPTIONS.map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.statusChip, item.status === st && styles.statusChipActive]}
                      onPress={() => item.status !== st && confirmStatus(item._id, st)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.statusChipText, item.status === st && styles.statusChipTextActive]}>
                        {st.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  countBadge: {
    backgroundColor: COLORS.primaryGhost, borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: COLORS.primaryLight + '40',
  },
  countText: { fontSize: 12, fontWeight: '800', color: COLORS.primaryLight },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginBottom: 18 },

  emptyBox: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, gap: 8,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  customerInitial: { fontSize: 15, fontWeight: '800', color: COLORS.primaryLight },
  customerName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  customerMobile: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  detailText: { fontSize: 12, color: COLORS.textSecondary },

  statusSection: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 12 },
  statusLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  statusBtnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  statusChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.cardBorder, backgroundColor: COLORS.surface,
  },
  statusChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight },
  statusChipText: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700' },
  statusChipTextActive: { color: COLORS.white },
});

export default AdminBookingsScreen;

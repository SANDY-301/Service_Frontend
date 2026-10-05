import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bookings/my-bookings');
      setBookings(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.categoryIcon}>
          <MaterialCommunityIcons name="tools" size={17} color={COLORS.primaryLight} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.applianceTitle}>{item.categoryId?.name || 'Appliance'} Service</Text>
          <Text style={styles.problemText}>{item.serviceProblemId?.problemName || '—'}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.selectedDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.selectedSlot}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="briefcase-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{item.serviceType?.replace(/_/g, ' ')}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.finalAmount}>₹{item.finalAmount}</Text>
        <View style={styles.trackBtn}>
          <Text style={styles.trackText}>View Details</Text>
          <Ionicons name="chevron-forward" size={13} color={COLORS.primaryLight} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="My Bookings" />

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />
          }
          ListHeaderComponent={
            bookings.length > 0 ? (
              <Text style={styles.listCount}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
              <Text style={styles.emptyText}>Your service bookings will appear here once placed.</Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('ApplianceCategories')}
              >
                <Ionicons name="add-circle-outline" size={15} color={COLORS.white} />
                <Text style={styles.bookBtnText}>Book a Service</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: 16, paddingBottom: 30 },
  listCount: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  categoryIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  cardHeaderText: { flex: 1 },
  applianceTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  problemText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  metaRow: {
    flexDirection: 'row', gap: 14, backgroundColor: COLORS.surface,
    borderRadius: 10, padding: 10, marginBottom: 12,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: COLORS.textMuted },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 10,
  },
  finalAmount: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  trackBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trackText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '700' },

  emptyBox: {
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 32, gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 8,
  },
  bookBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
});

export default MyBookingsScreen;

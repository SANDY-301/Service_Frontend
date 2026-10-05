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

const ProviderBookingsScreen = ({ navigation }) => {
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
    finally { setLoading(false); setRefreshing(false); }
  };

  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const handleStatusUpdate = (bookingId, status) => {
    Alert.alert(
      'Update Job Status',
      `Set this job to "${status.replace(/_/g, ' ')}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm', onPress: async () => {
            try {
              await apiClient.put(`/bookings/${bookingId}/status`, { status });
              await fetchBookings();
            } catch (e) {
              Alert.alert('Error', 'Could not update status.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Service Requests" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Assigned Requests</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{bookings.length}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Accept and update your assigned repair jobs</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : bookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" size={44} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Requests Yet</Text>
            <Text style={styles.emptyText}>
              Service requests assigned to you will appear here.{'\n'}
              Make sure your expertise and services are configured.
            </Text>
            <TouchableOpacity style={styles.expertiseBtn} onPress={() => navigation.navigate('ProviderExpertise')}>
              <MaterialCommunityIcons name="wrench-outline" size={14} color={COLORS.white} />
              <Text style={styles.expertiseBtnText}>Setup Expertise</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((item) => (
            <View key={item._id} style={styles.card}>

              {/* HEADER */}
              <View style={styles.cardHeader}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerInitial}>
                    {item.userId?.name ? item.userId.name.substring(0, 1).toUpperCase() : 'C'}
                  </Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.userId?.name || '—'}</Text>
                  <Text style={styles.faultText}>
                    {item.categoryId?.name || '—'} · {item.serviceProblemId?.problemName || '—'}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {/* DETAILS */}
              <View style={styles.detailsGrid}>
                {item.userId?.mobile ? (
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.detailText}>{item.userId.mobile}</Text>
                  </View>
                ) : null}
                {(item.userAddress || item.userId?.address) ? (
                  <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {item.userAddress || item.userId.address}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                  <Text style={styles.detailText}>{item.selectedDate} · {item.selectedSlot}</Text>
                </View>
                {item.notes ? (
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={13} color={COLORS.textMuted} />
                    <Text style={styles.detailText} numberOfLines={2}>{item.notes}</Text>
                  </View>
                ) : null}
              </View>

              {/* AMOUNT */}
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Payable Amount</Text>
                <Text style={styles.amountValue}>₹{item.finalAmount}</Text>
              </View>

              {/* ACTION BUTTONS */}
              <View style={styles.btnRow}>
                {item.status !== 'ASSIGNED' && item.status !== 'IN_PROGRESS' && item.status !== 'COMPLETED' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
                    onPress={() => handleStatusUpdate(item._id, 'ASSIGNED')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-outline" size={14} color={COLORS.white} />
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'ASSIGNED' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.warning }]}
                    onPress={() => handleStatusUpdate(item._id, 'IN_PROGRESS')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="sync-outline" size={14} color={COLORS.white} />
                    <Text style={styles.btnText}>Start Job</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'IN_PROGRESS' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
                    onPress={() => handleStatusUpdate(item._id, 'COMPLETED')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="checkmark-done-outline" size={14} color={COLORS.white} />
                    <Text style={styles.btnText}>Mark Complete</Text>
                  </TouchableOpacity>
                )}
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
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  expertiseBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.success, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, marginTop: 4,
  },
  expertiseBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  customerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  customerInitial: { fontSize: 16, fontWeight: '800', color: COLORS.primaryLight },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  faultText: { fontSize: 11, color: COLORS.primaryLight, fontWeight: '600', marginTop: 2 },

  detailsGrid: {
    backgroundColor: COLORS.surface, borderRadius: 10, padding: 12, marginBottom: 12, gap: 8,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },

  amountRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 10, marginBottom: 12,
  },
  amountLabel: { fontSize: 12, color: COLORS.textMuted },
  amountValue: { fontSize: 16, fontWeight: '900', color: COLORS.successLight },

  btnRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 10,
  },
  btnText: { color: COLORS.white, fontSize: 12, fontWeight: '800' },
});

export default ProviderBookingsScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { getSocket } from '../../api/socket';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import TimelineView from '../../components/TimelineView';
import PriceBreakdownCard from '../../components/PriceBreakdownCard';

const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();

    // Listen to real-time status update via Socket.IO
    const socket = getSocket();
    socket.on(`booking_updated_${bookingId}`, (data) => {
      console.log('Realtime status update received:', data);
      if (data.status) {
        setBooking((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    });

    return () => {
      socket.off(`booking_updated_${bookingId}`);
    };
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/bookings/${bookingId}`);
      setBooking(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Booking Tracker" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading || !booking ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* BOOKING STATUS HEADER */}
            <View style={styles.headerCard}>
              <View style={styles.headerRow}>
                <Text style={styles.applianceTitle}>
                  {booking.categoryId?.name || 'Appliance'} Service
                </Text>
                <StatusBadge status={booking.status} />
              </View>
              <Text style={styles.bookingIdText}>Booking ID: #{booking._id.substring(0, 8)}</Text>
            </View>

            {/* PROGRESS TIMELINE TRACKER */}
            <TimelineView currentStatus={booking.status} />

            {/* DETAILS CARD */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Booking Summary</Text>

              <View style={styles.row}>
                <Text style={styles.key}>Problem / Issue:</Text>
                <Text style={styles.val}>{booking.serviceProblemId?.problemName || 'Repair'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.key}>Store / Technician:</Text>
                <Text style={styles.val}>
                  {booking.serviceType === 'LOCAL_SERVICE' ? booking.providerId?.name : booking.companyId?.companyName || 'Store Authorized'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.key}>Service Type:</Text>
                <Text style={styles.val}>{booking.serviceType.replace(/_/g, ' ')}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.key}>Slot:</Text>
                <Text style={styles.val}>{booking.selectedDate} ({booking.selectedSlot})</Text>
              </View>

              {booking.notes ? (
                <View style={styles.row}>
                  <Text style={styles.key}>User Notes:</Text>
                  <Text style={styles.val}>{booking.notes}</Text>
                </View>
              ) : null}
            </View>

            {/* PRICING BREAKDOWN */}
            <PriceBreakdownCard
              baseServiceCharge={booking.serviceCharge}
              warrantyDiscount={booking.warrantyDiscount}
              labourCharge={booking.labourCharge}
              finalAmount={booking.finalAmount}
              isWarrantyActive={booking.serviceType === 'COMPANY_WARRANTY'}
            />

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={fetchBookingDetails}
            >
              <Text style={styles.refreshBtnText}>🔄 Refresh Status</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  applianceTitle: { fontSize: 17, fontWeight: '800', color: COLORS.white },
  bookingIdText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
  },
  key: { fontSize: 13, color: COLORS.textSecondary },
  val: { fontSize: 13, color: COLORS.white, fontWeight: '700' },
  refreshBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshBtnText: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
});

export default BookingDetailsScreen;

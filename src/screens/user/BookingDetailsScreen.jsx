import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { getSocket } from '../../api/socket';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import TimelineView from '../../components/TimelineView';
import PriceBreakdownCard from '../../components/PriceBreakdownCard';

const CATEGORY_ICON_MAP = {
  'AC':               { icon: 'air-conditioner',            color: '#0284C7' },
  'Refrigerator':     { icon: 'fridge-outline',              color: '#0891B2' },
  'TV':               { icon: 'television-play',             color: '#6366F1' },
  'Washing Machine':  { icon: 'washing-machine',             color: '#059669' },
  'Microwave Oven':   { icon: 'microwave',                   color: '#D97706' },
  'Water Heater':     { icon: 'water-thermometer-outline',   color: '#DC2626' },
  'Air Cooler':       { icon: 'fan',                         color: '#2563EB' },
  'Mixer Grinder':    { icon: 'blender-outline',             color: '#CA8A04' },
  'Dishwasher':       { icon: 'dishwasher',                  color: '#0D9488' },
  'Other Electronics':{ icon: 'devices',                     color: '#7C3AED' },
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Ionicons name={icon} size={15} color={COLORS.textMuted} />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const BookingDetailsScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
    const socket = getSocket();
    socket.on(`booking_updated_${bookingId}`, (data) => {
      if (data.status) {
        setBooking((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    });
    return () => { socket.off(`booking_updated_${bookingId}`); };
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

  if (loading || !booking) {
    return (
      <View style={styles.container}>
        <Header title="Booking Details" showBack onBack={() => navigation.goBack()} />
        <View style={styles.loadingBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.loadingText}>Loading booking...</Text>
        </View>
      </View>
    );
  }

  const catName = booking.categoryId?.name || 'Appliance';
  const iconMeta = CATEGORY_ICON_MAP[catName] || { icon: 'wrench-outline', color: COLORS.primary };
  const providerName = booking.serviceType === 'LOCAL_SERVICE'
    ? booking.providerId?.name
    : (booking.companyId?.companyName || 'Company Authorized');

  return (
    <View style={styles.container}>
      <Header title="Booking Tracker" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* BOOKING HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={[styles.applianceIcon, { backgroundColor: iconMeta.color + '15' }]}>
              <MaterialCommunityIcons name={iconMeta.icon} size={28} color={iconMeta.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.applianceName}>{catName} Service</Text>
              <Text style={styles.bookingId}>#{booking._id.substring(0, 8).toUpperCase()}</Text>
            </View>
          </View>
          <StatusBadge status={booking.status} />
        </View>

        {/* PROGRESS TIMELINE */}
        <TimelineView currentStatus={booking.status} />

        {/* SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Booking Summary</Text>
          </View>

          <InfoRow
            icon="build-outline"
            label="Problem / Issue"
            value={booking.serviceProblemId?.problemName || 'Repair'}
          />
          <InfoRow
            icon="business-outline"
            label="Service By"
            value={providerName}
          />
          <InfoRow
            icon="briefcase-outline"
            label="Service Type"
            value={booking.serviceType?.replace(/_/g, ' ') || '—'}
          />
          <InfoRow
            icon="calendar-outline"
            label="Scheduled Date"
            value={booking.selectedDate || '—'}
          />
          <InfoRow
            icon="time-outline"
            label="Time Slot"
            value={booking.selectedSlot || '—'}
          />
          {booking.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Your Notes</Text>
              <Text style={styles.notesText}>{booking.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* PRICING */}
        <PriceBreakdownCard
          baseServiceCharge={booking.serviceCharge}
          warrantyDiscount={booking.warrantyDiscount}
          labourCharge={booking.labourCharge}
          finalAmount={booking.finalAmount}
          isWarrantyActive={booking.serviceType === 'COMPANY_WARRANTY'}
        />

        {/* REFRESH BUTTON */}
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchBookingDetails}>
          <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
          <Text style={styles.refreshBtnText}>Refresh Status</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  applianceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applianceName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  bookingId: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginVertical: 8,
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

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
    maxWidth: '55%',
    textAlign: 'right',
  },

  notesBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: 20,
  },

  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryGhost,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: 10,
  },
  refreshBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default BookingDetailsScreen;

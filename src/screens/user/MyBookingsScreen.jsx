import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, []);

  const renderItem = useCallback(({ item }) => {
    const catName = item.categoryId?.name || 'Appliance';
    const iconMeta = CATEGORY_ICON_MAP[catName] || { icon: 'wrench-outline', color: COLORS.primary };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
        activeOpacity={0.8}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconWrap, { backgroundColor: iconMeta.color + '15' }]}>
            <MaterialCommunityIcons name={iconMeta.icon} size={22} color={iconMeta.color} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.applianceTitle}>{catName} Service</Text>
            <Text style={styles.problemText} numberOfLines={1}>
              {item.serviceProblemId?.problemName || 'General Repair'}
            </Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        {/* Meta Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.primary} />
            <Text style={styles.metaText}>{item.selectedDate}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={COLORS.primary} />
            <Text style={styles.metaText}>{item.selectedSlot}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={13} color={COLORS.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.serviceType?.replace(/_/g, ' ') || '—'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Text style={styles.finalAmount}>₹{item.finalAmount}</Text>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header title="My Bookings" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListHeaderComponent={
            bookings.length > 0 ? (
              <Text style={styles.listCount}>
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
              <Text style={styles.emptyText}>
                Your service bookings will appear here once placed.
              </Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('ApplianceCategories')}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={18} color={COLORS.white} />
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
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },
  listContent: { padding: 16, paddingBottom: 40 },
  listCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: { flex: 1 },
  applianceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  problemText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  finalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryGhost,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  viewBtnText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },

  emptyBox: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryGhost,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    marginTop: 8,
    ...SHADOWS.small,
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default MyBookingsScreen;

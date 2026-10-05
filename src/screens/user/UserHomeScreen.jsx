import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, FlatList, Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, TYPOGRAPHY, RADIUS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import StatusBadge from '../../components/StatusBadge';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const UserHomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchHomeData(); }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [catRes, bookRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/bookings/my-bookings'),
      ]);
      setCategories(catRes.data || []);
      setActiveBookings(bookRes.data || []);
    } catch (e) {
      console.error('Home data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderBookingCard = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
      activeOpacity={0.8}
    >
      <View style={styles.bookingCardTop}>
        <View style={styles.bookingIcon}>
          <MaterialCommunityIcons name="tools" size={18} color={COLORS.primary} />
        </View>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingTitle}>{item.categoryId?.name || 'Appliance'} Service</Text>
          <Text style={styles.bookingProblem}>{item.serviceProblemId?.problemName || 'Repair'}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      <View style={styles.bookingCardBottom}>
        <View style={styles.bookingMeta}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.bookingMetaText}>{item.selectedDate}</Text>
        </View>
        <View style={styles.bookingMeta}>
          <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
          <Text style={styles.bookingMetaText}>{item.selectedSlot}</Text>
        </View>
        <Text style={styles.bookingAmount}>₹{item.finalAmount}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const renderListHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      {/* BOOK SERVICE CTA WITH PREMIUM GRADIENT */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ApplianceCategories')}
        activeOpacity={0.9}
        style={{ marginBottom: 24, ...SHADOWS.glow }}
      >
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaBanner}
        >
          <View style={styles.ctaLeft}>
            <MaterialCommunityIcons name="shield-check" size={26} color={COLORS.primaryDark} />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Book Appliance Service</Text>
            <Text style={styles.ctaSub}>Upload bill for instant warranty check</Text>
          </View>
          <View style={styles.ctaArrowCircle}>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* CATEGORY GRID */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Appliance Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ApplianceCategories')}>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
      ) : filteredCategories.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="magnify" size={36} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No categories found</Text>
        </View>
      ) : (
        <View style={styles.categoriesGrid}>
          {filteredCategories.slice(0, 9).map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onPress={() => navigation.navigate('ProductSelection', { categoryId: cat._id, categoryName: cat.name })}
            />
          ))}
        </View>
      )}

      {/* ACTIVE BOOKINGS HEADER */}
      <View style={[styles.sectionHeader, { marginTop: 10 }]}>
        <Text style={styles.sectionTitle}>My Active Bookings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {!loading && activeBookings.length === 0 && (
        <View style={[styles.emptyBox, { marginTop: 10 }]}>
          <MaterialCommunityIcons name="calendar-blank-outline" size={36} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No active bookings</Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('ApplianceCategories')}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.startBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add-circle-outline" size={16} color={COLORS.white} />
              <Text style={styles.startBtnText}>Book a Service</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [filteredCategories, loading, activeBookings, navigation]);

  return (
    <View style={styles.container}>
      <Header title="Homecare Hub" subtitle="Appliance Service & Warranty" />

      {/* TOP SECTION: Welcome Banner & Search Bar (Outside FlatList to prevent Keyboard Dismiss) */}
      <View style={styles.topSection}>
        {/* WELCOME BANNER */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
            <Text style={styles.welcomeSub}>What needs servicing today?</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'HH'}
            </Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search AC, Fridge, TV..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <FlatList
        data={activeBookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBookingCard}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primaryLight}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  headerContainer: { paddingBottom: 10, paddingTop: 16 },

  topSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  welcomeLeft: { flex: 1 },
  greeting: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  userName: { ...TYPOGRAPHY.heading1, color: COLORS.text, marginTop: 4 },
  welcomeSub: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, marginTop: 6 },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.primary + '40',
  },
  avatarText: { fontSize: 18, fontWeight: '900', color: COLORS.primaryLight },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 4, // Spacing before flatlist begins
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },

  ctaBanner: {
    borderRadius: RADIUS.lg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ctaLeft: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.small,
  },
  ctaText: { flex: 1 },
  ctaTitle: { ...TYPOGRAPHY.heading3, color: COLORS.white },
  ctaSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  ctaArrowCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: { ...TYPOGRAPHY.heading2, color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.accentLight, fontWeight: '700' },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'space-between' },

  emptyBox: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 20, gap: 12,
  },
  emptyText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '500' },
  startBtn: { marginTop: 8, borderRadius: RADIUS.sm, overflow: 'hidden' },
  startBtnGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 12,
  },
  startBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },

  bookingCard: {
    backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: 18,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 14,
    ...SHADOWS.small,
  },
  bookingCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  bookingIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  bookingInfo: { flex: 1 },
  bookingTitle: { ...TYPOGRAPHY.heading3, color: COLORS.text },
  bookingProblem: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  bookingCardBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 14,
  },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bookingMetaText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  bookingAmount: { marginLeft: 'auto', fontSize: 16, fontWeight: '800', color: COLORS.primaryLight },
});

export default UserHomeScreen;

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import StatusBadge from '../../components/StatusBadge';

const UserHomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <Header title="Homecare Hub" subtitle="Appliance Service & Warranty" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

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
          <Ionicons name="search-outline" size={17} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search AC, Fridge, TV, Washing Machine..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* BOOK SERVICE CTA */}
        <TouchableOpacity
          style={styles.ctaBanner}
          onPress={() => navigation.navigate('ApplianceCategories')}
          activeOpacity={0.85}
        >
          <View style={styles.ctaLeft}>
            <MaterialCommunityIcons name="tools" size={28} color={COLORS.white} />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Book Appliance Service</Text>
            <Text style={styles.ctaSub}>Upload bill photo for instant warranty check</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* CATEGORY GRID */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appliance Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ApplianceCategories')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 24 }} />
        ) : filteredCategories.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="magnify" size={32} color={COLORS.textMuted} />
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

        {/* ACTIVE BOOKINGS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Active Bookings</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {activeBookings.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No active bookings</Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => navigation.navigate('ApplianceCategories')}
            >
              <Ionicons name="add-circle-outline" size={15} color={COLORS.white} />
              <Text style={styles.startBtnText}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          activeBookings.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.bookingCard}
              onPress={() => navigation.navigate('BookingDetails', { bookingId: item._id })}
              activeOpacity={0.8}
            >
              <View style={styles.bookingCardTop}>
                <View style={styles.bookingIcon}>
                  <MaterialCommunityIcons name="tools" size={18} color={COLORS.primaryLight} />
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingTitle}>{item.categoryId?.name || 'Appliance'} Service</Text>
                  <Text style={styles.bookingProblem}>{item.serviceProblemId?.problemName || 'Repair'}</Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.bookingCardBottom}>
                <View style={styles.bookingMeta}>
                  <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.bookingMetaText}>{item.selectedDate}</Text>
                </View>
                <View style={styles.bookingMeta}>
                  <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.bookingMetaText}>{item.selectedSlot}</Text>
                </View>
                <Text style={styles.bookingAmount}>₹{item.finalAmount}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },

  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  welcomeLeft: { flex: 1 },
  greeting: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  welcomeSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: COLORS.white },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 13 },

  ctaBanner: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  ctaLeft: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center',
  },
  ctaText: { flex: 1 },
  ctaTitle: { fontSize: 15, fontWeight: '800', color: COLORS.white },
  ctaSub: { fontSize: 11, color: '#BFDBFE', marginTop: 3 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '700' },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },

  emptyBox: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 16, gap: 8,
  },
  emptyText: { color: COLORS.textMuted, fontSize: 13 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 8, marginTop: 4,
  },
  startBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },

  bookingCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 10,
  },
  bookingCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  bookingIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  bookingInfo: { flex: 1 },
  bookingTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  bookingProblem: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  bookingCardBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 10,
  },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookingMetaText: { fontSize: 11, color: COLORS.textMuted },
  bookingAmount: { marginLeft: 'auto', fontSize: 14, fontWeight: '800', color: COLORS.text },
});

export default UserHomeScreen;

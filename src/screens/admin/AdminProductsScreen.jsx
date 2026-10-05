import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, TextInput, RefreshControl, FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AdminProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/products');
      setProducts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const filtered = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.modelNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.brandBadge}>
            <MaterialCommunityIcons name="barcode" size={13} color={COLORS.primaryLight} />
            <Text style={styles.brandTag}>{item.brand}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
          <Text style={styles.modelText}>Model: {item.modelNumber}</Text>
        </View>
        <View style={styles.warrantyBadge}>
          <Ionicons name="shield-checkmark-outline" size={13} color={COLORS.successLight} />
          <Text style={styles.warrantyText}>{item.warrantyPeriodMonths}M</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.priceRow}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Service Charge</Text>
          <Text style={styles.priceValue}>₹{item.companyServiceCharge}</Text>
        </View>
        <View style={styles.vertDivider} />
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Labour Charge</Text>
          <Text style={styles.priceValue}>₹{item.labourCharge}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Products & Warranty" showBack onBack={() => navigation.goBack()} />

      {/* SEARCH BAR (Sticky at top) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand, model or name..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="cube-off-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>{search ? 'No results found' : 'No Products Yet'}</Text>
              <Text style={styles.emptyText}>
                {search ? 'Try a different keyword' : 'Add your first product model to enable warranty lookups'}
              </Text>
            </View>
          }
        />
      )}

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: 20 + insets.bottom }]} 
        onPress={() => navigation.navigate('AdminAddProduct')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={26} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS.inputBorder,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },

  listContent: { padding: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardHeaderLeft: { flex: 1, paddingRight: 10 },
  brandBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryGhost, alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 6,
  },
  brandTag: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, letterSpacing: 0.3, textTransform: 'uppercase' },
  productName: { ...TYPOGRAPHY.heading3, color: COLORS.text, marginBottom: 2 },
  modelText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },

  warrantyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: COLORS.successBorder,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm,
  },
  warrantyText: { fontSize: 12, fontWeight: '800', color: COLORS.successLight },

  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 12 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceItem: { flex: 1, alignItems: 'center' },
  vertDivider: { width: 1, height: 24, backgroundColor: COLORS.divider },
  priceLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 4 },
  priceValue: { fontSize: 16, color: COLORS.text, fontWeight: '800' },

  emptyBox: {
    alignItems: 'center', justifyContent: 'center',
    padding: 40, marginTop: 40,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
    elevation: 10,
  },
});

export default AdminProductsScreen;

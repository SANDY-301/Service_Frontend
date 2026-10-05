import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';

const AdminProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

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

  return (
    <View style={styles.container}>
      <Header title="Products & Warranty" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primaryLight} />}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>Registered Products</Text>
            <Text style={styles.subtitle}>{products.length} model{products.length !== 1 ? 's' : ''} listed</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AdminAddProduct')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={17} color={COLORS.white} />
            <Text style={styles.addBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand, model or name..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="cube-off-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>{search ? 'No results found' : 'No Products Yet'}</Text>
            <Text style={styles.emptyText}>
              {search ? 'Try a different keyword' : 'Add your first product model to enable warranty lookups'}
            </Text>
            {!search && (
              <TouchableOpacity style={styles.addFirstBtn} onPress={() => navigation.navigate('AdminAddProduct')}>
                <Ionicons name="add-circle-outline" size={15} color={COLORS.white} />
                <Text style={styles.addFirstBtnText}>Add First Product</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map((prod) => (
            <View key={prod._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <View style={styles.brandRow}>
                    <MaterialCommunityIcons name="barcode" size={13} color={COLORS.primaryLight} />
                    <Text style={styles.brandTag}>{prod.brand}</Text>
                  </View>
                  <Text style={styles.productName}>{prod.productName}</Text>
                  <Text style={styles.modelText}>Model: {prod.modelNumber}</Text>
                </View>
                <View style={styles.warrantyBadge}>
                  <Ionicons name="shield-checkmark-outline" size={12} color={COLORS.successLight} />
                  <Text style={styles.warrantyText}>{prod.warrantyPeriodMonths}M</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Service Charge</Text>
                  <Text style={styles.priceValue}>₹{prod.companyServiceCharge}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Labour Charge</Text>
                  <Text style={styles.priceValue}>₹{prod.labourCharge}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Warranty Type</Text>
                  <Text style={[styles.priceValue, { fontSize: 10 }]} numberOfLines={2}>{prod.warrantyType || '—'}</Text>
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

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
  },
  addBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 16,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 13 },

  emptyBox: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 32,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, gap: 8,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  addFirstBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, marginTop: 4,
  },
  addFirstBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  brandTag: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, letterSpacing: 0.3 },
  productName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  modelText: { fontSize: 12, color: COLORS.textMuted, marginTop: 3 },

  warrantyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.successBg, borderWidth: 1, borderColor: COLORS.successBorder,
    paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10,
  },
  warrantyText: { fontSize: 11, fontWeight: '800', color: COLORS.successLight },

  priceRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderRadius: 10, padding: 12, justifyContent: 'space-between', alignItems: 'center',
  },
  priceItem: { flex: 1, alignItems: 'center' },
  priceDivider: { width: 1, height: '100%', backgroundColor: COLORS.divider },
  priceLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginBottom: 3, textAlign: 'center' },
  priceValue: { fontSize: 13, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
});

export default AdminProductsScreen;

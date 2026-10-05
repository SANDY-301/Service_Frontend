import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductSelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => { fetchProducts(); }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/products?categoryId=${categoryId}`);
      setProducts(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    navigation.navigate('ProblemSelection', {
      categoryId,
      categoryName,
      product,
    });
  };

  const renderProduct = ({ item: prod }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectProduct(prod)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.brandBadge}>
          <MaterialCommunityIcons name="barcode" size={12} color={COLORS.primaryLight} />
          <Text style={styles.brandTag}>{prod.brand}</Text>
        </View>
        <View style={styles.warrantyBadge}>
          <Ionicons name="shield-checkmark" size={12} color={COLORS.successLight} />
          <Text style={styles.warrantyTag}>{prod.warrantyPeriodMonths}M Warranty</Text>
        </View>
      </View>

      <Text style={styles.productName}>{prod.productName}</Text>
      <Text style={styles.modelNumber}>Model: {prod.modelNumber}</Text>

      <View style={styles.divider} />

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.chargeLabel}>Base Charge</Text>
          <Text style={styles.chargeValue}>₹{prod.companyServiceCharge}</Text>
        </View>
        <View>
          <Text style={styles.chargeLabel}>Labour</Text>
          <Text style={styles.chargeValue}>₹{prod.labourCharge}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.chargeLabel}>Authorized by</Text>
          <Text style={styles.storeText} numberOfLines={1}>{prod.companyId?.companyName || 'Brand Store'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const genericModelOption = {
    _id: null,
    productName: `Generic ${categoryName}`,
    brand: 'Standard Model',
    modelNumber: 'Unknown',
    warrantyPeriodMonths: 12,
    companyServiceCharge: 500,
    labourCharge: 300,
  };

  return (
    <View style={styles.container}>
      <Header title={`${categoryName} Models`} showBack onBack={() => navigation.goBack()} />

      <View style={styles.headerArea}>
        <Text style={styles.title}>Step 1: Select Model</Text>
        <Text style={styles.subtitle}>Choose your appliance model for exact warranty rules and pricing.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} size="large" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.genericCard}
              onPress={() => handleSelectProduct(genericModelOption)}
              activeOpacity={0.7}
            >
              <View style={styles.genericIconWrap}>
                <Ionicons name="add" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.genericTitle}>My Model is Not Listed</Text>
                <Text style={styles.genericSub}>Continue with bill upload OCR warranty verification</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerArea: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 20 },
  listContent: { paddingHorizontal: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  brandBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryGhost,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  brandTag: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  warrantyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  warrantyTag: { color: COLORS.success, fontSize: 11, fontWeight: '800' },
  
  productName: { ...TYPOGRAPHY.heading3, color: COLORS.text, marginBottom: 4 },
  modelNumber: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  divider: { height: 1, backgroundColor: COLORS.divider, marginVertical: 14 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chargeLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', marginBottom: 2 },
  chargeValue: { fontSize: 15, color: COLORS.text, fontWeight: '800' },
  storeText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  genericCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGhost,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primaryLight,
    marginTop: 8,
  },
  genericIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
    marginRight: 14, ...SHADOWS.small,
  },
  genericTitle: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
  genericSub: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, paddingRight: 10 },
});

export default ProductSelectionScreen;

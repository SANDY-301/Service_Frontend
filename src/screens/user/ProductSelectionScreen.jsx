import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';

const ProductSelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

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

  return (
    <View style={styles.container}>
      <Header title={`${categoryName} Models`} showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 2: Select {categoryName} Model</Text>
        <Text style={styles.subtitle}>Choose your appliance model for exact warranty rules</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          <>
            {products.map((prod) => (
              <TouchableOpacity
                key={prod._id}
                style={styles.card}
                onPress={() => handleSelectProduct(prod)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.brandBadge}>{prod.brand}</Text>
                  <Text style={styles.warrantyTag}>{prod.warrantyPeriodMonths} Months Warranty</Text>
                </View>

                <Text style={styles.productName}>{prod.productName}</Text>
                <Text style={styles.modelNumber}>Model: {prod.modelNumber}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.chargeLabel}>Base Company Charge: ₹{prod.companyServiceCharge}</Text>
                  <Text style={styles.labourLabel}>Labour: ₹{prod.labourCharge}</Text>
                </View>

                <View style={styles.storeRow}>
                  <Text style={styles.storeText}>
                    Store: {prod.companyId?.companyName || 'Authorized Dealer'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Custom generic model option */}
            <TouchableOpacity
              style={[styles.card, styles.genericCard]}
              onPress={() =>
                handleSelectProduct({
                  _id: null,
                  productName: `Generic ${categoryName}`,
                  brand: 'Standard',
                  modelNumber: 'N/A',
                  warrantyPeriodMonths: 12,
                  companyServiceCharge: 500,
                  labourCharge: 300,
                })
              }
            >
              <Text style={styles.genericTitle}>+ My Model is Not Listed</Text>
              <Text style={styles.genericSub}>Continue with bill upload OCR warranty verification</Text>
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
  title: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  brandBadge: {
    backgroundColor: COLORS.primaryDark,
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  warrantyTag: { color: COLORS.success, fontSize: 11, fontWeight: '700' },
  productName: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  modelNumber: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  chargeLabel: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  labourLabel: { fontSize: 12, color: COLORS.textSecondary },
  storeRow: { marginTop: 2 },
  storeText: { fontSize: 11, color: COLORS.textMuted },
  genericCard: { borderColor: COLORS.primary, borderStyle: 'dashed' },
  genericTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primaryLight },
  genericSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});

export default ProductSelectionScreen;

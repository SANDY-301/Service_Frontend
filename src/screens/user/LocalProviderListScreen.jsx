import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LocalProviderListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, billImage, billScanResult } = route.params;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => { fetchFilteredProviders(); }, [categoryId, problem]);

  const fetchFilteredProviders = async () => {
    try {
      setLoading(true);
      const problemId = problem ? problem._id : '';
      const res = await apiClient.get(`/providers?categoryId=${categoryId}&serviceProblemId=${problemId}`);
      setProviders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = (prov) => {
    navigation.navigate('DateSlotSelection', {
      categoryId, categoryName, product, problem, company, billImage, billScanResult,
      providerType: 'LOCAL',
      provider: prov,
    });
  };

  const renderProvider = ({ item: prov }) => {
    const matchedService = prov.offeredServices?.find(
      (s) => s.problemId?._id === problem?._id || s.problemId === problem?._id
    ) || prov.offeredServices?.[0] || { serviceCharge: 0, labourCharge: 0 };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelectProvider(prov)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{prov.name ? prov.name.substring(0, 2).toUpperCase() : 'PR'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>{prov.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>4.5 (80 reviews)</Text>
            </View>
          </View>
          <View style={styles.experienceBadge}>
            <Text style={styles.expText}>{prov.experienceYears || 2} Yrs Exp</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{prov.serviceArea || 'Local Area'} • ~15 mins away</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.pricingRow}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Visiting Fee</Text>
            <Text style={styles.priceValue}>₹{matchedService.serviceCharge}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>Labour (Est.)</Text>
            <Text style={styles.priceValue}>₹{matchedService.labourCharge}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={() => handleSelectProvider(prov)}>
            <Text style={styles.bookBtnText}>Select</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Local Technicians" showBack onBack={() => navigation.goBack()} />

      <View style={styles.headerArea}>
        <Text style={styles.title}>Step 6: Choose Technician</Text>
        <Text style={styles.subtitle}>Select an experienced local expert near you.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} size="large" />
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item._id}
          renderItem={renderProvider}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Technicians Found</Text>
              <Text style={styles.emptyText}>There are no verified local technicians available for this specific fault in your area.</Text>
            </View>
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  providerName: { ...TYPOGRAPHY.heading3, color: COLORS.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  
  experienceBadge: { backgroundColor: COLORS.surface, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: COLORS.divider },
  expText: { fontSize: 11, fontWeight: '800', color: COLORS.text },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  infoText: { fontSize: 12, color: COLORS.textSecondary },

  divider: { height: 1, backgroundColor: COLORS.divider, marginBottom: 12 },

  pricingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceCol: { flex: 1 },
  priceLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 2 },
  priceValue: { fontSize: 16, color: COLORS.text, fontWeight: '800' },
  
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.md },
  bookBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },

  emptyBox: { alignItems: 'center', padding: 40, marginTop: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
});

export default LocalProviderListScreen;

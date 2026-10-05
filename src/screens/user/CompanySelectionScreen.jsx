import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CompanySelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem } = route.params;
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // Simulating a brief load for UX, or you could fetch other authorized centers here
      await new Promise(resolve => setTimeout(resolve, 300));
      const dummyId = '654321098765432109876543'; // Valid 24-hex ObjectId
      setCompanies([{ _id: product.companyId?._id || dummyId, companyName: product.companyId?.companyName || 'Authorized Service Center' }]);
    } catch (e) {
      console.error(e);
      setCompanies([{ _id: '654321098765432109876543', companyName: 'Authorized Service Center' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company) => {
    navigation.navigate('BillUpload', {
      categoryId, categoryName, product, problem, company,
    });
  };

  const renderCompany = ({ item: comp }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectCompany(comp)}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="business" size={28} color={COLORS.primary} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.companyName}>{comp.companyName}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.badgeText}>4.8 (120)</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: COLORS.successBg }]}>
            <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
            <Text style={[styles.badgeText, { color: COLORS.success }]}>Authorized</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Select Partner" showBack onBack={() => navigation.goBack()} />

      <View style={styles.headerArea}>
        <Text style={styles.title}>Step 3: Choose Service Partner</Text>
        <Text style={styles.subtitle}>Select an authorized brand partner or a verified local technician.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} size="large" />
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item._id}
          renderItem={renderCompany}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.primaryLight} />
              <Text style={styles.infoText}>
                Booking through Authorized Centers is required to claim warranty benefits for {product.brand}.
              </Text>
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 20 },
  listContent: { paddingHorizontal: 16 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  iconWrap: {
    width: 54, height: 54, borderRadius: 12,
    backgroundColor: COLORS.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  textWrap: { flex: 1, paddingRight: 10 },
  companyName: { ...TYPOGRAPHY.heading3, color: COLORS.text, marginBottom: 8 },
  
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#B45309' },

  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: 16, marginTop: 10, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  infoText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, marginLeft: 12, lineHeight: 18 },
});

export default CompanySelectionScreen;

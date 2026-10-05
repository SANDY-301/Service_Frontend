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

const LocalProviderListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, bill, warrantyData } = route.params;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilteredProviders();
  }, [categoryId, problem]);

  const fetchFilteredProviders = async () => {
    try {
      setLoading(true);
      const problemId = problem ? problem._id : '';
      const res = await apiClient.get(
        `/providers?categoryId=${categoryId}&serviceProblemId=${problemId}`
      );
      setProviders(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvider = (prov) => {
    // Find matching service charges for selected problem
    const matchedService = prov.offeredServices?.find(
      (s) => s.problemId?._id === problem?._id || s.problemId === problem?._id
    ) || prov.offeredServices?.[0] || { serviceCharge: 0, labourCharge: 0 };

    navigation.navigate('PriceBreakdown', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
      bill,
      warrantyData,
      serviceType: 'LOCAL_SERVICE',
      serviceCharge: matchedService.serviceCharge,
      warrantyDiscount: 0,
      labourCharge: matchedService.labourCharge,
      provider: prov,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Local Providers" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Providers for {categoryName} → {problem?.problemName || 'Repair'}
        </Text>
        <Text style={styles.subtitle}>
          Filtered strictly by your appliance category and problem type
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : providers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🛠️</Text>
            <Text style={styles.emptyTitle}>No exact provider match found</Text>
            <Text style={styles.emptySub}>
              Try selecting Authorized Company Service or check back soon as new providers register.
            </Text>
          </View>
        ) : (
          providers.map((prov) => {
            const matchedService = prov.offeredServices?.find(
              (s) => s.problemId?._id === problem?._id || s.problemId === problem?._id
            ) || prov.offeredServices?.[0] || { serviceCharge: 0, labourCharge: 0 };

            const totalPayable = matchedService.serviceCharge + matchedService.labourCharge;

            return (
              <TouchableOpacity
                key={prov._id}
                style={styles.providerCard}
                onPress={() => handleSelectProvider(prov)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{prov.name.substring(0, 2).toUpperCase()}</Text>
                  </View>

                  <View style={styles.headerInfo}>
                    <Text style={styles.providerName}>{prov.name}</Text>
                    <Text style={styles.experienceText}>
                      ⭐ {prov.experienceYears} Years Experience • {prov.city}
                    </Text>
                    <Text style={styles.areaText}>Area: {prov.serviceArea}</Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Service Charge: ₹{matchedService.serviceCharge}</Text>
                  <Text style={styles.priceLabel}>Labour: ₹{matchedService.labourCharge}</Text>
                  <Text style={styles.totalPrice}>Total: ₹{totalPayable}</Text>
                </View>

                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => handleSelectProvider(prov)}
                >
                  <Text style={styles.selectBtnText}>Select Provider & Pick Slot →</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
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
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  emptySub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },
  providerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  headerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '800', color: COLORS.white },
  experienceText: { fontSize: 12, color: COLORS.primaryLight, marginTop: 2, fontWeight: '600' },
  areaText: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  priceLabel: { fontSize: 12, color: COLORS.textSecondary },
  totalPrice: { fontSize: 14, color: COLORS.success, fontWeight: '800' },
  selectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
});

export default LocalProviderListScreen;

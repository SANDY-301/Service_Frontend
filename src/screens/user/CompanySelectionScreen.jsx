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

const CompanySelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem } = route.params;
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/companies');
      setCompanies(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company) => {
    navigation.navigate('BillUpload', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Select Store/Company" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 4: Where was this purchased?</Text>
        <Text style={styles.subtitle}>Select the authorized dealer/company for warranty claim</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          companies.map((comp) => (
            <TouchableOpacity
              key={comp._id}
              style={styles.card}
              onPress={() => handleSelectCompany(comp)}
            >
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>🏢</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.companyName}>{comp.companyName}</Text>
                <Text style={styles.location}>
                  {comp.city}, {comp.state} • GST: {comp.gstNumber || 'Authorized Store'}
                </Text>
                <Text style={styles.desc} numberOfLines={2}>
                  {comp.description}
                </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  iconText: { fontSize: 24 },
  info: { flex: 1 },
  companyName: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  location: { fontSize: 12, color: COLORS.primaryLight, marginTop: 2, fontWeight: '600' },
  desc: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
});

export default CompanySelectionScreen;

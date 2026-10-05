import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const ProviderExpertiseScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [serviceCharge, setServiceCharge] = useState('450');
  const [labourCharge, setLabourCharge] = useState('200');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedCategoryId(res.data[0]._id);
        fetchProblems(res.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProblems = async (catId) => {
    try {
      const res = await apiClient.get(`/categories/${catId}/problems`);
      setProblems(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProblemId(res.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    fetchProblems(catId);
  };

  const handleSaveExpertise = async () => {
    if (!user?.providerId) {
      alert('Provider profile ID not found');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        categoryId: selectedCategoryId,
        problemId: selectedProblemId,
        serviceCharge: Number(serviceCharge) || 450,
        labourCharge: Number(labourCharge) || 200,
      };

      await apiClient.post(`/providers/${user.providerId}/services`, payload);
      setLoading(false);

      alert('Expertise & Pricing saved successfully!');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      alert('Error updating expertise pricing: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Expertise & Rates" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Provider Expertise & Rates</Text>
        <Text style={styles.subtitle}>Specify the appliance faults you service & set your custom fees</Text>

        <Text style={styles.label}>Choose Appliance Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.chip, selectedCategoryId === cat._id && styles.chipActive]}
              onPress={() => handleCategorySelect(cat._id)}
            >
              <Text style={[styles.chipText, selectedCategoryId === cat._id && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Choose Specific Fault / Problem:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {problems.map((prob) => (
            <TouchableOpacity
              key={prob._id}
              style={[styles.chip, selectedProblemId === prob._id && styles.chipActive]}
              onPress={() => setSelectedProblemId(prob._id)}
            >
              <Text style={[styles.chipText, selectedProblemId === prob._id && styles.chipTextActive]}>
                {prob.problemName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Service Charge (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={serviceCharge}
              onChangeText={setServiceCharge}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Labour Charge (₹)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={labourCharge}
              onChangeText={setLabourCharge}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveExpertise} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Expertise & Rate ✓</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  chipRow: { marginBottom: 14 },
  chip: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight },
  chipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '700' },
  chipTextActive: { color: COLORS.white },
  inputGroup: { marginBottom: 14 },
  row: { flexDirection: 'row' },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default ProviderExpertiseScreen;

import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
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
    } catch (e) { console.error(e); }
  };

  const fetchProblems = async (catId) => {
    try {
      const res = await apiClient.get(`/categories/${catId}/problems`);
      setProblems(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProblemId(res.data[0]._id);
      }
    } catch (e) { console.error(e); }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
    fetchProblems(catId);
  };

  const handleSaveExpertise = async () => {
    const providerId = user?.providerId || user?.provider?._id || user?._id;
    
    if (!providerId) {
      alert('Provider profile ID not found. Please log out and log in again.');
      return;
    }
    
    if (!selectedCategoryId || !selectedProblemId) {
      alert('Please select both a category and a specific fault.');
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

      await apiClient.post(`/providers/${providerId}/services`, payload);
      setLoading(false);

      alert('Expertise & Pricing saved successfully!');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      alert('Error updating expertise pricing: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Expertise & Rates" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={30}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Provider Expertise & Rates</Text>
        <Text style={styles.subtitle}>Specify the appliance faults you service & set your custom fees for each task.</Text>

        {/* CATEGORY PICKER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Appliance Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories.length === 0 ? (
              <Text style={{ color: COLORS.danger, fontSize: 13, marginTop: 4 }}>No categories found in database.</Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={[styles.chip, selectedCategoryId === cat._id && styles.chipActive]}
                  onPress={() => handleCategorySelect(cat._id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectedCategoryId === cat._id && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* FAULT PICKER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Specific Fault / Problem</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {problems.length === 0 ? (
              <Text style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>
                {categories.length === 0 ? 'Select a category first' : 'No problems defined for this category.'}
              </Text>
            ) : (
              problems.map((prob) => (
                <TouchableOpacity
                  key={prob._id}
                  style={[styles.chip, selectedProblemId === prob._id && styles.chipActive]}
                  onPress={() => setSelectedProblemId(prob._id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectedProblemId === prob._id && styles.chipTextActive]}>
                    {prob.problemName}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* RATES CONFIG */}
        <Text style={styles.sectionTitle}>Custom Rates Configuration</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8, marginBottom: 0 }]}>
              <Text style={styles.label}>Service Charge</Text>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.input, styles.currencyInput]}
                  keyboardType="numeric"
                  placeholder="450"
                  placeholderTextColor={COLORS.textMuted}
                  value={serviceCharge}
                  onChangeText={setServiceCharge}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.label}>Labour Charge</Text>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.input, styles.currencyInput]}
                  keyboardType="numeric"
                  placeholder="200"
                  placeholderTextColor={COLORS.textMuted}
                  value={labourCharge}
                  onChangeText={setLabourCharge}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveExpertise} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.saveBtnContent}>
              <Ionicons name="checkmark-done" size={18} color={COLORS.white} />
              <Text style={styles.saveBtnText}>Save Expertise & Rates</Text>
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 100 },

  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 20 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },

  chipRow: { flexDirection: 'row' },
  chip: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipActive: { backgroundColor: COLORS.primaryGhost, borderColor: COLORS.primaryLight },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.primary, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  
  currencyInputWrap: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  currencyInput: { flex: 1, paddingLeft: 30 },

  saveBtn: {
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default ProviderExpertiseScreen;

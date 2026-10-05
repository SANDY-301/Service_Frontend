import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const AdminAddProductScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [productName, setProductName] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [warrantyPeriodMonths, setWarrantyPeriodMonths] = useState('12');
  const [warrantyType, setWarrantyType] = useState('Standard Comprehensive');
  const [companyServiceCharge, setCompanyServiceCharge] = useState('500');
  const [labourCharge, setLabourCharge] = useState('300');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
      if (res.data && res.data.length > 0) setSelectedCategoryId(res.data[0]._id);
    } catch (e) { console.error(e); }
  };

  const handleSaveProduct = async () => {
    setAttemptedSubmit(true);
    if (!productName || !brand || !modelNumber || !selectedCategoryId) {
      setErrorMsg('Please fill all mandatory product details.');
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const payload = {
        companyId: user?.companyId || user?._id,
        categoryId: selectedCategoryId,
        brand,
        productName,
        modelNumber,
        warrantyPeriodMonths: Number(warrantyPeriodMonths) || 12,
        warrantyType,
        companyServiceCharge: Number(companyServiceCharge) || 500,
        labourCharge: Number(labourCharge) || 300,
      };
      await apiClient.post('/products', payload);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response?.data?.message || 'Error creating product. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Store Product" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={30}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Register Supported Product</Text>
        <Text style={styles.subtitle}>Configure model numbers, warranty periods & company service fees for customers to book.</Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* CATEGORY PICKER CHIPS */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Appliance Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories.length === 0 ? (
              <Text style={{ color: COLORS.danger, fontSize: 13, marginTop: 4 }}>
                No categories available in the database! Please run seed script or add categories.
              </Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={[styles.catChip, selectedCategoryId === cat._id && styles.catChipActive]}
                  onPress={() => setSelectedCategoryId(cat._id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.catChipText, selectedCategoryId === cat._id && styles.catChipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* INPUT FORM */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand Name *</Text>
            <TextInput
              style={[styles.input, attemptedSubmit && !brand && styles.inputError]}
              placeholder="e.g. Samsung, LG, Sony"
              placeholderTextColor={COLORS.textMuted}
              value={brand}
              onChangeText={setBrand}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={[styles.input, attemptedSubmit && !productName && styles.inputError]}
              placeholder="e.g. 1.5 Ton 5 Star Inverter Split AC"
              placeholderTextColor={COLORS.textMuted}
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model Number *</Text>
            <TextInput
              style={[styles.input, attemptedSubmit && !modelNumber && styles.inputError]}
              placeholder="e.g. AR18CY5AMWK"
              placeholderTextColor={COLORS.textMuted}
              value={modelNumber}
              onChangeText={setModelNumber}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Warranty & Pricing Configuration</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Warranty (Months)</Text>
              <TextInput
                style={styles.input}
                placeholder="12"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="numeric"
                value={warrantyPeriodMonths}
                onChangeText={setWarrantyPeriodMonths}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Warranty Type</Text>
              <TextInput
                style={styles.input}
                placeholder="Comprehensive"
                placeholderTextColor={COLORS.textMuted}
                value={warrantyType}
                onChangeText={setWarrantyType}
              />
            </View>
          </View>

          <View style={[styles.row, { marginBottom: 0 }]}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8, marginBottom: 0 }]}>
              <Text style={styles.label}>Base Service Charge</Text>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.input, styles.currencyInput]}
                  placeholder="500"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={companyServiceCharge}
                  onChangeText={setCompanyServiceCharge}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginBottom: 0 }]}>
              <Text style={styles.label}>Labour Charge</Text>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.input, styles.currencyInput]}
                  placeholder="300"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={labourCharge}
                  onChangeText={setLabourCharge}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProduct} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.saveBtnContent}>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.white} />
              <Text style={styles.saveBtnText}>Save Product Record</Text>
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 120 },

  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBorder,
    padding: 12, borderRadius: RADIUS.md, marginBottom: 20,
  },
  errorText: { color: COLORS.danger, fontSize: 13, fontWeight: '500', flex: 1 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    ...SHADOWS.small,
  },

  chipRow: { flexDirection: 'row' },
  catChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catChipActive: { backgroundColor: COLORS.primaryGhost, borderColor: COLORS.primaryLight },
  catChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  catChipTextActive: { color: COLORS.primary, fontWeight: '700' },

  inputGroup: { marginBottom: 16 },
  row: { flexDirection: 'row' },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
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
  inputError: { borderColor: COLORS.danger, borderWidth: 1.5 },

  currencyInputWrap: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  currencyInput: { flex: 1, paddingLeft: 30 },

  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...SHADOWS.small,
  },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default AdminAddProductScreen;

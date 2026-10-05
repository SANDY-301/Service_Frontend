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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedCategoryId(res.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async () => {
    if (!productName || !brand || !modelNumber || !selectedCategoryId) {
      setErrorMsg('Please fill mandatory product details (Brand, Product Name, Model, Category)');
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

      alert('Product created successfully!');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.response?.data?.message || 'Error creating product');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Store Product" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Register Supported Product</Text>
        <Text style={styles.subtitle}>Configure model numbers, warranty periods & company service fees</Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* CATEGORY PICKER CHIPS */}
        <Text style={styles.label}>Select Appliance Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.catChip,
                selectedCategoryId === cat._id && styles.catChipActive,
              ]}
              onPress={() => setSelectedCategoryId(cat._id)}
            >
              <Text
                style={[
                  styles.catChipText,
                  selectedCategoryId === cat._id && styles.catChipTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Samsung, LG, Sony"
            placeholderTextColor={COLORS.textMuted}
            value={brand}
            onChangeText={setBrand}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1.5 Ton 5 Star Inverter Split AC"
            placeholderTextColor={COLORS.textMuted}
            value={productName}
            onChangeText={setProductName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. AR18CY5AMWK"
            placeholderTextColor={COLORS.textMuted}
            value={modelNumber}
            onChangeText={setModelNumber}
          />
        </View>

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

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Company Charge (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="500"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={companyServiceCharge}
              onChangeText={setCompanyServiceCharge}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Labour Charge (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="300"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={labourCharge}
              onChangeText={setLabourCharge}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProduct} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Product Record ✓</Text>
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
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: COLORS.dangerBg,
    padding: 8,
    borderRadius: 8,
  },
  chipRow: { marginBottom: 14 },
  catChip: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight },
  catChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '700' },
  catChipTextActive: { color: COLORS.white },
  inputGroup: { marginBottom: 12 },
  row: { flexDirection: 'row' },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4, fontWeight: '600' },
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

export default AdminAddProductScreen;

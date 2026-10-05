import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../theme/theme';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient';

const AdminAddFaultScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [problemName, setProblemName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setAttemptedSubmit(true);
    if (!selectedCategoryId || !problemName) {
      Alert.alert('Validation Error', 'Please select a category and provide a fault name.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(`/categories/${selectedCategoryId}/problems`, {
        problemName,
        description,
      });
      setLoading(false);
      Alert.alert('Success', 'Service Fault added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', e.response?.data?.message || 'Failed to add fault');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Service Fault" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={30}
      >
        <Text style={styles.title}>Define New Fault</Text>
        <Text style={styles.subtitle}>Register common issues (e.g. Water Leaking, Not Cooling) so technicians can set their rates.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Select Parent Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories.length === 0 ? (
              <Text style={{ color: COLORS.danger, fontSize: 13, marginTop: 4 }}>
                No categories available. Please add a category first.
              </Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={[styles.chip, selectedCategoryId === cat._id && styles.chipActive]}
                  onPress={() => setSelectedCategoryId(cat._id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectedCategoryId === cat._id && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fault / Problem Name *</Text>
            <TextInput
              style={[styles.input, attemptedSubmit && !problemName && styles.inputError]}
              placeholder="e.g. Compressor Not Working"
              placeholderTextColor={COLORS.textMuted}
              value={problemName}
              onChangeText={setProblemName}
            />
          </View>

          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={styles.label}>Short Description (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Describe the issue briefly..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.saveBtnContent}>
              <Ionicons name="construct" size={18} color={COLORS.white} />
              <Text style={styles.saveBtnText}>Save Service Fault</Text>
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
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  
  chipRow: { flexDirection: 'row', marginBottom: 20 },
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

  inputGroup: { marginBottom: 16 },
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

  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default AdminAddFaultScreen;

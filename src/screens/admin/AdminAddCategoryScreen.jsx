import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../../theme/theme';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient';

const AdminAddCategoryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleSave = async () => {
    setAttemptedSubmit(true);
    if (!name) {
      Alert.alert('Validation Error', 'Please provide a Category Name.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/categories', {
        name,
        description,
        icon: iconUrl || undefined,
      });
      setLoading(false);
      Alert.alert('Success', 'Appliance Category added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', e.response?.data?.message || 'Failed to add category');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Category" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={30}
      >
        <Text style={styles.title}>New Appliance Category</Text>
        <Text style={styles.subtitle}>Add a new primary category to the database (e.g., Air Conditioner, Refrigerator).</Text>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category Name *</Text>
            <TextInput
              style={[styles.input, attemptedSubmit && !name && styles.inputError]}
              placeholder="e.g. Washing Machine"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Top Load, Front Load & Semi Automatic"
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Icon URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/icon.png"
              placeholderTextColor={COLORS.textMuted}
              value={iconUrl}
              onChangeText={setIconUrl}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <View style={styles.saveBtnContent}>
              <Ionicons name="add-circle-outline" size={18} color={COLORS.white} />
              <Text style={styles.saveBtnText}>Save Category to Database</Text>
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
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
    ...SHADOWS.small,
  },
  saveBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default AdminAddCategoryScreen;

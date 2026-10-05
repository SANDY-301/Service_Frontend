import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProblemSelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product } = route.params;
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => { fetchProblems(); }, [categoryId]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/categories/${categoryId}/problems`);
      setProblems(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProblem = (problem) => {
    navigation.navigate('CompanySelection', {
      categoryId, categoryName, product, problem,
    });
  };

  const renderProblem = ({ item: prob }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectProblem(prob)}
      activeOpacity={0.8}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="construct-outline" size={24} color={COLORS.primaryLight} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.problemName}>{prob.problemName}</Text>
        <Text style={styles.description} numberOfLines={2}>{prob.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Identify Issue" showBack onBack={() => navigation.goBack()} />

      <View style={styles.headerArea}>
        <Text style={styles.title}>Step 2: What's the problem?</Text>
        <Text style={styles.subtitle}>Select the issue you are facing with your {categoryName}.</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} size="large" />
      ) : (
        <FlatList
          data={problems}
          keyExtractor={(item) => item._id}
          renderItem={renderProblem}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No common problems listed.</Text>
              <TouchableOpacity
                style={styles.otherBtn}
                onPress={() => handleSelectProblem({ _id: null, problemName: 'General Servicing / Other', description: 'Custom issue' })}
              >
                <Text style={styles.otherBtnText}>Proceed with General Servicing</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            problems.length > 0 ? (
              <TouchableOpacity
                style={styles.otherCard}
                onPress={() => handleSelectProblem({ _id: null, problemName: 'Other / Not sure', description: 'Technician to inspect' })}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrap, { backgroundColor: COLORS.surface }]}>
                  <Ionicons name="help" size={24} color={COLORS.textSecondary} />
                </View>
                <View style={styles.textWrap}>
                  <Text style={[styles.problemName, { color: COLORS.text }]}>Other / Not Sure</Text>
                  <Text style={styles.description}>Let the technician inspect & diagnose</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            ) : null
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
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  textWrap: { flex: 1, paddingRight: 10 },
  problemName: { ...TYPOGRAPHY.heading3, color: COLORS.text, marginBottom: 4 },
  description: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  otherCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: 16, borderWidth: 1, borderColor: COLORS.divider, borderStyle: 'dashed',
    marginTop: 8,
  },

  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginVertical: 16 },
  otherBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: RADIUS.md },
  otherBtnText: { color: COLORS.white, fontWeight: '700' },
});

export default ProblemSelectionScreen;

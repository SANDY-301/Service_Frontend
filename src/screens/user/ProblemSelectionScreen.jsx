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

const ProblemSelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product } = route.params;
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, [categoryId]);

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
      categoryId,
      categoryName,
      product,
      problem,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Select Problem" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 3: What is the issue with your {categoryName}?</Text>
        <Text style={styles.subtitle}>Select the exact fault to filter authorized & local technicians</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          problems.map((prob) => (
            <TouchableOpacity
              key={prob._id}
              style={styles.problemCard}
              onPress={() => handleSelectProblem(prob)}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⚠️</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.problemName}>{prob.problemName}</Text>
                <Text style={styles.problemDesc}>
                  {prob.description || `Specialized service for ${prob.problemName}`}
                </Text>
              </View>
              <Text style={styles.arrowText}>→</Text>
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
  problemCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: { fontSize: 18 },
  textContainer: { flex: 1 },
  problemName: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  problemDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  arrowText: { fontSize: 18, color: COLORS.primaryLight, fontWeight: 'bold' },
});

export default ProblemSelectionScreen;

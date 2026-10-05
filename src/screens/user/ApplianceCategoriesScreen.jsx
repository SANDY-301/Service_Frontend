import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const ApplianceCategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Select Appliance" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 1: Choose Appliance Category</Text>
        <Text style={styles.subtitle}>
          Select the appliance you need company-authorized or local service for
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.grid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onPress={() =>
                  navigation.navigate('ProductSelection', {
                    categoryId: cat._id,
                    categoryName: cat.name,
                  })
                }
              />
            ))}
          </View>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default ApplianceCategoriesScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, TYPOGRAPHY, RADIUS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';

const ApplianceCategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCategories(); }, []);

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

  const renderHeader = () => (
    <View style={styles.pageHeader}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepText}>STEP 1 OF 4</Text>
      </View>
      <Text style={styles.title}>Select Appliance</Text>
      <Text style={styles.subtitle}>
        Choose the appliance you need service for
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Book Service" showBack onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={() =>
                navigation.navigate('ProductSelection', {
                  categoryId: item._id,
                  categoryName: item.name,
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cube-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No Categories</Text>
              <Text style={styles.emptyText}>Categories will appear here once added.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: COLORS.textMuted, fontSize: 14 },

  listContent: { padding: 16, paddingBottom: 40 },

  pageHeader: {
    marginBottom: 20,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryGhost,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
});

export default ApplianceCategoriesScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ServiceOptionsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, billImage, billScanResult } = route.params;
  const isWarrantyValid = billScanResult?.status === 'VALID';
  const insets = useSafeAreaInsets();

  const handleSelectOption = (isAuthorized) => {
    if (isAuthorized) {
      navigation.navigate('DateSlotSelection', {
        categoryId, categoryName, product, problem, company, billImage, billScanResult,
        providerType: 'AUTHORIZED',
      });
    } else {
      navigation.navigate('LocalProviderList', {
        categoryId, categoryName, product, problem, company, billImage, billScanResult,
        providerType: 'LOCAL',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Service Option" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>Step 5: How would you like to proceed?</Text>
          <Text style={styles.subtitle}>Choose between your brand's authorized service center or a local verified technician.</Text>
        </View>

        {isWarrantyValid && (
          <View style={styles.warrantyAlert}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.white} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.alertTitle}>Active Warranty Detected!</Text>
              <Text style={styles.alertText}>Your appliance is under warranty. Booking an authorized center covers part replacement costs.</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.optionCard} onPress={() => handleSelectOption(true)} activeOpacity={0.8}>
          <View style={[styles.cardHeader, { backgroundColor: COLORS.primaryGhost }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={28} color={COLORS.primary} />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.optionTitle}>Authorized Brand Center</Text>
              <Text style={styles.optionTag}>Recommended</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.bullet}>• Authentic OEM spare parts guaranteed</Text>
            <Text style={styles.bullet}>• Eligible for zero-cost repairs if in warranty</Text>
            <Text style={styles.bullet}>• Brand-certified technicians</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingText}>Base Visit Fee: ₹{product.companyServiceCharge || 500}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => handleSelectOption(false)} activeOpacity={0.8}>
          <View style={[styles.cardHeader, { backgroundColor: COLORS.surface }]}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.background }]}>
              <Ionicons name="construct" size={28} color={COLORS.textSecondary} />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={[styles.optionTitle, { color: COLORS.text }]}>Local Verified Technician</Text>
              <Text style={[styles.optionTag, { backgroundColor: COLORS.divider, color: COLORS.textSecondary }]}>Cost Effective</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.bullet}>• Usually faster same-day response</Text>
            <Text style={styles.bullet}>• Competitive third-party repair rates</Text>
            <Text style={styles.bullet}>• Warranty coverage will NOT apply</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingText}>Base Visit Fee: Varies by technician</Text>
            </View>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  headerArea: { marginBottom: 20 },
  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  warrantyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: RADIUS.lg,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  alertTitle: { fontSize: 15, fontWeight: '800', color: COLORS.white, marginBottom: 2 },
  alertText: { fontSize: 12, color: COLORS.white, opacity: 0.9, lineHeight: 18 },

  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  optionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  optionTag: { alignSelf: 'flex-start', backgroundColor: COLORS.primary, color: COLORS.white, fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, textTransform: 'uppercase' },

  cardBody: { padding: 16 },
  bullet: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500' },
  pricingRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.divider },
  pricingText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
});

export default ServiceOptionsScreen;

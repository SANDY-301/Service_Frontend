import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import Header from '../../components/Header';
import PriceBreakdownCard from '../../components/PriceBreakdownCard';

const PriceBreakdownScreen = ({ route, navigation }) => {
  const {
    categoryId,
    categoryName,
    product,
    problem,
    company,
    bill,
    warrantyData,
    serviceType,
    serviceCharge,
    warrantyDiscount,
    labourCharge,
    provider,
  } = route.params;

  const isWarrantyActive = serviceType === 'COMPANY_WARRANTY';
  const remainingServiceCharge = Math.max(0, serviceCharge - warrantyDiscount);
  const finalAmount = Math.max(0, remainingServiceCharge + labourCharge);

  const handleProceedToSlot = () => {
    navigation.navigate('DateSlotSelection', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
      bill,
      warrantyData,
      serviceType,
      serviceCharge,
      warrantyDiscount,
      labourCharge,
      finalAmount,
      provider,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Price Breakdown" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 9: Review Service Charges</Text>
        <Text style={styles.subtitle}>
          Transparent itemized pricing with zero hidden fees
        </Text>

        {/* SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Service Summary</Text>
          <Text style={styles.summaryItem}>Appliance: {categoryName}</Text>
          <Text style={styles.summaryItem}>Problem: {problem?.problemName || 'General Repair'}</Text>
          <Text style={styles.summaryItem}>
            Provider: {serviceType === 'LOCAL_SERVICE' ? provider?.name : company?.companyName || 'Store Authorized'}
          </Text>
          <Text style={styles.summaryItem}>
            Service Type: {serviceType.replace(/_/g, ' ')}
          </Text>
        </View>

        {/* ITEMIZATION CARD */}
        <PriceBreakdownCard
          baseServiceCharge={serviceCharge}
          warrantyDiscount={warrantyDiscount}
          labourCharge={labourCharge}
          finalAmount={finalAmount}
          isWarrantyActive={isWarrantyActive}
          title="Transparent Pricing Calculation"
        />

        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedToSlot}>
          <Text style={styles.proceedBtnText}>Proceed to Select Date & Time Slot →</Text>
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
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 8 },
  summaryItem: { fontSize: 13, color: COLORS.textSecondary, marginVertical: 2 },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  proceedBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default PriceBreakdownScreen;

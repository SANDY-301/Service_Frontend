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

const ServiceOptionsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, bill, warrantyData } = route.params;

  const isWarrantyActive = warrantyData?.warrantyStatus === 'ACTIVE' || warrantyData?.isWarrantyActive;

  const companyServiceCharge = product?.companyServiceCharge || 600;
  const companyLabourCharge = product?.labourCharge || 350;

  const handleSelectCompanyService = () => {
    navigation.navigate('PriceBreakdown', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
      bill,
      warrantyData,
      serviceType: isWarrantyActive ? 'COMPANY_WARRANTY' : 'COMPANY_PAID',
      serviceCharge: companyServiceCharge,
      warrantyDiscount: isWarrantyActive ? companyServiceCharge : 0,
      labourCharge: companyLabourCharge,
      provider: null,
    });
  };

  const handleSelectLocalProvider = () => {
    navigation.navigate('LocalProviderList', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
      bill,
      warrantyData,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Service Options" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 8: Choose Service Option</Text>
        <Text style={styles.subtitle}>
          {isWarrantyActive
            ? 'Your appliance is covered under active warranty. Select authorized company service.'
            : 'Warranty is expired. Compare authorized store service vs vetted local providers.'}
        </Text>

        {/* OPTION 1: AUTHORIZED COMPANY SERVICE */}
        <View style={[styles.optionCard, isWarrantyActive && styles.activeWarrantyBorder]}>
          <View style={styles.optionHeader}>
            <View style={styles.optionBadge}>
              <Text style={styles.optionBadgeText}>OPTION 1: AUTHORIZED COMPANY SERVICE</Text>
            </View>
            {isWarrantyActive ? (
              <Text style={styles.warrantyCoveredTag}>🛡️ COVERED BY WARRANTY</Text>
            ) : null}
          </View>

          <Text style={styles.companyName}>
            {company?.companyName || 'Sathya Authorized Brand Service'}
          </Text>
          <Text style={styles.optionDesc}>
            Official company-certified technicians, genuine manufacturer spare parts, full warranty compliance.
          </Text>

          <PriceBreakdownCard
            baseServiceCharge={companyServiceCharge}
            warrantyDiscount={isWarrantyActive ? companyServiceCharge : 0}
            labourCharge={companyLabourCharge}
            finalAmount={
              Math.max(0, companyServiceCharge - (isWarrantyActive ? companyServiceCharge : 0)) +
              companyLabourCharge
            }
            isWarrantyActive={isWarrantyActive}
            title="Company Service Pricing"
          />

          <TouchableOpacity style={styles.selectBtn} onPress={handleSelectCompanyService}>
            <Text style={styles.selectBtnText}>
              {isWarrantyActive ? 'Book Company Warranty Service →' : 'Book Company Paid Service →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* OPTION 2: LOCAL SERVICE PROVIDERS (ALWAYS SHOWN OR WHEN EXPIRED/CHOICE NEEDED) */}
        <View style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <View style={[styles.optionBadge, { backgroundColor: COLORS.info }]}>
              <Text style={styles.optionBadgeText}>OPTION 2: LOCAL SERVICE PROVIDER</Text>
            </View>
          </View>

          <Text style={styles.companyName}>Vetted Local Technicians</Text>
          <Text style={styles.optionDesc}>
            Independent certified technicians in your city offering competitive pricing, quick turnaround & direct contact.
          </Text>

          <View style={styles.localPricePreview}>
            <Text style={styles.localPriceTitle}>Typical Local Technician Rates:</Text>
            <Text style={styles.localPriceSub}>
              Service Charge: ~₹350 - ₹450 | Labour: ~₹150 - ₹200
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.selectBtn, { backgroundColor: '#0F172A', borderWidth: 1, borderColor: COLORS.primary }]}
            onPress={handleSelectLocalProvider}
          >
            <Text style={[styles.selectBtnText, { color: COLORS.text }]}>
              Browse Local Providers for {problem?.problemName || categoryName} →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  activeWarrantyBorder: {
    borderColor: COLORS.success,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionBadge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.white },
  warrantyCoveredTag: { fontSize: 11, fontWeight: '800', color: COLORS.success },
  companyName: { fontSize: 16, fontWeight: '800', color: COLORS.white, marginTop: 4 },
  optionDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, marginBottom: 10 },
  localPricePreview: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  localPriceTitle: { fontSize: 12, fontWeight: '700', color: COLORS.white },
  localPriceSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  selectBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  selectBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
});

export default ServiceOptionsScreen;

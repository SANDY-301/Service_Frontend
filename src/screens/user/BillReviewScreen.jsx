import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BillReviewScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, billImage, ocrData } = route.params;
  const insets = useSafeAreaInsets();
  
  // Simulated parsing logic based on dummy OCR data response
  const isDateValid = ocrData?.purchaseDate !== null;
  const isModelMatch = ocrData?.modelMatch || false;
  
  const handleProceed = () => {
    // Determine warranty result directly here instead of calling backend again just to calculate dates
    const currentDate = new Date();
    const purchaseDate = isDateValid ? new Date(ocrData.purchaseDate) : null;
    let status = 'OUT_OF_WARRANTY';
    
    if (purchaseDate) {
      const warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + (product?.warrantyPeriodMonths || 12));
      
      if (currentDate <= warrantyEndDate) {
        status = 'VALID';
      }
    }

    navigation.navigate('WarrantyResult', {
      categoryId, categoryName, product, problem, company, billImage,
      billScanResult: {
        status,
        ocrData,
        message: status === 'VALID' ? 'Your appliance is actively under warranty!' : 'The warranty period has expired based on the bill date.',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Scan Results" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>Step 5: Review AI Extraction</Text>
          <Text style={styles.subtitle}>Our AI has extracted the following details from your bill.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Extracted Bill Details</Text>
          </View>

          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Brand Detected:</Text>
            <Text style={styles.dataValue}>{ocrData?.brand || 'Unknown'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Purchase Date:</Text>
            <Text style={styles.dataValue}>{ocrData?.purchaseDate || 'Not detected'}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Model Confidence:</Text>
            <Text style={styles.dataValue}>{ocrData?.confidence || 'N/A'}</Text>
          </View>

          <View style={styles.validationBox}>
            {isDateValid ? (
              <View style={styles.validRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.validText}>Valid purchase date detected</Text>
              </View>
            ) : (
              <View style={styles.invalidRow}>
                <Ionicons name="close-circle" size={16} color={COLORS.danger} />
                <Text style={styles.invalidText}>Could not detect purchase date</Text>
              </View>
            )}

            {isModelMatch ? (
              <View style={styles.validRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.validText}>Model matches selected product</Text>
              </View>
            ) : (
              <View style={styles.invalidRow}>
                <Ionicons name="warning" size={16} color={COLORS.warning} />
                <Text style={styles.invalidText}>Model mismatch or not clearly visible</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            If these details look incorrect, please go back and upload a clearer image of your bill.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedBtnText}>Check Warranty Eligibility</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  headerArea: { marginBottom: 20 },
  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.divider, paddingBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },

  dataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dataLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  dataValue: { fontSize: 14, color: COLORS.text, fontWeight: '700' },

  validationBox: { backgroundColor: COLORS.surface, padding: 12, borderRadius: RADIUS.md, marginTop: 8 },
  validRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  validText: { fontSize: 13, color: COLORS.success, fontWeight: '600' },
  invalidRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  invalidText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },

  infoBox: { flexDirection: 'row', padding: 16, backgroundColor: COLORS.surface, borderRadius: RADIUS.md },
  infoText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, marginLeft: 12, lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    paddingTop: 16, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
    ...SHADOWS.medium,
  },
  proceedBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md,
  },
  proceedBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default BillReviewScreen;

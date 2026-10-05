import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WarrantyResultScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, billImage, billScanResult } = route.params;
  const insets = useSafeAreaInsets();
  
  const isValid = billScanResult?.status === 'VALID';

  const handleProceed = () => {
    navigation.navigate('ServiceOptions', {
      categoryId, categoryName, product, problem, company, billImage, billScanResult,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Warranty Status" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.statusBanner, { backgroundColor: isValid ? COLORS.successBg : COLORS.danger + '1A' }]}>
          <View style={[styles.iconCircle, { backgroundColor: isValid ? COLORS.success : COLORS.danger }]}>
            <Ionicons name={isValid ? "checkmark" : "close"} size={40} color={COLORS.white} />
          </View>
          <Text style={[styles.statusTitle, { color: isValid ? COLORS.success : COLORS.danger }]}>
            {isValid ? 'Warranty Active!' : 'Warranty Expired or Invalid'}
          </Text>
          <Text style={styles.statusMsg}>
            {billScanResult?.message || (isValid ? 'Your appliance is covered under manufacturer warranty.' : 'No active warranty was found for this appliance.')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What this means for you</Text>
          
          {isValid ? (
            <>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.bulletText}>Replacement parts are fully covered</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.bulletText}>Brand authorized technician required for claim</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="alert-circle" size={16} color={COLORS.textSecondary} />
                <Text style={styles.bulletText}>Standard visitation fee may still apply</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.bulletRow}>
                <Ionicons name="close-circle" size={16} color={COLORS.danger} />
                <Text style={styles.bulletText}>Cost of spare parts will be charged</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.bulletText}>Freedom to choose any local technician</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="wallet" size={16} color={COLORS.textSecondary} />
                <Text style={styles.bulletText}>More flexible pricing on repair labour</Text>
              </View>
            </>
          )}
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedBtnText}>View Service Options</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },

  statusBanner: {
    alignItems: 'center',
    padding: 32,
    borderRadius: RADIUS.lg,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  statusTitle: { ...TYPOGRAPHY.heading2, marginBottom: 8, textAlign: 'center' },
  statusMsg: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.small,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bulletText: { fontSize: 13, color: COLORS.textSecondary, flex: 1, lineHeight: 18 },

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

export default WarrantyResultScreen;

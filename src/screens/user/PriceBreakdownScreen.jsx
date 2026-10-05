import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PriceBreakdownScreen = ({ route, navigation }) => {
  const {
    categoryId, categoryName, product, problem, company, billImage, billScanResult, providerType, provider,
    serviceType, slot, serviceCharge, labourCharge, warrantyDiscount,
  } = route.params;

  const insets = useSafeAreaInsets();
  const subTotal = serviceCharge + labourCharge;
  const totalAmount = subTotal - warrantyDiscount;

  const handleConfirm = () => {
    navigation.navigate('BookingConfirmation', {
      categoryId, categoryName, product, problem, company, billImage, billScanResult, providerType, provider,
      serviceType, slot, serviceCharge, labourCharge, warrantyDiscount, totalAmount,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Review & Pay" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>Step 8: Price Breakdown</Text>
          <Text style={styles.subtitle}>Review the estimated cost for your service request.</Text>
        </View>

        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
            <Text style={styles.receiptTitle}>Cost Estimate</Text>
          </View>
          
          <View style={styles.dottedLine} />

          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Base Visiting Fee</Text>
            <Text style={styles.itemValue}>₹{serviceCharge}</Text>
          </View>
          
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Estimated Labour / Repair</Text>
            <Text style={styles.itemValue}>₹{labourCharge}</Text>
          </View>

          {warrantyDiscount > 0 && (
            <View style={styles.discountRow}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
              <Text style={styles.discountLabel}>Active Warranty Discount</Text>
              <Text style={styles.discountValue}>- ₹{warrantyDiscount}</Text>
            </View>
          )}

          <View style={styles.solidLine} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable to Tech</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>
          
          <Text style={styles.disclaimer}>
            * This is an estimate. Spare parts (if not under warranty) and additional repairs may incur extra charges after physical inspection.
          </Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>₹{totalAmount}</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={handleConfirm} activeOpacity={0.85}>
            <Text style={styles.bookBtnText}>Confirm Booking</Text>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
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

  receiptCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.small,
  },
  receiptHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  receiptTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },

  dottedLine: { height: 1, borderWidth: 1, borderColor: COLORS.divider, borderStyle: 'dashed', marginBottom: 16 },
  solidLine: { height: 1, backgroundColor: COLORS.cardBorder, marginVertical: 16 },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  itemValue: { fontSize: 15, color: COLORS.text, fontWeight: '700' },

  discountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, backgroundColor: COLORS.successBg, padding: 10, borderRadius: RADIUS.md },
  discountLabel: { flex: 1, fontSize: 13, color: COLORS.success, fontWeight: '700', marginLeft: 6 },
  discountValue: { fontSize: 15, color: COLORS.success, fontWeight: '800' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: COLORS.text, fontWeight: '800' },
  totalValue: { fontSize: 24, color: COLORS.primary, fontWeight: '900' },

  disclaimer: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16, fontStyle: 'italic' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    paddingTop: 16, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
    ...SHADOWS.medium,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTotalLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  footerTotalValue: { fontSize: 22, color: COLORS.text, fontWeight: '900' },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: RADIUS.md,
  },
  bookBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default PriceBreakdownScreen;

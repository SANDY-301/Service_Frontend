import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const PriceBreakdownCard = ({
  baseServiceCharge = 0,
  warrantyDiscount = 0,
  labourCharge = 0,
  finalAmount = 0,
  isWarrantyActive = false,
  title = 'Price Breakdown',
}) => {
  const remainingServiceCharge = Math.max(0, baseServiceCharge - warrantyDiscount);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Base Company/Service Charge</Text>
        <Text style={styles.value}>₹{baseServiceCharge}</Text>
      </View>

      {isWarrantyActive || warrantyDiscount > 0 ? (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountLabel]}>Warranty Coverage / Discount</Text>
          <Text style={[styles.value, styles.discountValue]}>- ₹{warrantyDiscount}</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>Remaining Service Amount</Text>
        <Text style={styles.value}>₹{remainingServiceCharge}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Labour & Inspection Charge</Text>
        <Text style={styles.value}>+ ₹{labourCharge}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Payable Amount</Text>
        <Text style={styles.totalValue}>₹{finalAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  discountLabel: {
    color: COLORS.success,
  },
  discountValue: {
    color: COLORS.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryLight,
  },
});

export default PriceBreakdownCard;

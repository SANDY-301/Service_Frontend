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
import StatusBadge from '../../components/StatusBadge';

const BillReviewScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, bill } = route.params;

  const parsed = bill?.parsedOcrData || {};

  const handleProceed = () => {
    navigation.navigate('WarrantyResult', {
      categoryId,
      categoryName,
      product,
      problem,
      company,
      bill,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="OCR Bill Details" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 6: Review OCR Extracted Bill Data</Text>
        <Text style={styles.subtitle}>
          Below is the extracted information parsed locally by Tesseract OCR
        </Text>

        {/* STATUS BADGE CARD */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Bill Verification Status:</Text>
          <StatusBadge status={bill.verificationStatus || 'PENDING'} />
        </View>

        {/* PARSED DATA TABLE */}
        <View style={styles.tableCard}>
          <Text style={styles.tableTitle}>Extracted Bill Details</Text>

          <View style={styles.row}>
            <Text style={styles.key}>Invoice / Bill No:</Text>
            <Text style={styles.val}>{parsed.invoiceNumber || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Purchase Date:</Text>
            <Text style={styles.val}>{parsed.purchaseDate || '10/01/2026'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Customer Name:</Text>
            <Text style={styles.val}>{parsed.customerName || 'Customer'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Brand / Model:</Text>
            <Text style={styles.val}>{parsed.brand || product?.brand || 'Standard'} {parsed.modelNumber || product?.modelNumber || ''}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Total Amount:</Text>
            <Text style={styles.val}>₹{parsed.totalAmount || '42,500'}</Text>
          </View>
        </View>

        {/* RAW OCR TEXT BOX */}
        <View style={styles.ocrCard}>
          <Text style={styles.ocrTitle}>Raw OCR Extracted Text</Text>
          <Text style={styles.ocrText}>
            {bill.rawOcrText || 'Invoice No: SAT-2026-9482\nDate: 10/01/2026\nSamsung Split AC'}
          </Text>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            💡 Note: Store Admin will perform final verification of bill image against OCR output.
          </Text>
        </View>

        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
          <Text style={styles.proceedBtnText}>Continue to Warranty Check →</Text>
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
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  statusLabel: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  tableCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  tableTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
  },
  key: { fontSize: 13, color: COLORS.textSecondary },
  val: { fontSize: 13, color: COLORS.white, fontWeight: '700' },
  ocrCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
  },
  ocrTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6 },
  ocrText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: 'monospace' },
  noteBox: {
    backgroundColor: COLORS.warningBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  noteText: { fontSize: 12, color: COLORS.warning },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default BillReviewScreen;

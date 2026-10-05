import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Image, Dimensions
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient, { UPLOAD_BASE_URL } from '../../api/apiClient';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

const { width } = Dimensions.get('window');

const AdminBillVerificationScreen = ({ navigation }) => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields for manually editing OCR data if needed
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchBills(); }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bills');
      const data = res.data || [];
      setBills(data);
      if (data.length > 0) selectBillForEdit(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectBillForEdit = (bill) => {
    setSelectedBill(bill);
    setInvoiceNumber(bill.extractedData?.invoiceNumber || '');
    setPurchaseDate(bill.extractedData?.purchaseDate || '');
    setCustomerName(bill.extractedData?.customerName || '');
    setTotalAmount(bill.extractedData?.totalAmount ? String(bill.extractedData.totalAmount) : '');
  };

  const handleVerifyAction = async (status) => {
    if (!selectedBill) return;
    try {
      setUpdating(true);
      const payload = {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : '',
        correctedData: {
          invoiceNumber,
          purchaseDate,
          customerName,
          totalAmount: Number(totalAmount) || 0,
        },
      };
      await apiClient.put(`/bills/${selectedBill._id}/verify`, payload);
      alert(`Bill has been successfully ${status.toLowerCase()}!`);
      fetchBills(); // Refresh list
    } catch (e) {
      console.error(e);
      alert('Error updating bill status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Verify Bills" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pending Verifications</Text>
        <Text style={styles.subtitle}>Review uploaded receipts to activate customer warranty coverage</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 30 }} size="large" />
        ) : bills.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons name="receipt-outline" size={40} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No pending bills</Text>
            <Text style={styles.emptyText}>All customer uploaded bills have been processed.</Text>
          </View>
        ) : (
          <>
            {/* HORIZONTAL BILL CHIPS */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.billStrip}>
              {bills.map((b) => (
                <TouchableOpacity
                  key={b._id}
                  style={[styles.billChip, selectedBill?._id === b._id && styles.billChipActive]}
                  onPress={() => selectBillForEdit(b)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selectedBill?._id === b._id && styles.chipTextActive]}>
                    Bill #{b._id.substring(b._id.length - 6)}
                  </Text>
                  <StatusBadge status={b.status} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* BILL REVIEW PANEL */}
            {selectedBill ? (
              <View style={styles.reviewCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Bill Review</Text>
                  <StatusBadge status={selectedBill.status} />
                </View>

                {/* IMAGE PREVIEW */}
                <View style={styles.imageBox}>
                  {selectedBill.billImageUrl ? (
                    <Image
                      source={{ uri: `${UPLOAD_BASE_URL}${selectedBill.billImageUrl}` }}
                      style={styles.billImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.noImgWrap}>
                      <Ionicons name="image-outline" size={30} color={COLORS.textMuted} />
                      <Text style={styles.noImgText}>Image not available</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.sectionHeader}>Extracted OCR Data</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Invoice Number</Text>
                  <TextInput
                    style={styles.input}
                    value={invoiceNumber}
                    onChangeText={setInvoiceNumber}
                    placeholder="Enter Invoice Number"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Purchase Date (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={purchaseDate}
                    onChangeText={setPurchaseDate}
                    placeholder="e.g. 2024-05-12"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Customer Name</Text>
                  <TextInput
                    style={styles.input}
                    value={customerName}
                    onChangeText={setCustomerName}
                    placeholder="Name on Bill"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Total Amount (₹)</Text>
                  <TextInput
                    style={styles.input}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    placeholder="e.g. 45000"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="numeric"
                  />
                </View>

                {/* RAW OCR TEXT FOR ADMIN DEBUG */}
                <View style={styles.rawOcrBox}>
                  <Text style={styles.rawOcrTitle}>Raw Tesseract OCR Log</Text>
                  <Text style={styles.rawOcrText}>
                    {selectedBill.rawOcrText || 'No raw OCR data stored for this receipt.'}
                  </Text>
                </View>

                {/* ACTIONS */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => handleVerifyAction('VERIFIED')}
                    disabled={updating}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleVerifyAction('REJECTED')}
                    disabled={updating}
                  >
                    <Ionicons name="close-circle" size={18} color={COLORS.white} />
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  
  emptyBox: { 
    backgroundColor: COLORS.card, padding: 32, borderRadius: RADIUS.lg, 
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
    marginTop: 20, gap: 12,
  },
  emptyIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primaryGhost, alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { ...TYPOGRAPHY.heading3, color: COLORS.text },
  emptyText: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center' },
  
  billStrip: { marginBottom: 16 },
  billChip: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    width: 140,
  },
  billChipActive: { borderColor: COLORS.primaryLight, backgroundColor: COLORS.primaryGhost },
  chipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 8 },
  chipTextActive: { color: COLORS.primary },
  
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  
  imageBox: {
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  billImage: { width: '100%', height: '100%' },
  noImgWrap: { alignItems: 'center', gap: 8 },
  noImgText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  
  sectionHeader: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  
  rawOcrBox: { 
    backgroundColor: COLORS.inputBg, borderRadius: RADIUS.md, padding: 14, 
    borderWidth: 1, borderColor: COLORS.inputBorder, marginVertical: 10,
  },
  rawOcrTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, marginBottom: 6 },
  rawOcrText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: 'monospace', lineHeight: 16 },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  btn: { 
    flex: 1, paddingVertical: 16, borderRadius: RADIUS.md, 
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6,
    ...SHADOWS.small,
  },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.danger },
  btnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
});

export default AdminBillVerificationScreen;

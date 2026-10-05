import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient, { UPLOAD_BASE_URL } from '../../api/apiClient';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';

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

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bills');
      const data = res.data || [];
      setBills(data);
      if (data.length > 0) {
        selectBillForEdit(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectBillForEdit = (bill) => {
    setSelectedBill(bill);
    const parsed = bill.parsedOcrData || {};
    setInvoiceNumber(parsed.invoiceNumber || '');
    setPurchaseDate(parsed.purchaseDate || '');
    setCustomerName(parsed.customerName || bill.userId?.name || '');
    setTotalAmount(parsed.totalAmount ? String(parsed.totalAmount) : '');
    setRejectionReason(bill.rejectionReason || '');
  };

  const handleVerifyAction = async (newStatus) => {
    if (!selectedBill) return;

    try {
      setUpdating(true);

      const payload = {
        verificationStatus: newStatus,
        rejectionReason,
        parsedOcrData: {
          invoiceNumber,
          purchaseDate,
          customerName,
          totalAmount,
        },
      };

      await apiClient.put(`/bills/${selectedBill._id}/verify`, payload);
      setUpdating(false);

      alert(`Bill verification status updated to ${newStatus}`);
      fetchBills();
    } catch (error) {
      setUpdating(false);
      alert('Error updating bill verification: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Bill Verification Screen" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Admin Bill Review & OCR Verification</Text>
        <Text style={styles.subtitle}>
          Compare uploaded receipt image with OCR text & approve/reject warranty claims
        </Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 30 }} />
        ) : bills.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No pending bill uploaded receipts to review.</Text>
          </View>
        ) : (
          <>
            {/* BILL SELECTION HORIZONTAL STRIP */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.billStrip}>
              {bills.map((b) => (
                <TouchableOpacity
                  key={b._id}
                  style={[
                    styles.billChip,
                    selectedBill?._id === b._id && styles.billChipActive,
                  ]}
                  onPress={() => selectBillForEdit(b)}
                >
                  <Text style={styles.chipText}>Bill #{b._id.substring(0, 6)}</Text>
                  <StatusBadge status={b.verificationStatus} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedBill ? (
              <View style={styles.reviewCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Bill Image & OCR Data</Text>
                  <StatusBadge status={selectedBill.verificationStatus} />
                </View>

                {/* UPLOADED BILL IMAGE PREVIEW */}
                <View style={styles.imageBox}>
                  {selectedBill.imagePath ? (
                    <Image
                      source={{ uri: `${UPLOAD_BASE_URL}${selectedBill.imagePath}` }}
                      style={styles.billImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.noImgText}>📄 Sample Bill Receipt</Text>
                  )}
                </View>

                {/* EDITABLE OCR FIELDS */}
                <Text style={styles.sectionHeader}>Editable OCR Parsed Data:</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Invoice Number:</Text>
                  <TextInput
                    style={styles.input}
                    value={invoiceNumber}
                    onChangeText={setInvoiceNumber}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Purchase Date (YYYY-MM-DD):</Text>
                  <TextInput
                    style={styles.input}
                    value={purchaseDate}
                    onChangeText={setPurchaseDate}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Customer Name:</Text>
                  <TextInput
                    style={styles.input}
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Total Amount (₹):</Text>
                  <TextInput
                    style={styles.input}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                  />
                </View>

                {/* RAW OCR TEXT */}
                <View style={styles.rawOcrBox}>
                  <Text style={styles.rawOcrTitle}>Raw Tesseract OCR Text:</Text>
                  <Text style={styles.rawOcrText}>
                    {selectedBill.rawOcrText || 'No raw OCR text parsed yet.'}
                  </Text>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={() => handleVerifyAction('VERIFIED')}
                    disabled={updating}
                  >
                    <Text style={styles.btnText}>✓ APPROVE WARRANTY</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={() => handleVerifyAction('REJECTED')}
                    disabled={updating}
                  >
                    <Text style={styles.btnText}>✕ REJECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  emptyBox: { backgroundColor: COLORS.card, padding: 20, borderRadius: 12, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted },
  billStrip: { marginBottom: 14 },
  billChip: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  billChipActive: { borderColor: COLORS.primary, backgroundColor: '#1E293B' },
  chipText: { fontSize: 12, color: COLORS.white, fontWeight: '700', marginBottom: 4 },
  reviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  imageBox: {
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  billImage: { width: '100%', height: '100%' },
  noImgText: { color: COLORS.textMuted, fontSize: 13 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: COLORS.primaryLight, marginBottom: 10 },
  inputGroup: { marginBottom: 10 },
  label: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 13,
  },
  rawOcrBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginVertical: 10 },
  rawOcrTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  rawOcrText: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, fontFamily: 'monospace' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btn: { flex: 0.48, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  approveBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: COLORS.danger },
  btnText: { color: COLORS.white, fontSize: 13, fontWeight: '900' },
});

export default AdminBillVerificationScreen;

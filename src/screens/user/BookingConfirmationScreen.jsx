import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import PriceBreakdownCard from '../../components/PriceBreakdownCard';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
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
    finalAmount,
    provider,
    selectedDate,
    selectedSlot,
  } = route.params;

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        companyId: company ? company._id : null,
        providerId: provider ? provider._id : null,
        productId: product ? product._id : null,
        categoryId,
        serviceProblemId: problem ? problem._id : categoryId,
        billId: bill ? bill._id : null,
        warrantyStatus: warrantyData?.warrantyStatus || 'NONE',
        serviceType,
        selectedDate,
        selectedSlot,
        notes,
        userAddress: user?.address || '42 Anna Nagar, Chennai',
        userCity: user?.city || 'Chennai',
        userPincode: user?.pincode || '600040',
      };

      const res = await apiClient.post('/bookings', payload);
      setLoading(false);

      const bookingId = res.data.booking._id;

      // Navigate to MyBookingsScreen or BookingDetails
      navigation.navigate('MyBookings', {
        newBookingId: bookingId,
      });
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Failed to create booking. Please try again.';
      setErrorMsg(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Confirm Booking" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 11: Final Booking Confirmation</Text>
        <Text style={styles.subtitle}>
          Verify all details before confirming your service slot
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* BOOKING DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Summary</Text>

          <View style={styles.row}>
            <Text style={styles.key}>Appliance:</Text>
            <Text style={styles.val}>{categoryName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Selected Problem:</Text>
            <Text style={styles.val}>{problem?.problemName || 'General Service'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Service Provider / Store:</Text>
            <Text style={styles.val}>
              {serviceType === 'LOCAL_SERVICE' ? provider?.name : company?.companyName || 'Sathya Store'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Service Type:</Text>
            <Text style={styles.val}>{serviceType.replace(/_/g, ' ')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Scheduled Date:</Text>
            <Text style={styles.val}>{selectedDate}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>Time Slot:</Text>
            <Text style={styles.val}>{selectedSlot} Slot</Text>
          </View>
        </View>

        {/* PRICE BREAKDOWN CARD */}
        <PriceBreakdownCard
          baseServiceCharge={serviceCharge}
          warrantyDiscount={warrantyDiscount}
          labourCharge={labourCharge}
          finalAmount={finalAmount}
          isWarrantyActive={serviceType === 'COMPANY_WARRANTY'}
        />

        {/* NOTES INPUT */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Specific Notes / Address Details (Optional):</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Ring bell on 2nd floor, call before coming..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Service Booking Now ✓</Text>
          )}
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
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: COLORS.dangerBg,
    padding: 8,
    borderRadius: 8,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.white, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A',
  },
  key: { fontSize: 13, color: COLORS.textSecondary },
  val: { fontSize: 13, color: COLORS.white, fontWeight: '700' },
  inputGroup: { marginVertical: 10 },
  inputLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  notesInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    color: COLORS.text,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  confirmBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 14,
  },
  confirmBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
});

export default BookingConfirmationScreen;

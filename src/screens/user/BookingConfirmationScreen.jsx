import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const {
    categoryId, product, problem, company, providerType, provider,
    serviceType, slot, totalAmount, billImage, billScanResult
  } = route.params;

  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState(user?.address || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [loading, setLoading] = useState(false);

  const confirmBooking = async () => {
    if (!address || !mobile) {
      alert('Please provide complete address and mobile number');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        userId: user?._id,
        categoryId: categoryId,
        productId: product?._id,
        serviceProblemId: problem?._id, 
        companyId: company?._id,
        providerId: provider?._id || undefined,
        serviceType, 
        selectedDate: slot.date, 
        selectedSlot: slot.type, 
        userAddress: address, 
        userCity: user?.city || 'Unknown',
        userPincode: user?.pincode || '000000',
        notes: 'Mobile: ' + mobile, 
        warrantyStatus: billScanResult?.status === 'VALID' ? 'ACTIVE' : 'NONE', // Tell backend to apply discount
      };

      const res = await apiClient.post('/bookings', payload);
      setLoading(false);

      navigation.reset({
        index: 1,
        routes: [
          { name: 'UserMain' },
          { name: 'BookingDetails', params: { bookingId: res.data._id } },
        ],
      });
    } catch (e) {
      setLoading(false);
      console.error(e);
      alert('Failed to confirm booking: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Final Details" showBack onBack={() => navigation.goBack()} />

      <KeyboardAwareScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        enableOnAndroid={true}
        extraScrollHeight={20}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerArea}>
          <Text style={styles.title}>Step 9: Confirm Location</Text>
          <Text style={styles.subtitle}>Where should the technician arrive?</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Service Address *</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="House/Flat No, Street, Landmark..."
              placeholderTextColor={COLORS.textMuted}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={styles.label}>Contact Mobile *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor={COLORS.textMuted}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Ionicons name="construct-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.summaryText}>{product.brand} - {problem.problemName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.summaryText}>{slot.date} ({slot.type})</Text>
          </View>
          <View style={styles.summaryRow}>
            <Ionicons name="person-circle-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.summaryText}>{providerType === 'LOCAL' ? provider.name : company.companyName}</Text>
          </View>
        </View>

      </KeyboardAwareScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={confirmBooking} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>Finalize & Book Now</Text>
              <Ionicons name="paper-plane" size={18} color={COLORS.white} />
            </>
          )}
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
  inputGroup: { marginBottom: 16 },
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

  summaryBox: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  summaryText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    paddingTop: 16, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
    ...SHADOWS.medium,
  },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md,
  },
  confirmBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default BookingConfirmationScreen;

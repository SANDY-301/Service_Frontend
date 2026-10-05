import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import Header from '../../components/Header';
import apiClient from '../../api/apiClient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DateSlotSelectionScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company, billImage, billScanResult, providerType, provider } = route.params;
  const [slotData, setSlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlotType, setSelectedSlotType] = useState(''); // 'MORNING' or 'EVENING'
  
  // Date selection state
  const [dates, setDates] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  
  const insets = useSafeAreaInsets();

  useEffect(() => {
    generateDates();
  }, []);

  useEffect(() => {
    if (selectedDateStr) {
      fetchSlots(selectedDateStr);
    }
  }, [selectedDateStr]);

  const generateDates = () => {
    const arr = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
      });
    }
    setDates(arr);
    setSelectedDateStr(arr[0].fullDate);
  };

  const fetchSlots = async (dateString) => {
    try {
      setLoading(true);
      const targetId = providerType === 'LOCAL' ? provider?._id : company?._id;
      const targetType = providerType === 'LOCAL' ? 'PROVIDER' : 'COMPANY';

      const res = await apiClient.get(`/slots?targetId=${targetId}&targetType=${targetType}&date=${dateString}`);
      setSlotData(res.data);
      
      // Auto-select first available
      if (res.data?.morning?.available) {
        setSelectedSlotType('MORNING');
      } else if (res.data?.evening?.available) {
        setSelectedSlotType('EVENING');
      } else {
        setSelectedSlotType('');
      }
    } catch (e) {
      console.error(e);
      setSlotData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedSlotType) return alert('Please select an available time slot.');

    let baseCharge = 0, labourCharge = 0;
    
    if (providerType === 'LOCAL' && provider) {
      const matchedService = provider.offeredServices?.find(
        (s) => s.problemId?._id === problem?._id || s.problemId === problem?._id
      ) || provider.offeredServices?.[0] || { serviceCharge: 400, labourCharge: 200 };
      baseCharge = matchedService.serviceCharge;
      labourCharge = matchedService.labourCharge;
    } else {
      baseCharge = product.companyServiceCharge || 500;
      labourCharge = product.labourCharge || 300;
    }

    const backendServiceType = providerType === 'LOCAL' 
      ? 'LOCAL_SERVICE' 
      : (billScanResult?.status === 'VALID' ? 'COMPANY_WARRANTY' : 'COMPANY_PAID');

    navigation.navigate('PriceBreakdown', {
      categoryId, categoryName, product, problem, company, billImage, billScanResult, providerType, provider,
      serviceType: backendServiceType,
      slot: { type: selectedSlotType, date: selectedDateStr },
      serviceCharge: baseCharge,
      labourCharge: labourCharge,
      warrantyDiscount: (providerType !== 'LOCAL' && billScanResult?.status === 'VALID') ? labourCharge : 0,
    });
  };

  const renderSlotOption = (type, data, title, iconName, iconColor) => {
    if (!data) return null;
    
    const isActive = selectedSlotType === type;
    const isAvailable = data.available;
    const spotsLeft = data.capacity - data.booked;
    
    // Status text logic
    let statusText = 'Fully Booked';
    let statusColor = COLORS.danger;
    if (isAvailable) {
      if (spotsLeft <= 2) {
        statusText = 'Filling Fast';
        statusColor = COLORS.warning;
      } else {
        statusText = 'Available';
        statusColor = COLORS.success;
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.slotOption,
          isActive && styles.slotOptionActive,
          !isAvailable && { opacity: 0.6 }
        ]}
        onPress={() => isAvailable && setSelectedSlotType(type)}
        activeOpacity={0.9}
        disabled={!isAvailable}
      >
        <View style={[styles.slotIconWrap, isActive && { backgroundColor: COLORS.primaryLight }]}>
          <Ionicons name={iconName} size={22} color={isActive ? COLORS.white : iconColor} />
        </View>

        <View style={styles.slotDetails}>
          <Text style={[styles.slotTitle, isActive && { color: COLORS.primary }]}>{title}</Text>
          <Text style={styles.slotTimeText}>{data.time}</Text>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            {isAvailable && <Text style={styles.spotsLeftText}> • {spotsLeft} spots</Text>}
          </View>
        </View>

        <View style={[styles.radioCircle, isActive && styles.radioCircleActive]}>
          {isActive && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Schedule Visit" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Step 7: Schedule Technician</Text>
        <Text style={styles.subtitle}>Select your preferred date and time slot for the visit.</Text>

        {/* DATE PICKER */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Available Dates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScroll}>
            {dates.map((d) => {
              const isActive = selectedDateStr === d.fullDate;
              return (
                <TouchableOpacity
                  key={d.fullDate}
                  style={[styles.dateBox, isActive && styles.dateBoxActive]}
                  onPress={() => setSelectedDateStr(d.fullDate)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayName, isActive && styles.textActive]}>{d.dayName}</Text>
                  <Text style={[styles.dateNum, isActive && styles.textActive]}>{d.dateNum}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* TIME SLOTS */}
        <Text style={styles.sectionTitle}>Select Arrival Window</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryLight} style={{ marginVertical: 40 }} size="large" />
        ) : !slotData ? (
          <View style={styles.errorBox}>
            <Text style={{ color: COLORS.textSecondary }}>Could not load slots for this date.</Text>
          </View>
        ) : (
          <View style={styles.slotList}>
            {renderSlotOption('MORNING', slotData.morning, 'Morning Slot', 'partly-sunny', '#F59E0B')}
            {renderSlotOption('EVENING', slotData.evening, 'Evening Slot', 'moon', '#6366F1')}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity 
          style={[styles.nextBtn, !selectedSlotType && { backgroundColor: COLORS.divider }]} 
          onPress={handleNext} 
          activeOpacity={0.85}
          disabled={!selectedSlotType}
        >
          <Text style={[styles.nextBtnText, !selectedSlotType && { color: COLORS.textMuted }]}>
            {selectedSlotType ? 'Continue to Price Breakdown' : 'Select a time slot'}
          </Text>
          {selectedSlotType && <Ionicons name="arrow-forward" size={18} color={COLORS.white} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16 },
  title: { ...TYPOGRAPHY.heading2, color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 20 },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },

  dateSection: { marginBottom: 28 },
  dateScroll: { paddingBottom: 4 },
  dateBox: {
    width: 65, height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  dateBoxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.medium },
  dayName: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4, textTransform: 'uppercase' },
  dateNum: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  textActive: { color: COLORS.white },

  slotList: { gap: 14 },
  slotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  slotOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGhost,
    borderWidth: 1.5,
    elevation: 0,
    shadowOpacity: 0, // Flatten the shadow on active for a crisp embedded look
  },
  
  slotIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  slotDetails: { flex: 1 },
  slotTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  slotTimeText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500', marginBottom: 8 },
  
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  spotsLeftText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },

  radioCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: COLORS.divider,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  radioCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },

  errorBox: { padding: 20, alignItems: 'center' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    paddingTop: 16, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
    ...SHADOWS.medium,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md,
  },
  nextBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default DateSlotSelectionScreen;

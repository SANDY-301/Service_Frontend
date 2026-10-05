import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';

const AdminSlotsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayStr());
  const [morningCapacity, setMorningCapacity] = useState('5');
  const [eveningCapacity, setEveningCapacity] = useState('5');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!date) {
      Alert.alert('Missing Date', 'Please enter a valid date in YYYY-MM-DD format.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        targetId: user?.companyId || user?._id,
        targetType: 'COMPANY',
        date,
        morningMaxCapacity: Number(morningCapacity) || 5,
        eveningMaxCapacity: Number(eveningCapacity) || 5,
      };
      await apiClient.post('/slots/configure', payload);
      setLoading(false);
      Alert.alert('Saved', `Slot configuration for ${date} has been saved.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', 'Could not save slot configuration. Please try again.');
    }
  };

  const SlotCard = ({ icon, title, time, value, onChange, color }) => (
    <View style={[styles.slotCard, { borderColor: color + '40' }]}>
      <View style={styles.slotCardHeader}>
        <View style={[styles.slotIconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View>
          <Text style={[styles.slotTitle, { color }]}>{title}</Text>
          <Text style={styles.slotTime}>{time}</Text>
        </View>
      </View>

      <Text style={styles.inputLabel}>Max Bookings Allowed</Text>
      <View style={styles.capacityRow}>
        <TouchableOpacity
          style={styles.countBtn}
          onPress={() => onChange(String(Math.max(1, Number(value) - 1)))}
        >
          <Ionicons name="remove" size={18} color={COLORS.text} />
        </TouchableOpacity>
        <TextInput
          style={styles.capacityInput}
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity
          style={styles.countBtn}
          onPress={() => onChange(String(Number(value) + 1))}
        >
          <Ionicons name="add" size={18} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Slot Configuration" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Slot Limits</Text>
        <Text style={styles.subtitle}>Control the maximum bookings allowed per time slot to prevent scheduling conflicts</Text>

        {/* DATE INPUT */}
        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} /> Target Date
          </Text>
          <TextInput
            style={styles.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.dateHint}>Format: YYYY-MM-DD (e.g. {getTodayStr()})</Text>
        </View>

        <SlotCard
          icon="sunny-outline"
          title="Morning Slot"
          time="09:00 AM – 01:00 PM"
          color={COLORS.warningLight}
          value={morningCapacity}
          onChange={setMorningCapacity}
        />

        <SlotCard
          icon="moon-outline"
          title="Evening Slot"
          time="02:00 PM – 06:00 PM"
          color={COLORS.infoLight}
          value={eveningCapacity}
          onChange={setEveningCapacity}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Save Slot Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 16, paddingBottom: 30 },

  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, marginBottom: 20, lineHeight: 18 },

  dateCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 14,
  },
  dateLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, letterSpacing: 0.3 },
  dateInput: {
    backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.inputBorder,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, color: COLORS.text, fontSize: 15, fontWeight: '600',
  },
  dateHint: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },

  slotCard: {
    backgroundColor: COLORS.card, borderRadius: 16, padding: 16,
    borderWidth: 1.5, marginBottom: 14,
  },
  slotCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  slotIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  slotTitle: { fontSize: 15, fontWeight: '800' },
  slotTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },

  inputLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  capacityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  countBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  capacityInput: {
    flex: 1, backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.inputBorder,
    borderRadius: 10, textAlign: 'center', color: COLORS.text, fontSize: 18, fontWeight: '800', paddingVertical: 8,
  },

  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 8,
  },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});

export default AdminSlotsScreen;

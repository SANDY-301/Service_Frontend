import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';

const ROLES = [
  { key: 'USER',     label: 'Customer',      icon: 'account-outline',  color: COLORS.primaryLight },
  { key: 'ADMIN',    label: 'Store Admin',   icon: 'store-outline',    color: COLORS.warningLight },
  { key: 'PROVIDER', label: 'Technician',    icon: 'wrench-outline',   color: COLORS.successLight },
];

const RegisterScreen = ({ navigation }) => {
  const [role, setRole] = useState('USER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      setErrorMsg('Name, Email, Mobile and Password are required');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await register({
      name: name.trim(), email: email.trim(), mobile: mobile.trim(),
      password, role, address, city, pincode,
      companyName, ownerName, serviceArea,
      experienceYears: Number(experienceYears) || 1,
    });
    setLoading(false);
    if (!res.success) setErrorMsg(res.error);
  };

  const selectedRole = ROLES.find((r) => r.key === role);

  const Field = ({ label, value, onChange, placeholder, keyboard, secure, showToggle, toggleVisible, onToggle, icon }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon ? <Ionicons name={icon} size={16} color={COLORS.textMuted} style={styles.inputIcon} /> : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard || 'default'}
          autoCapitalize="none"
          secureTextEntry={secure && !toggleVisible}
        />
        {showToggle ? (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Ionicons name={toggleVisible ? 'eye-outline' : 'eye-off-outline'} size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.logoWrap}>
          <MaterialCommunityIcons name="account-plus-outline" size={30} color={COLORS.primaryLight} />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>
      </View>

      <View style={styles.card}>

        {/* ROLE SELECTOR */}
        <Text style={styles.sectionLabel}>Select Your Role</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[styles.roleChip, role === r.key && { borderColor: r.color, backgroundColor: r.color + '18' }]}
              onPress={() => setRole(r.key)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name={r.icon} size={18} color={role === r.key ? r.color : COLORS.textMuted} />
              <Text style={[styles.roleChipText, role === r.key && { color: r.color }]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={14} color={COLORS.dangerLight} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>Personal Details</Text>

        <Field label="Full Name *" value={name} onChange={setName} placeholder="Your full name" icon="person-outline" />
        <Field label="Email Address *" value={email} onChange={setEmail} placeholder="Email address" keyboard="email-address" icon="mail-outline" />
        <Field label="Mobile Number *" value={mobile} onChange={setMobile} placeholder="10-digit mobile number" keyboard="phone-pad" icon="call-outline" />
        <Field
          label="Password *" value={password} onChange={setPassword}
          placeholder="Create a strong password" secure icon="lock-closed-outline"
          showToggle toggleVisible={showPass} onToggle={() => setShowPass(!showPass)}
        />

        {/* ROLE SPECIFIC */}
        {role === 'ADMIN' && (
          <View style={styles.roleSection}>
            <View style={styles.roleSectionHeader}>
              <MaterialCommunityIcons name="store-outline" size={15} color={COLORS.warningLight} />
              <Text style={[styles.sectionLabel, { color: COLORS.warningLight, marginBottom: 0 }]}>Store Details</Text>
            </View>
            <Field label="Store / Company Name" value={companyName} onChange={setCompanyName} placeholder="Your store name" icon="business-outline" />
            <Field label="Owner / Manager Name" value={ownerName} onChange={setOwnerName} placeholder="Owner or manager name" icon="person-circle-outline" />
          </View>
        )}

        {role === 'PROVIDER' && (
          <View style={styles.roleSection}>
            <View style={styles.roleSectionHeader}>
              <MaterialCommunityIcons name="wrench-outline" size={15} color={COLORS.successLight} />
              <Text style={[styles.sectionLabel, { color: COLORS.successLight, marginBottom: 0 }]}>Technician Details</Text>
            </View>
            <Field label="Service Area / District" value={serviceArea} onChange={setServiceArea} placeholder="Area or district you cover" icon="location-outline" />
            <Field label="Experience (Years)" value={experienceYears} onChange={setExperienceYears} placeholder="Years of experience" keyboard="numeric" icon="time-outline" />
          </View>
        )}

        <Text style={styles.sectionLabel}>Location (Optional)</Text>
        <Field label="Address" value={address} onChange={setAddress} placeholder="Street address" icon="home-outline" />
        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Field label="City" value={city} onChange={setCity} placeholder="City" icon="business-outline" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Pincode" value={pincode} onChange={setPincode} placeholder="Pincode" keyboard="numeric" icon="location-outline" />
          </View>
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.registerBtnText}>Create Account</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Already registered? </Text>
          <Text style={[styles.loginLinkText, { color: COLORS.primaryLight, fontWeight: '700' }]}>Sign In →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryGhost,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 6,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingVertical: 10,
    gap: 4,
    backgroundColor: COLORS.surface,
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.dangerLight,
    fontSize: 12,
    flex: 1,
  },
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 11,
  },
  eyeBtn: { padding: 4 },
  roleSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 14,
    marginBottom: 14,
  },
  roleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  registerBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginLinkText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

export default RegisterScreen;

import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.success) setErrorMsg(res.error);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* BRAND HEADER */}
        <View style={styles.brandSection}>
          <View style={styles.logoWrap}>
            <MaterialCommunityIcons name="home-modern" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Homecare Service Hub</Text>
          <Text style={styles.appTagline}>Authorized Appliance Repairs & Warranty</Text>
        </View>

        {/* LOGIN CARD */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Sign In</Text>
          <Text style={styles.cardSub}>Use your registered credentials to continue</Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={17} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={17} color={COLORS.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={17} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>New here?</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add-outline" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.registerBtnText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        {/* ROLE HINTS */}
        <View style={styles.roleHints}>
          {[
            { icon: 'account-outline', label: 'Customer', color: COLORS.primary },
            { icon: 'store-outline', label: 'Store Admin', color: COLORS.warning },
            { icon: 'wrench-outline', label: 'Technician', color: COLORS.success },
          ].map((r) => (
            <View key={r.label} style={styles.roleHintChip}>
              <MaterialCommunityIcons name={r.icon} size={16} color={r.color} />
              <Text style={[styles.roleHintText, { color: r.color }]}>{r.label}</Text>
            </View>
          ))}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 20,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryGhost,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight + '50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  appTagline: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 20,
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
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11,
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
    paddingVertical: 12,
  },
  eyeBtn: { padding: 4 },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: COLORS.cardBorder },
  dividerText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '50',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.primaryGhost,
  },
  registerBtnText: {
    color: COLORS.primaryLight,
    fontSize: 14,
    fontWeight: '700',
  },
  roleHints: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
  },
  roleHintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  roleHintText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default LoginScreen;

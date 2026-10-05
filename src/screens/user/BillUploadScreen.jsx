import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS, TYPOGRAPHY } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BillUploadScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const insets = useSafeAreaInsets();

  const pickImage = async (useCamera = false) => {
    try {
      setErrorMsg('');
      let result;

      if (useCamera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          setErrorMsg('Camera permission is required to snap bill photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to select bill image');
    }
  };

  const handleUploadAndOCR = async () => {
    if (!selectedImage) {
      setErrorMsg('Please select or snap a purchase bill image first.');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');
      setOcrStatusText('Connecting to OCR Engine...');

      const formData = new FormData();
      formData.append('billImage', {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: 'bill_upload.jpg',
      });
      formData.append('productId', product._id || '');

      setOcrStatusText('Scanning Document Data...');
      const res = await apiClient.post('/ocr/scan-bill', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploading(false);
      
      // Navigate to Review screen
      navigation.navigate('BillReview', {
        categoryId, categoryName, product, problem, company,
        billImage: selectedImage,
        ocrData: res.data.data,
      });

    } catch (e) {
      setUploading(false);
      console.error('OCR Error:', e);
      setErrorMsg(e.response?.data?.message || 'Failed to scan bill. Please try another image.');
    }
  };

  const skipUpload = () => {
    // Treat as OUT_OF_WARRANTY
    navigation.navigate('WarrantyResult', {
      categoryId, categoryName, product, problem, company,
      billImage: null,
      billScanResult: {
        status: 'OUT_OF_WARRANTY',
        message: 'No purchase bill provided. Warranty cannot be claimed.',
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Warranty Verification" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Text style={styles.title}>Step 4: Upload Purchase Bill</Text>
          <Text style={styles.subtitle}>Our AI will scan your bill to instantly verify warranty status for {product.brand}.</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={20} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {selectedImage ? (
          <View style={styles.imagePreviewWrap}>
            <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.repickBtn} onPress={() => pickImage(false)} activeOpacity={0.8}>
              <Ionicons name="refresh" size={16} color={COLORS.primary} />
              <Text style={styles.repickText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={32} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.uploadTitle}>No Document Selected</Text>
            <Text style={styles.uploadSub}>Please ensure the purchase date and model number are clearly visible.</Text>
            
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(true)} activeOpacity={0.8}>
                <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
                <Text style={styles.actionBtnText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => pickImage(false)} activeOpacity={0.8}>
                <Ionicons name="image-outline" size={20} color={COLORS.primary} />
                <Text style={styles.actionBtnText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Warranty benefits (like free spare parts) can only be claimed if you upload a valid, readable purchase invoice.
          </Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        {!selectedImage ? (
          <TouchableOpacity style={styles.skipBtn} onPress={skipUpload} activeOpacity={0.85}>
            <Text style={styles.skipBtnText}>Skip without Warranty (Proceed as Paid)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.scanBtn} onPress={handleUploadAndOCR} disabled={uploading} activeOpacity={0.85}>
            {uploading ? (
              <View style={styles.scanBtnContent}>
                <ActivityIndicator color={COLORS.white} size="small" />
                <Text style={styles.scanBtnText}>{ocrStatusText || 'Processing...'}</Text>
              </View>
            ) : (
              <View style={styles.scanBtnContent}>
                <Ionicons name="scan-outline" size={20} color={COLORS.white} />
                <Text style={styles.scanBtnText}>Verify via AI Scan</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
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

  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.danger + '1A', padding: 12, borderRadius: RADIUS.md, marginBottom: 16 },
  errorText: { color: COLORS.danger, fontSize: 13, marginLeft: 8, flex: 1, fontWeight: '500' },

  uploadCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    marginBottom: 20,
    ...SHADOWS.small,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primaryGhost,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  uploadSub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 18, paddingHorizontal: 10, marginBottom: 20 },

  btnRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.text },

  imagePreviewWrap: { marginBottom: 20, position: 'relative' },
  imagePreview: { width: '100%', height: 350, borderRadius: RADIUS.lg, resizeMode: 'cover', borderWidth: 1, borderColor: COLORS.cardBorder },
  repickBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    ...SHADOWS.small,
  },
  repickText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

  infoBox: { flexDirection: 'row', backgroundColor: COLORS.info + '1A', padding: 16, borderRadius: RADIUS.md },
  infoText: { flex: 1, fontSize: 12, color: COLORS.info, marginLeft: 12, lineHeight: 18, fontWeight: '500' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.card,
    paddingTop: 16, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: COLORS.cardBorder,
    ...SHADOWS.medium,
  },
  skipBtn: {
    backgroundColor: COLORS.surface, paddingVertical: 16, borderRadius: RADIUS.md,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  skipBtnText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '700' },

  scanBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: RADIUS.md,
    alignItems: 'center', ...SHADOWS.small,
  },
  scanBtnContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scanBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default BillUploadScreen;

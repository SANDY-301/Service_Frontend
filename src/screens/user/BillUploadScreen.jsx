import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../theme/theme';
import apiClient from '../../api/apiClient';
import Header from '../../components/Header';

const BillUploadScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, product, problem, company } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        result = await ImagePicker.launchCameraAsync({
          quality: 0.8,
        });
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
      setErrorMsg('Please select or snap a purchase bill image first');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');
      setOcrStatusText('Uploading bill image locally & running Tesseract OCR...');

      const formData = new FormData();
      const filename = selectedImage.uri.split('/').pop() || 'bill.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('billImage', {
        uri: selectedImage.uri,
        name: filename,
        type,
      });

      if (company && company._id) {
        formData.append('companyId', company._id);
      }

      const res = await apiClient.post('/bills/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { bill } = res.data;

      setUploading(false);

      // Navigate to BillReviewScreen with extracted OCR data
      navigation.navigate('BillReview', {
        categoryId,
        categoryName,
        product,
        problem,
        company,
        bill,
      });
    } catch (error) {
      setUploading(false);
      const msg = error.response?.data?.message || 'Error uploading bill image';
      setErrorMsg(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Upload Purchase Bill" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 5: Upload Purchase Receipt / Bill</Text>
        <Text style={styles.subtitle}>
          Free Tesseract OCR will extract invoice number, purchase date, model & total amount
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* IMAGE PREVIEW AREA */}
        <View style={styles.previewBox}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.billIcon}>📄</Text>
              <Text style={styles.placeholderText}>No bill image selected yet</Text>
              <Text style={styles.placeholderSub}>Supports JPG, JPEG, PNG receipts</Text>
            </View>
          )}
        </View>

        {/* IMAGE PICKER BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.pickBtn} onPress={() => pickImage(false)}>
            <Text style={styles.pickBtnText}>🖼️ Choose Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickBtn} onPress={() => pickImage(true)}>
            <Text style={styles.pickBtnText}>📷 Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* PROCESS BUTTON */}
        <TouchableOpacity
          style={[styles.processBtn, (!selectedImage || uploading) && styles.disabledBtn]}
          onPress={handleUploadAndOCR}
          disabled={!selectedImage || uploading}
        >
          {uploading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.processBtnText}>{ocrStatusText}</Text>
            </View>
          ) : (
            <Text style={styles.processBtnText}>⚡ Upload & Process OCR</Text>
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
  previewBox: {
    height: 220,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  previewImage: { width: '100%', height: '100%' },
  placeholderBox: { alignItems: 'center' },
  billIcon: { fontSize: 44, marginBottom: 8 },
  placeholderText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  placeholderSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  pickBtn: {
    flex: 0.48,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pickBtnText: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  processBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#334155' },
  processBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
});

export default BillUploadScreen;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Dynamic API Base URL resolution for Web, Emulators, and Physical Devices (Expo Go)
const getBaseUrl = () => {
  // 1. Web Browser Mode
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api`;
    }
  }

  // 2. Mobile Device via Expo Go (Reads computer IP automatically)
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.tool;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:5000/api`;
    }
  }

  // 3. Default Localhost Fallback
  return 'http://127.0.0.1:5000/api';
};

export const API_BASE_URL = getBaseUrl();
export const UPLOAD_BASE_URL = API_BASE_URL.replace('/api', '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header automatically
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 interceptor — auto-clear stale tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userInfo');
      } catch (_) {}
    }
    return Promise.reject(error);
  }
);

export default apiClient;

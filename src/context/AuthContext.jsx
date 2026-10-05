import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userInfo');

      if (storedToken && storedUser) {
        // Validate token against backend — clears stale/deleted-user tokens
        try {
          const response = await apiClient.get('/auth/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          // Token is valid — use fresh user data from server
          setToken(storedToken);
          setUser(response.data);
          // Refresh stored user info with latest from DB
          await AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        } catch (validationError) {
          // Token is invalid or user no longer exists in DB → force logout
          console.warn('Stored token is invalid or user deleted. Clearing session.');
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          setToken(null);
          setUser(null);
        }
      }
    } catch (e) {
      console.error('Failed to load session from AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = response.data;

      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || (error.request ? 'Unable to reach backend server. Check connection.' : error.message) || 'Login failed.';
      return { success: false, error: msg };
    }
  };

  const register = async (registerData) => {
    try {
      const response = await apiClient.post('/auth/register', registerData);
      const { token: userToken, ...userData } = response.data;

      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || (error.request ? 'Unable to reach backend server. Ensure PC server is running.' : error.message) || 'Registration failed.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Error during logout:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        role: user ? user.role : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

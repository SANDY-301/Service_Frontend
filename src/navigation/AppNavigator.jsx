import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../theme/theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Navigators
import UserTabNavigator from './UserTabNavigator';
import ProviderTabNavigator from './ProviderTabNavigator';
import AdminTabNavigator from './AdminTabNavigator';

// User Stack Screens
import ProductSelectionScreen from '../screens/user/ProductSelectionScreen';
import ProblemSelectionScreen from '../screens/user/ProblemSelectionScreen';
import CompanySelectionScreen from '../screens/user/CompanySelectionScreen';
import BillUploadScreen from '../screens/user/BillUploadScreen';
import BillReviewScreen from '../screens/user/BillReviewScreen';
import WarrantyResultScreen from '../screens/user/WarrantyResultScreen';
import ServiceOptionsScreen from '../screens/user/ServiceOptionsScreen';
import LocalProviderListScreen from '../screens/user/LocalProviderListScreen';
import PriceBreakdownScreen from '../screens/user/PriceBreakdownScreen';
import DateSlotSelectionScreen from '../screens/user/DateSlotSelectionScreen';
import BookingConfirmationScreen from '../screens/user/BookingConfirmationScreen';
import BookingDetailsScreen from '../screens/user/BookingDetailsScreen';

// Provider Stack Screens
import ProviderExpertiseScreen from '../screens/provider/ProviderExpertiseScreen';
import ProviderBookingsScreen from '../screens/provider/ProviderBookingsScreen';

// Admin Stack Screens
import AdminAddProductScreen from '../screens/admin/AdminAddProductScreen';
import AdminBillVerificationScreen from '../screens/admin/AdminBillVerificationScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import AdminSlotsScreen from '../screens/admin/AdminSlotsScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primaryLight} />
        <Text style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 14 }}>Loading Homecare Hub...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.bg },
        }}
      >
        {!token ? (
          // Auth Flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user?.role === 'ADMIN' ? (
          // Admin Flow
          <>
            <Stack.Screen name="AdminMain" component={AdminTabNavigator} />
            <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
            <Stack.Screen name="AdminBillVerification" component={AdminBillVerificationScreen} />
            <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} />
            <Stack.Screen name="AdminSlots" component={AdminSlotsScreen} />
            <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
          </>
        ) : user?.role === 'PROVIDER' ? (
          // Provider Flow
          <>
            <Stack.Screen name="ProviderMain" component={ProviderTabNavigator} />
            <Stack.Screen name="ProviderExpertise" component={ProviderExpertiseScreen} />
            <Stack.Screen name="ProviderBookings" component={ProviderBookingsScreen} />
          </>
        ) : (
          // Customer / User Flow
          <>
            <Stack.Screen name="UserMain" component={UserTabNavigator} />
            <Stack.Screen name="ProductSelection" component={ProductSelectionScreen} />
            <Stack.Screen name="ProblemSelection" component={ProblemSelectionScreen} />
            <Stack.Screen name="CompanySelection" component={CompanySelectionScreen} />
            <Stack.Screen name="BillUpload" component={BillUploadScreen} />
            <Stack.Screen name="BillReview" component={BillReviewScreen} />
            <Stack.Screen name="WarrantyResult" component={WarrantyResultScreen} />
            <Stack.Screen name="ServiceOptions" component={ServiceOptionsScreen} />
            <Stack.Screen name="LocalProviderList" component={LocalProviderListScreen} />
            <Stack.Screen name="PriceBreakdown" component={PriceBreakdownScreen} />
            <Stack.Screen name="DateSlotSelection" component={DateSlotSelectionScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
            <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

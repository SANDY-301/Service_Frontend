import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../theme/theme';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBillVerificationScreen from '../screens/admin/AdminBillVerificationScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.warning,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🏢';
          if (route.name === 'AdminDashboard') icon = '📊';
          if (route.name === 'AdminBillVerification') icon = '🔎';
          if (route.name === 'AdminProducts') icon = '📦';
          if (route.name === 'AdminBookings') icon = '📅';
          if (route.name === 'AdminProfile') icon = '👤';
          return <Text style={{ fontSize: focused ? 20 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="AdminBillVerification" component={AdminBillVerificationScreen} options={{ title: 'Verify Bills' }} />
      <Tab.Screen name="AdminProducts" component={AdminProductsScreen} options={{ title: 'Products' }} />
      <Tab.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="AdminProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;

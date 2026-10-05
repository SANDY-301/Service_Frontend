import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBillVerificationScreen from '../screens/admin/AdminBillVerificationScreen';
import AdminProductsScreen from '../screens/admin/AdminProductsScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  AdminDashboard:        { active: 'grid',              inactive: 'grid-outline' },
  AdminBillVerification: { active: 'document-text',     inactive: 'document-text-outline' },
  AdminProducts:         { active: 'cube',              inactive: 'cube-outline' },
  AdminBookings:         { active: 'calendar',          inactive: 'calendar-outline' },
  AdminProfile:          { active: 'person',            inactive: 'person-outline' },
};

const AdminTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          height: Platform.OS === 'ios' ? 85 : 65 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10 + insets.bottom,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.warning,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
        },
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return (
            <View style={focused ? [styles.activeIconWrap, { backgroundColor: COLORS.warning + '15' }] : styles.iconWrap}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="AdminBillVerification" component={AdminBillVerificationScreen} options={{ title: 'Bills' }} />
      <Tab.Screen name="AdminProducts" component={AdminProductsScreen} options={{ title: 'Products' }} />
      <Tab.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="AdminProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  activeIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 40,
    height: 28,
  },
});

export default AdminTabNavigator;

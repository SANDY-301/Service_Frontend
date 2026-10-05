import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import ProviderBookingsScreen from '../screens/provider/ProviderBookingsScreen';
import ProviderExpertiseScreen from '../screens/provider/ProviderExpertiseScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  ProviderDashboard: { active: 'grid',          inactive: 'grid-outline' },
  ProviderBookings:  { active: 'clipboard',      inactive: 'clipboard-outline' },
  ProviderExpertise: { active: 'construct',      inactive: 'construct-outline' },
  ProviderProfile:   { active: 'person',         inactive: 'person-outline' },
};

const ProviderTabNavigator = () => {
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
        tabBarActiveTintColor: COLORS.success,
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
            <View style={focused ? [styles.activeIconWrap, { backgroundColor: COLORS.success + '15' }] : styles.iconWrap}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="ProviderDashboard" component={ProviderDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="ProviderBookings" component={ProviderBookingsScreen} options={{ title: 'Requests' }} />
      <Tab.Screen name="ProviderExpertise" component={ProviderExpertiseScreen} options={{ title: 'My Skills' }} />
      <Tab.Screen name="ProviderProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
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

export default ProviderTabNavigator;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../theme/theme';
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import ProviderBookingsScreen from '../screens/provider/ProviderBookingsScreen';
import ProviderExpertiseScreen from '../screens/provider/ProviderExpertiseScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const ProviderTabNavigator = () => {
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
        tabBarActiveTintColor: COLORS.success,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🛠️';
          if (route.name === 'ProviderDashboard') icon = '📊';
          if (route.name === 'ProviderBookings') icon = '📋';
          if (route.name === 'ProviderExpertise') icon = '🛠️';
          if (route.name === 'ProviderProfile') icon = '👤';
          return <Text style={{ fontSize: focused ? 20 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="ProviderDashboard" component={ProviderDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="ProviderBookings" component={ProviderBookingsScreen} options={{ title: 'Requests' }} />
      <Tab.Screen name="ProviderExpertise" component={ProviderExpertiseScreen} options={{ title: 'Rates' }} />
      <Tab.Screen name="ProviderProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;

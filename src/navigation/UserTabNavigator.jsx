import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../theme/theme';
import UserHomeScreen from '../screens/user/UserHomeScreen';
import ApplianceCategoriesScreen from '../screens/user/ApplianceCategoriesScreen';
import MyBookingsScreen from '../screens/user/MyBookingsScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const UserTabNavigator = () => {
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
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🏠';
          if (route.name === 'UserHome') icon = '🏠';
          if (route.name === 'ApplianceCategories') icon = '⚡';
          if (route.name === 'MyBookings') icon = '📅';
          if (route.name === 'UserProfile') icon = '👤';
          return <Text style={{ fontSize: focused ? 20 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="UserHome" component={UserHomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="ApplianceCategories" component={ApplianceCategoriesScreen} options={{ title: 'Categories' }} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default UserTabNavigator;

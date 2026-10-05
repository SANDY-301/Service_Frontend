import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';
import UserHomeScreen from '../screens/user/UserHomeScreen';
import ApplianceCategoriesScreen from '../screens/user/ApplianceCategoriesScreen';
import MyBookingsScreen from '../screens/user/MyBookingsScreen';
import UserProfileScreen from '../screens/user/UserProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  UserHome:              { active: 'home',           inactive: 'home-outline' },
  ApplianceCategories:   { active: 'grid',           inactive: 'grid-outline' },
  MyBookings:            { active: 'calendar',       inactive: 'calendar-outline' },
  UserProfile:           { active: 'person',         inactive: 'person-outline' },
};

const UserTabNavigator = () => {
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
        tabBarActiveTintColor: COLORS.primary,
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
            <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="ApplianceCategories"
        component={ApplianceCategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'Bookings' }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryGhost,
    borderRadius: 10,
    width: 40,
    height: 28,
  },
});

export default UserTabNavigator;

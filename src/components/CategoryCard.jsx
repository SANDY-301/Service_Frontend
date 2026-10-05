import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

const CATEGORY_ICON_MAP = {
  'AC':               { icon: 'air-conditioner',      color: '#22D3EE' },
  'Refrigerator':     { icon: 'fridge-outline',        color: '#60A5FA' },
  'TV':               { icon: 'television-play',       color: '#A78BFA' },
  'Washing Machine':  { icon: 'washing-machine',       color: '#34D399' },
  'Microwave Oven':   { icon: 'microwave',             color: '#FB923C' },
  'Water Heater':     { icon: 'water-thermometer-outline', color: '#F87171' },
  'Air Cooler':       { icon: 'fan',                   color: '#38BDF8' },
  'Mixer Grinder':    { icon: 'blender-outline',       color: '#FBBF24' },
  'Dishwasher':       { icon: 'dishwasher',            color: '#6EE7B7' },
  'Other Electronics':{ icon: 'devices',               color: '#C4B5FD' },
};

const CategoryCard = ({ category, onPress }) => {
  const meta = CATEGORY_ICON_MAP[category.name] || { icon: 'wrench-outline', color: COLORS.primaryLight };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconCircle, { backgroundColor: meta.color + '1A', borderColor: meta.color + '40' }]}>
        <MaterialCommunityIcons name={meta.icon} size={26} color={meta.color} />
      </View>
      <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2236',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D3A52',
    width: '30.5%',
    margin: '1.1%',
    minHeight: 90,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default CategoryCard;

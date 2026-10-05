import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, TYPOGRAPHY, RADIUS } from '../theme/theme';

const CATEGORY_ICON_MAP = {
  'AC':               { icon: 'air-conditioner',       color: '#0284C7' }, // Professional Deep Sky Blue
  'Refrigerator':     { icon: 'fridge-outline',        color: '#0891B2' }, // Cyan
  'TV':               { icon: 'television-play',       color: '#6366F1' }, // Indigo
  'Washing Machine':  { icon: 'washing-machine',       color: '#059669' }, // Emerald
  'Microwave Oven':   { icon: 'microwave',             color: '#D97706' }, // Amber
  'Water Heater':     { icon: 'water-thermometer-outline', color: '#DC2626' }, // Red
  'Air Cooler':       { icon: 'fan',                   color: '#2563EB' }, // Royal Blue
  'Mixer Grinder':    { icon: 'blender-outline',       color: '#CA8A04' }, // Yellow
  'Dishwasher':       { icon: 'dishwasher',            color: '#0D9488' }, // Teal
  'Other Electronics':{ icon: 'devices',               color: '#7C3AED' }, // Purple
};

const CategoryCard = ({ category, onPress }) => {
  const meta = CATEGORY_ICON_MAP[category.name] || { icon: 'wrench-outline', color: COLORS.primary };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: meta.color + '15' }]}>
        <MaterialCommunityIcons name={meta.icon} size={28} color={meta.color} />
      </View>
      <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    width: '30.5%',
    margin: '1.4%',
    minHeight: 100,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoryCard;

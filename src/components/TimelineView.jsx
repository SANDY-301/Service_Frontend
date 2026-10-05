import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

const STEPS = [
  { key: 'PENDING', title: 'Booking Created', desc: 'Request submitted to system' },
  { key: 'VERIFIED', title: 'Bill Verified', desc: 'OCR & Bill details reviewed' },
  { key: 'CONFIRMED', title: 'Service Confirmed', desc: 'Slot & pricing confirmed' },
  { key: 'ASSIGNED', title: 'Technician Assigned', desc: 'Assigned to service team' },
  { key: 'IN_PROGRESS', title: 'Service In Progress', desc: 'Technician on the way / servicing' },
  { key: 'COMPLETED', title: 'Service Completed', desc: 'Appliance repaired successfully' },
];

const TimelineView = ({ currentStatus }) => {
  const getStepStatus = (stepKey, index) => {
    const statusOrder = ['PENDING', 'VERIFIED', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentStatus === 'CANCELLED' || currentStatus === 'REJECTED') {
      return 'FAILED';
    }

    if (index <= currentIndex) return 'COMPLETED';
    return 'UPCOMING';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Service Progress Timeline</Text>
      {STEPS.map((step, idx) => {
        const stepState = getStepStatus(step.key, idx);
        const isLast = idx === STEPS.length - 1;

        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.circle,
                  stepState === 'COMPLETED' && styles.circleCompleted,
                  stepState === 'FAILED' && styles.circleFailed,
                ]}
              >
                <Text style={styles.circleText}>
                  {stepState === 'COMPLETED' ? '✓' : idx + 1}
                </Text>
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    stepState === 'COMPLETED' && styles.lineCompleted,
                  ]}
                />
              )}
            </View>

            <View style={styles.contentContainer}>
              <Text
                style={[
                  styles.stepTitle,
                  stepState === 'COMPLETED' && styles.stepTitleActive,
                ]}
              >
                {step.title}
              </Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  indicatorContainer: {
    alignItems: 'center',
    marginRight: 14,
    width: 24,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  circleCompleted: {
    backgroundColor: COLORS.success,
  },
  circleFailed: {
    backgroundColor: COLORS.danger,
  },
  circleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  line: {
    width: 2,
    height: 32,
    backgroundColor: '#334155',
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: COLORS.success,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stepTitleActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default TimelineView;

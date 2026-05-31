import { StyleSheet, Text, View } from 'react-native';

// Define SyncStatus inline so it works without the types folder
export type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

interface SyncBadgeProps {
  status: SyncStatus;
}

const CONFIG = {
  SYNCED:  { label: 'Saved',   bg: '#E8F5EE', text: '#1A7A4A' },
  PENDING: { label: 'Pending', bg: '#FFF8E1', text: '#F57F17' },
  FAILED:  { label: 'Failed',  bg: '#FFEBEE', text: '#C62828' },
};

export function SyncBadge({ status }: SyncBadgeProps) {
  const config = CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  text:  { fontSize: 12, fontWeight: '600' },
});
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from './Card';

export type StageStatus = 'not_started' | 'in_progress' | 'done';

interface StageCardProps {
  stageNumber: number;
  title: string;
  description: string;
  status: StageStatus;
  onPress: () => void;
}

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: '#999999' },
  in_progress: { label: 'In Progress', color: '#F57F17' },
  done:        { label: 'Done',        color: '#1A7A4A' },
};

export function StageCard({
  stageNumber,
  title,
  description,
  status,
  onPress,
}: StageCardProps) {
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card>
        <View style={styles.row}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{stageNumber}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Text style={[styles.status, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row:         { flexDirection: 'row', alignItems: 'center' },
  number:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  numberText:  { color: '#1A7A4A', fontWeight: '700', fontSize: 16 },
  content:     { flex: 1 },
  title:       { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  description: { fontSize: 13, color: '#666', marginTop: 2 },
  status:      { fontSize: 12, fontWeight: '600' },
});
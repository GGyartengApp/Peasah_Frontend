import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../Components/ui/Card';
import { StageCard, StageStatus } from '../../Components/ui/StageCard';
import { SwipeTabView } from '../../Components/ui/SwipeTabView';

const STAGES: {
  num: number;
  title: string;
  desc: string;
  status: StageStatus;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { num: 1, title: 'Land Preparation', desc: 'Ploughing, soil treatment',  status: 'done',        route: '/log/land-prep',    icon: 'terrain'     },
  { num: 2, title: 'Planting',         desc: 'Seeds, labour, fertilizer',  status: 'done',        route: '/log/planting',     icon: 'grass'       },
  { num: 3, title: 'Crop Maintenance', desc: 'Pesticides, irrigation',     status: 'in_progress', route: '/log/maintenance',  icon: 'eco'         },
  { num: 4, title: 'Harvest',          desc: 'Yield and labour',           status: 'not_started', route: '/log/harvest',      icon: 'agriculture' },
  { num: 5, title: 'Post-Harvest',     desc: 'Sales and storage',          status: 'not_started', route: '/log/post-harvest', icon: 'storefront'  },
];

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const done       = STAGES.filter(s => s.status === 'done').length;
  const inProgress = STAGES.filter(s => s.status === 'in_progress').length;
  const percent    = Math.round(((done + inProgress * 0.5) / STAGES.length) * 100);

  return (
    <SwipeTabView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.screenTitle}>Log</Text>
        <Text style={styles.screenSub}>Tap a stage to record your inputs</Text>

        {/* Progress summary card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Season Progress</Text>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
          <View style={styles.progressLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1A7A4A' }]} />
              <Text style={styles.legendText}>{done} Done</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F57F17' }]} />
              <Text style={styles.legendText}>{inProgress} In Progress</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]} />
              <Text style={styles.legendText}>{STAGES.length - done - inProgress} Remaining</Text>
            </View>
          </View>
        </Card>

        {/* Stage cards */}
        <Text style={styles.sectionTitle}>Farming Stages</Text>
        {STAGES.map(s => (
          <StageCard
            key={s.num}
            stageNumber={s.num}
            title={s.title}
            description={s.desc}
            status={s.status}
            onPress={() => router.push(s.route as any)}
          />
        ))}
      </ScrollView>
    </SwipeTabView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F5F5F5' },
  content:         { paddingHorizontal: 20 },
  screenTitle:     { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  screenSub:       { fontSize: 14, color: '#9CA3AF', marginBottom: 20 },
  sectionTitle:    { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  progressCard:    { padding: 16, marginBottom: 20 },
  progressHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressTitle:   { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  progressPercent: { fontSize: 14, fontWeight: '700', color: '#1A7A4A' },
  progressTrack:   { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden', marginBottom: 10 },
  progressFill:    { height: 8, backgroundColor: '#1A7A4A', borderRadius: 4 },
  progressLegend:  { flexDirection: 'row', gap: 12 },
  legendItem:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot:       { width: 8, height: 8, borderRadius: 4 },
  legendText:      { fontSize: 11, color: '#9CA3AF' },
});
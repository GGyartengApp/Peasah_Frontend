// mobile/app/(tabs)/home.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../Components/ui/Card';
import { StageCard, StageStatus } from '../../Components/ui/StageCard';
import { SyncBadge, SyncStatus } from '../../Components/ui/SyncBadge';
import { SwipeTabView } from '../../Components/ui/SwipeTabView';

// ── Mocked data — replace with SQLite + API in Lesson 7 ──────────────────────
const MOCKED_FARMER = {
  fullName: 'Kwame Asante',
};

const MOCKED_SEASON = {
  cropType:      'Maize',
  startDate:     '2026-03-01',
  farmName:      'Asante Green Farm',
  totalCostGhs:  1240.00,
  expectedYield: '3.5 tonnes',
  syncStatus:    'SYNCED' as SyncStatus,
};

const STAGES: {
  num: number;
  title: string;
  desc: string;
  status: StageStatus;
  route: string;
}[] = [
  { num: 1, title: 'Land Preparation', desc: 'Ploughing, soil treatment',  status: 'done',        route: '/log/land-prep'    },
  { num: 2, title: 'Planting',         desc: 'Seeds, labour, fertilizer',  status: 'done',        route: '/log/planting'     },
  { num: 3, title: 'Crop Maintenance', desc: 'Pesticides, irrigation',     status: 'in_progress', route: '/log/maintenance'  },
  { num: 4, title: 'Harvest',          desc: 'Yield and labour',           status: 'not_started', route: '/log/harvest'      },
  { num: 5, title: 'Post-Harvest',     desc: 'Sales and storage',          status: 'not_started', route: '/log/post-harvest' },
];

// ── Greeting based on time of day ─────────────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning 🌅';
  if (hour < 17) return 'Good afternoon ☀️';
  return 'Good evening 🌙';
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ stages }: { stages: typeof STAGES }) {
  const done       = stages.filter(s => s.status === 'done').length;
  const inProgress = stages.filter(s => s.status === 'in_progress').length;
  const percent    = Math.round(((done + inProgress * 0.5) / stages.length) * 100);

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Season Progress</Text>
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
          <Text style={styles.legendText}>{stages.length - done - inProgress} Remaining</Text>
        </View>
      </View>
    </View>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={[styles.statTile, { borderTopColor: color }]}>
      <MaterialIcons name={icon} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
export default function home() {
  const insets = useSafeAreaInsets();

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
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.farmerName}>{MOCKED_FARMER.fullName}</Text>
        </View>
        <View style={styles.syncRow}>
          <SyncBadge status={MOCKED_SEASON.syncStatus} />
        </View>
      </View>

      {/* ── Active season card ── */}
      <Card style={styles.seasonCard}>
        <View style={styles.seasonCardHeader}>
          <View>
            <Text style={styles.seasonCardLabel}>Active Season</Text>
            <Text style={styles.seasonCrop}>{MOCKED_SEASON.cropType}</Text>
            <Text style={styles.seasonFarm}>📍 {MOCKED_SEASON.farmName}</Text>
          </View>
          <View style={styles.cropIconCircle}>
            <Text style={styles.cropEmoji}>🌽</Text>
          </View>
        </View>

        <View style={styles.seasonDivider} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatTile
            icon="calendar-today"
            label="Started"
            value={MOCKED_SEASON.startDate}
            color="#1A7A4A"
          />
          <View style={styles.statDivider} />
          <StatTile
            icon="payments"
            label="Total Cost"
            value={`GHS ${MOCKED_SEASON.totalCostGhs.toFixed(2)}`}
            color="#F57F17"
          />
          <View style={styles.statDivider} />
          <StatTile
            icon="agriculture"
            label="Exp. Yield"
            value={MOCKED_SEASON.expectedYield}
            color="#0288D1"
          />
        </View>

        {/* Progress bar */}
        <ProgressBar stages={STAGES} />
      </Card>

      {/* ── Quick tip ── */}
      <Card style={styles.tipCard}>
        <View style={styles.tipRow}>
          <MaterialIcons name="lightbulb" size={20} color="#F57F17" />
          <Text style={styles.tipText}>
            Stage 3 is in progress — check your maintenance logs and update pesticide usage.
          </Text>
        </View>
      </Card>

      {/* ── Farming stages ── */}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  farmerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  syncRow: {
    alignItems: 'flex-end',
  },

  // Season card
  seasonCard: {
    marginBottom: 12,
    padding: 20,
  },
  seasonCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seasonCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  seasonCrop: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  seasonFarm: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  cropIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmoji: {
    fontSize: 26,
  },
  seasonDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statTile: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: 2,
    paddingTop: 10,
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
  },

  // Progress bar
  progressWrapper: {
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A7A4A',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#1A7A4A',
    borderRadius: 4,
  },
  progressLegend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#9CA3AF',
  },

  // Tip card
  tipCard: {
    backgroundColor: '#FFFBF0',
    borderColor: '#FFE082',
    padding: 14,
    marginBottom: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#795548',
    lineHeight: 18,
  },

  // Stages
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 8,
  },
});
// mobile/app/(tabs)/insights.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../Components/ui/Card';
import { SwipeTabView } from '../../Components/ui/SwipeTabView';

// ── Types ─────────────────────────────────────────────────────────────────────
type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
type RecommendationCategory =
  | 'SOIL'
  | 'WATER'
  | 'PEST'
  | 'FERTILIZER'
  | 'HARVEST'
  | 'MARKET'
  | 'WEATHER';

interface Recommendation {
  id: string;
  title: string;
  body: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  createdAt: string;
}

// ── Mocked data — replace with api.recommendations.get(farmId) in Lesson 8 ──
const MOCKED_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Apply fertilizer this week',
    body: 'Based on your planting date of March 1st, your maize crop is now at the 8-week stage. This is the optimal time to apply nitrogen-based fertilizer for maximum yield.',
    priority: 'HIGH',
    category: 'FERTILIZER',
    createdAt: '2026-05-30',
  },
  {
    id: '2',
    title: 'Watch for fall armyworm',
    body: 'Farmers in your region have reported fall armyworm activity this week. Inspect your crop leaves early morning and apply pesticide if you notice feeding damage.',
    priority: 'HIGH',
    category: 'PEST',
    createdAt: '2026-05-29',
  },
  {
    id: '3',
    title: 'Reduce irrigation frequency',
    body: 'Weather data shows rainfall is expected in the next 3 days. Hold off on irrigation to avoid waterlogging your soil.',
    priority: 'MEDIUM',
    category: 'WATER',
    createdAt: '2026-05-28',
  },
  {
    id: '4',
    title: 'Soil pH may need adjustment',
    body: 'Your recorded soil treatment notes suggest acidic conditions. Consider applying lime before your next planting season to improve nutrient absorption.',
    priority: 'MEDIUM',
    category: 'SOIL',
    createdAt: '2026-05-27',
  },
  {
    id: '5',
    title: 'Maize prices rising — good time to sell',
    body: 'Market data shows maize prices have increased by 12% in your region this month. If your post-harvest storage is stable, this is a good window to sell.',
    priority: 'LOW',
    category: 'MARKET',
    createdAt: '2026-05-26',
  },
  {
    id: '6',
    title: 'Plan harvest logistics early',
    body: 'Your expected harvest date is approaching in approximately 6 weeks. Start arranging labour and transport now to avoid last-minute costs.',
    priority: 'LOW',
    category: 'HARVEST',
    createdAt: '2026-05-25',
  },
];

const MOCKED_SUMMARY = {
  totalCostGhs:    1240.00,
  expectedYieldKg: 3500,
  estimatedRevenueGhs: 4200.00,
  profitGhs:       2960.00,
  cropType:        'Maize',
  season:          'Major Season 2026',
};

// ── Config maps ───────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<RecommendationPriority, {
  label: string;
  color: string;
  bg: string;
}> = {
  HIGH:   { label: 'High',   color: '#C62828', bg: '#FFEBEE' },
  MEDIUM: { label: 'Medium', color: '#F57F17', bg: '#FFF8E1' },
  LOW:    { label: 'Low',    color: '#1A7A4A', bg: '#E8F5EE' },
};

const CATEGORY_CONFIG: Record<RecommendationCategory, {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  bg: string;
}> = {
  SOIL:       { icon: 'terrain',       color: '#795548', bg: '#EFEBE9' },
  WATER:      { icon: 'water-drop',    color: '#0288D1', bg: '#E1F5FE' },
  PEST:       { icon: 'bug-report',    color: '#C62828', bg: '#FFEBEE' },
  FERTILIZER: { icon: 'eco',           color: '#2E7D32', bg: '#E8F5E9' },
  HARVEST:    { icon: 'agriculture',   color: '#F57F17', bg: '#FFF8E1' },
  MARKET:     { icon: 'trending-up',   color: '#1565C0', bg: '#E3F2FD' },
  WEATHER:    { icon: 'wb-sunny',      color: '#F9A825', bg: '#FFFDE7' },
};

// ── Recommendation Card ───────────────────────────────────────────────────────
function RecommendationCard({ item }: { item: Recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[item.priority];
  const category = CATEGORY_CONFIG[item.category];

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      <Card style={styles.recCard}>
        {/* Top row */}
        <View style={styles.recHeader}>
          {/* Category icon */}
          <View style={[styles.categoryIcon, { backgroundColor: category.bg }]}>
            <MaterialIcons name={category.icon} size={20} color={category.color} />
          </View>

          {/* Title + date */}
          <View style={styles.recTitleBlock}>
            <Text style={styles.recTitle} numberOfLines={expanded ? undefined : 2}>
              {item.title}
            </Text>
            <Text style={styles.recDate}>{item.createdAt}</Text>
          </View>

          {/* Priority badge */}
          <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
            <Text style={[styles.priorityText, { color: priority.color }]}>
              {priority.label}
            </Text>
          </View>
        </View>

        {/* Body — shown when expanded */}
        {expanded && (
          <Text style={styles.recBody}>{item.body}</Text>
        )}

        {/* Expand indicator */}
        <View style={styles.expandRow}>
          <MaterialIcons
            name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={18}
            color="#9CA3AF"
          />
          <Text style={styles.expandText}>
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ── Summary Tile ──────────────────────────────────────────────────────────────
function SummaryTile({
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
    <View style={[styles.summaryTile, { borderTopColor: color }]}>
      <MaterialIcons name={icon} size={18} color={color} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterPill, active && styles.filterPillActive]}
      activeOpacity={0.75}
    >
      <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── Insights Screen ───────────────────────────────────────────────────────────
export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing,      setRefreshing]      = useState(false);
  const [activeFilter,    setActiveFilter]    = useState<'ALL' | RecommendationPriority>('ALL');
  const [activeCat,       setActiveCat]       = useState<'ALL' | RecommendationCategory>('ALL');
  const [recommendations, setRecommendations] = useState(MOCKED_RECOMMENDATIONS);

  // ── Filter logic ─────────────────────────────────────────────────────────
  const filtered = recommendations.filter(r => {
    const priorityMatch = activeFilter === 'ALL' || r.priority === activeFilter;
    const categoryMatch = activeCat   === 'ALL' || r.category === activeCat;
    return priorityMatch && categoryMatch;
  });

  const highCount   = recommendations.filter(r => r.priority === 'HIGH').length;
  const mediumCount = recommendations.filter(r => r.priority === 'MEDIUM').length;
  const lowCount    = recommendations.filter(r => r.priority === 'LOW').length;

  // ── Pull to refresh ───────────────────────────────────────────────────────
  const handleRefresh = () => {
    setRefreshing(true);
    // TODO Lesson 8: call api.recommendations.recompute(farmId)
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SwipeTabView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: 120 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1A7A4A"
            colors={['#1A7A4A']}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>Insights</Text>
            <Text style={styles.screenSub}>
              {MOCKED_SUMMARY.cropType} · {MOCKED_SUMMARY.season}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={handleRefresh}
          >
            {refreshing
              ? <ActivityIndicator size="small" color="#1A7A4A" />
              : <MaterialIcons name="refresh" size={22} color="#1A7A4A" />
            }
          </TouchableOpacity>
        </View>

        {/* ── Season summary card ── */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryCardTitle}>Season Summary</Text>
          <View style={styles.summaryRow}>
            <SummaryTile
              icon="payments"
              label="Total Cost"
              value={`GHS ${MOCKED_SUMMARY.totalCostGhs.toFixed(0)}`}
              color="#C62828"
            />
            <View style={styles.summaryDivider} />
            <SummaryTile
              icon="agriculture"
              label="Exp. Yield"
              value={`${MOCKED_SUMMARY.expectedYieldKg} kg`}
              color="#1A7A4A"
            />
            <View style={styles.summaryDivider} />
            <SummaryTile
              icon="trending-up"
              label="Est. Profit"
              value={`GHS ${MOCKED_SUMMARY.profitGhs.toFixed(0)}`}
              color="#0288D1"
            />
          </View>
        </Card>

        {/* ── Priority overview ── */}
        <View style={styles.priorityRow}>
          {[
            { label: 'High',   count: highCount,   color: '#C62828', bg: '#FFEBEE' },
            { label: 'Medium', count: mediumCount, color: '#F57F17', bg: '#FFF8E1' },
            { label: 'Low',    count: lowCount,    color: '#1A7A4A', bg: '#E8F5EE' },
          ].map(p => (
            <View key={p.label} style={[styles.priorityTile, { backgroundColor: p.bg }]}>
              <Text style={[styles.priorityCount, { color: p.color }]}>{p.count}</Text>
              <Text style={[styles.priorityLabel, { color: p.color }]}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Priority filter pills ── */}
        <Text style={styles.sectionTitle}>Filter by Priority</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsRow}
        >
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(f => (
            <FilterPill
              key={f}
              label={f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              active={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </ScrollView>

        {/* ── Category filter pills ── */}
        <Text style={styles.sectionTitle}>Filter by Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsRow}
        >
          {(['ALL', 'SOIL', 'WATER', 'PEST', 'FERTILIZER', 'HARVEST', 'MARKET', 'WEATHER'] as const).map(c => (
            <FilterPill
              key={c}
              label={c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
              active={activeCat === c}
              onPress={() => setActiveCat(c)}
            />
          ))}
        </ScrollView>

        {/* ── Recommendations list ── */}
        <Text style={styles.sectionTitle}>
          Recommendations
          <Text style={styles.sectionCount}> ({filtered.length})</Text>
        </Text>

        {filtered.length === 0 ? (
          <Card style={styles.emptyCard}>
            <MaterialIcons name="lightbulb" size={40} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No recommendations</Text>
            <Text style={styles.emptySubtitle}>
              Try changing your filters or pull down to refresh
            </Text>
          </Card>
        ) : (
          filtered.map(item => (
            <RecommendationCard key={item.id} item={item} />
          ))
        )}

        {/* ── Lesson 8 TODO note ── */}
        <Card style={styles.todoCard}>
          <View style={styles.todoRow}>
            <MaterialIcons name="info-outline" size={16} color="#0288D1" />
            <Text style={styles.todoText}>
              Lesson 8 — replace mocked data with{' '}
              <Text style={styles.todoCode}>api.recommendations.get(farmId)</Text>
            </Text>
          </View>
        </Card>
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
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  screenSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Summary card
  summaryCard: {
    marginBottom: 12,
    padding: 16,
  },
  summaryCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTile: {
    flex: 1,
    alignItems: 'center',
    borderTopWidth: 2,
    paddingTop: 10,
    gap: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
  },

  // Priority overview tiles
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityTile: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  priorityCount: {
    fontSize: 24,
    fontWeight: '800',
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Section title
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },

  // Filter pills
  pillsRow: {
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#1A7A4A',
    borderColor: '#1A7A4A',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // Recommendation card
  recCard: {
    marginBottom: 8,
    padding: 14,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitleBlock: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  recDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 2,
  },
  expandText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Empty state
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // TODO card
  todoCard: {
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9',
    padding: 12,
    marginTop: 8,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  todoText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 18,
  },
  todoCode: {
    fontFamily: 'monospace',
    backgroundColor: '#BBDEFB',
  },
});
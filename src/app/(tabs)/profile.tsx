// mobile/app/(tabs)/profile.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../Components/ui/Button';
import { Card } from '../../Components/ui/Card';
import { StageCard, StageStatus } from '../../Components/ui/StageCard';
import { SyncBadge, SyncStatus } from '../../Components/ui/SyncBadge';
import { SwipeTabView } from '@/Components/ui/SwipeTabView';

// ── Mocked data — remove when wiring real auth in Lesson 6 ──
const MOCKED_USER = {
  id: 'abc12345-xyz',
  fullName: 'Kwame Asante',
  phoneNumber: '0241234567',
};

const MOCKED_SYNC_STATUS: SyncStatus = 'SYNCED';

const STAGE_SUMMARY: {
  num: number;
  title: string;
  desc: string;
  status: StageStatus;
  route: string;
}[] = [
  { num: 1, title: 'Land Preparation', desc: 'Ploughing, soil treatment',  status: 'done',        route: '/log/land-prep'   },
  { num: 2, title: 'Planting',         desc: 'Seeds, labour, fertilizer',  status: 'done',        route: '/log/planting'    },
  { num: 3, title: 'Crop Maintenance', desc: 'Pesticides, irrigation',     status: 'in_progress', route: '/log/maintenance' },
  { num: 4, title: 'Harvest',          desc: 'Yield and labour',           status: 'not_started', route: '/log/harvest'     },
  { num: 5, title: 'Post-Harvest',     desc: 'Sales and storage',          status: 'not_started', route: '/log/post-harvest'},
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const initials = getInitials(MOCKED_USER.fullName);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => router.replace('/(authentication)/Login'),
      },
    ]);
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
    >
      {/* ── Screen title ── */}
      <Text style={styles.screenTitle}>Profile</Text>

      {/* ── Avatar card ── */}
      <Card padding={24} style={styles.avatarCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.farmerName}>{MOCKED_USER.fullName}</Text>
        <Text style={styles.farmerPhone}>{MOCKED_USER.phoneNumber}</Text>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Data sync: </Text>
          <SyncBadge status={MOCKED_SYNC_STATUS} />
        </View>
        <View style={styles.farmerBadge}>
          <MaterialIcons name="verified" size={14} color="#1A7A4A" />
          <Text style={styles.farmerBadgeText}>Peasah Farmer</Text>
        </View>
      </Card>

      {/* ── Account info ── */}
      <Text style={styles.sectionTitle}>Account</Text>
      <Card padding={0}>
        {[
          { icon: 'person-outline', label: 'Full Name',    value: MOCKED_USER.fullName    },
          { icon: 'phone',          label: 'Phone Number', value: MOCKED_USER.phoneNumber },
          { icon: 'badge',          label: 'Farmer ID',    value: `#${MOCKED_USER.id.slice(0, 8).toUpperCase()}` },
        ].map((item, i, arr) => (
          <View key={item.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <MaterialIcons name={item.icon as any} size={18} color="#1A7A4A" />
              </View>
              <View style={styles.infoRowContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>

      {/* ── Season progress ── */}
      <Text style={styles.sectionTitle}>Season Progress</Text>
      {STAGE_SUMMARY.map((stage) => (
        <StageCard
          key={stage.num}
          stageNumber={stage.num}
          title={stage.title}
          description={stage.desc}
          status={stage.status}
          onPress={() => router.push(stage.route as any)}
        />
      ))}

      {/* ── App info ── */}
      <Text style={styles.sectionTitle}>App</Text>
      <Card padding={0}>
        {[
          { icon: 'info-outline', label: 'Version',  value: '1.0.0'                  },
          { icon: 'group',        label: 'Team',     value: 'CODEQUEST · Group 70'   },
          { icon: 'storage',      label: 'Database', value: 'SQLite (offline-first)' },
        ].map((item, i, arr) => (
          <View key={item.label}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconCircle}>
                <MaterialIcons name={item.icon as any} size={18} color="#1A7A4A" />
              </View>
              <View style={styles.infoRowContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </Card>

      {/* ── Logout ── */}
      <Button label="Log Out" onPress={handleLogout} variant="danger" />

      <Text style={styles.footer}>Peasah — CODEQUEST 2026 · Group 70</Text>
    </ScrollView>
    </SwipeTabView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F5F5F5' },
  content:          { paddingHorizontal: 20 },
  screenTitle:      { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },

  // Avatar card
  avatarCard:       { alignItems: 'center', marginBottom: 0 },
  avatarCircle:     { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8A838', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:       { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  farmerName:       { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  farmerPhone:      { fontSize: 14, color: '#9CA3AF', marginBottom: 10 },
  syncRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  syncLabel:        { fontSize: 13, color: '#9CA3AF' },
  farmerBadge:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4 },
  farmerBadgeText:  { fontSize: 12, fontWeight: '600', color: '#1A7A4A' },

  // Section
  sectionTitle:     { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginTop: 8, marginLeft: 4 },

  // Info rows
  infoRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  infoIconCircle:   { width: 34, height: 34, borderRadius: 10, backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoRowContent:   { flex: 1 },
  infoLabel:        { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  infoValue:        { fontSize: 15, color: '#1A1A1A', fontWeight: '600', marginTop: 1 },
  divider:          { height: 1, backgroundColor: '#F5F5F5', marginLeft: 62 },

  footer:           { textAlign: 'center', fontSize: 12, color: '#D1D5DB', marginTop: 8, marginBottom: 8 },
});
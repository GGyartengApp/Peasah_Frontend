import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Modal, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../Components/ui/Button';
import { Card } from '../../Components/ui/Card';
import { Input } from '../../Components/ui/Input';
import { SyncBadge, SyncStatus } from '../../Components/ui/SyncBadge';

export default function LandPrepScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [landSize,      setLandSize]      = useState('');
  const [soilTreatment, setSoilTreatment] = useState('');
  const [ploughingCost, setPloughingCost] = useState('');
  const [labourCount,   setLabourCount]   = useState('');
  const [labourCost,    setLabourCost]    = useState('');
  const [equipmentUsed, setEquipmentUsed] = useState('');
  const [loading,       setLoading]       = useState(false);
  const [syncStatus,    setSyncStatus]    = useState<SyncStatus | null>(null);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [savedLogs,     setSavedLogs]     = useState<any[]>([]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!landSize || isNaN(Number(landSize))) e.landSize = 'Enter a valid land size';
    if (!ploughingCost || isNaN(Number(ploughingCost))) e.ploughingCost = 'Enter a valid cost';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    setErrors({});
    if (!validate()) return;
    setLoading(true);

    // TODO Lesson 7: save to SQLite + sync to backend
    // Simulating save for now
    setTimeout(() => {
      const newLog = {
        id: Date.now().toString(),
        landSize, soilTreatment, ploughingCost,
        labourCount, labourCost, equipmentUsed,
        savedAt: new Date().toLocaleString(),
      };
      setSavedLogs(prev => [newLog, ...prev]);
      setSyncStatus('PENDING');
      setLoading(false);
      setModalVisible(false);
      resetForm();

      // Simulate sync
      setTimeout(() => setSyncStatus('SYNCED'), 2000);
    }, 1000);
  }

  function resetForm() {
    setLandSize(''); setSoilTreatment(''); setPloughingCost('');
    setLabourCount(''); setLabourCost(''); setEquipmentUsed('');
    setErrors({});
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Land Preparation</Text>
          <Text style={styles.headerSub}>Stage 1 of 5</Text>
        </View>
        {syncStatus && <SyncBadge status={syncStatus} />}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stage info card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <MaterialIcons name="terrain" size={22} color="#1A7A4A" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>What to log here</Text>
              <Text style={styles.infoBody}>
                Record land size, soil treatment applied, ploughing costs, labour and equipment used.
              </Text>
            </View>
          </View>
        </Card>

        {/* Saved logs */}
        {savedLogs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Saved Records</Text>
            {savedLogs.map(log => (
              <Card key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <MaterialIcons name="check-circle" size={16} color="#1A7A4A" />
                  <Text style={styles.logText}>{log.landSize} acres · GHS {log.ploughingCost}</Text>
                  <Text style={styles.logDate}>{log.savedAt}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Empty state */}
        {savedLogs.length === 0 && (
          <Card style={styles.emptyCard}>
            <MaterialIcons name="terrain" size={40} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No records yet</Text>
            <Text style={styles.emptySubtitle}>Tap the button below to log land preparation</Text>
          </Card>
        )}

        {/* Log button */}
        <Button
          label="+ Log Land Preparation"
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>

      {/* ── Modal form ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Land Preparation Log</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <MaterialIcons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <Input
                label="Land Size (acres) *"
                value={landSize}
                onChangeText={setLandSize}
                keyboardType="decimal-pad"
                placeholder="e.g. 2.5"
                error={errors.landSize}
              />
              <Input
                label="Soil Treatment"
                value={soilTreatment}
                onChangeText={setSoilTreatment}
                placeholder="e.g. Lime, compost"
              />
              <Input
                label="Ploughing Cost (GHS) *"
                value={ploughingCost}
                onChangeText={setPloughingCost}
                keyboardType="decimal-pad"
                placeholder="e.g. 300"
                error={errors.ploughingCost}
              />
              <Input
                label="Labour Count"
                value={labourCount}
                onChangeText={setLabourCount}
                keyboardType="numeric"
                placeholder="Number of workers"
              />
              <Input
                label="Labour Cost (GHS)"
                value={labourCost}
                onChangeText={setLabourCost}
                keyboardType="decimal-pad"
                placeholder="e.g. 150"
              />
              <Input
                label="Equipment Used"
                value={equipmentUsed}
                onChangeText={setEquipmentUsed}
                placeholder="e.g. Tractor, hoe"
              />
              <Button
                label="Save Land Preparation"
                onPress={handleSave}
                loading={loading}
              />
              <Button
                label="Cancel"
                onPress={() => { setModalVisible(false); resetForm(); }}
                variant="secondary"
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F5F5F5' },
  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn:         { padding: 4, marginRight: 8 },
  headerCenter:    { flex: 1 },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerSub:       { fontSize: 12, color: '#9CA3AF' },
  content:         { padding: 16 },
  infoCard:        { padding: 14, marginBottom: 16, backgroundColor: '#E8F5EE', borderColor: '#A5D6B5' },
  infoRow:         { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIconCircle:  { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  infoText:        { flex: 1 },
  infoTitle:       { fontSize: 14, fontWeight: '700', color: '#1A7A4A', marginBottom: 4 },
  infoBody:        { fontSize: 13, color: '#2E7D32', lineHeight: 18 },
  sectionTitle:    { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  logCard:         { padding: 12, marginBottom: 8 },
  logRow:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logText:         { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  logDate:         { fontSize: 11, color: '#9CA3AF' },
  emptyCard:       { padding: 32, alignItems: 'center', gap: 8, marginBottom: 16 },
  emptyTitle:      { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  emptySubtitle:   { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  modalOverlay:    { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet:      { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle:      { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  modalContent:    { padding: 20, paddingBottom: 40 },
});
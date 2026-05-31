import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../Components/ui/Button';
import { Card } from '../../Components/ui/Card';
import { Input } from '../../Components/ui/Input';
import { SyncBadge, SyncStatus } from '../../Components/ui/SyncBadge';

const YIELD_UNITS = ['kg', 'bags', 'tonnes', 'crates'];

export default function HarvestScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible,  setModalVisible]  = useState(false);
  const [harvestDate,   setHarvestDate]   = useState('');
  const [yieldQty,      setYieldQty]      = useState('');
  const [yieldUnit,     setYieldUnit]     = useState('kg');
  const [labourCost,    setLabourCost]    = useState('');
  const [equipmentCost, setEquipmentCost] = useState('');
  const [loading,       setLoading]       = useState(false);
  const [syncStatus,    setSyncStatus]    = useState<SyncStatus | null>(null);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [savedLogs,     setSavedLogs]     = useState<any[]>([]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!harvestDate.trim())                  e.harvestDate = 'Harvest date is required';
    if (!yieldQty || isNaN(Number(yieldQty))) e.yieldQty   = 'Enter a valid yield quantity';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    // TODO Lesson 7: replace with SQLite save + api.input.harvest()
    setTimeout(() => {
      setSavedLogs(prev => [{
        id: Date.now().toString(),
        harvestDate, yieldQty, yieldUnit,
        labourCost, equipmentCost,
        savedAt: new Date().toLocaleString(),
      }, ...prev]);
      setSyncStatus('PENDING');
      setLoading(false);
      setModalVisible(false);
      resetForm();
      setTimeout(() => setSyncStatus('SYNCED'), 2000);
    }, 1000);
  }

  function resetForm() {
    setHarvestDate(''); setYieldQty(''); setYieldUnit('kg');
    setLabourCost(''); setEquipmentCost(''); setErrors({});
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Harvest</Text>
          <Text style={styles.headerSub}>Stage 4 of 5</Text>
        </View>
        {syncStatus && <SyncBadge status={syncStatus} />}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconCircle}>
              <MaterialIcons name="agriculture" size={22} color="#1A7A4A" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>What to log here</Text>
              <Text style={styles.infoBody}>Record harvest date, total yield quantity, unit, labour and equipment costs.</Text>
            </View>
          </View>
        </Card>

        {savedLogs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Saved Records</Text>
            {savedLogs.map(log => (
              <Card key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <MaterialIcons name="check-circle" size={16} color="#1A7A4A" />
                  <Text style={styles.logText}>{log.yieldQty} {log.yieldUnit} · {log.harvestDate}</Text>
                  <Text style={styles.logDate}>{log.savedAt}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {savedLogs.length === 0 && (
          <Card style={styles.emptyCard}>
            <MaterialIcons name="agriculture" size={40} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No records yet</Text>
            <Text style={styles.emptySubtitle}>Tap the button below to log your harvest</Text>
          </Card>
        )}

        <Button label="+ Log Harvest" onPress={() => setModalVisible(true)} />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Harvest Log</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <MaterialIcons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Input label="Harvest Date *" value={harvestDate} onChangeText={setHarvestDate} placeholder="YYYY-MM-DD" error={errors.harvestDate} />
              <Input label="Total Yield *" value={yieldQty} onChangeText={setYieldQty} keyboardType="decimal-pad" placeholder="e.g. 250" error={errors.yieldQty} />
              <Text style={styles.inputLabel}>Unit</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {YIELD_UNITS.map(u => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setYieldUnit(u)}
                    style={[styles.chip, yieldUnit === u && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, yieldUnit === u && styles.chipTextActive]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Input label="Labour Cost (GHS)" value={labourCost} onChangeText={setLabourCost} keyboardType="decimal-pad" placeholder="e.g. 300" />
              <Input label="Equipment Cost (GHS)" value={equipmentCost} onChangeText={setEquipmentCost} keyboardType="decimal-pad" placeholder="e.g. 150" />
              <Button label="Save Harvest" onPress={handleSave} loading={loading} />
              <Button label="Cancel" onPress={() => { setModalVisible(false); resetForm(); }} variant="secondary" />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F5F5F5' },
  header:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn:        { padding: 4, marginRight: 8 },
  headerCenter:   { flex: 1 },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerSub:      { fontSize: 12, color: '#9CA3AF' },
  content:        { padding: 16 },
  infoCard:       { padding: 14, marginBottom: 16, backgroundColor: '#E8F5EE', borderColor: '#A5D6B5' },
  infoRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  infoText:       { flex: 1 },
  infoTitle:      { fontSize: 14, fontWeight: '700', color: '#1A7A4A', marginBottom: 4 },
  infoBody:       { fontSize: 13, color: '#2E7D32', lineHeight: 18 },
  sectionTitle:   { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  logCard:        { padding: 12, marginBottom: 8 },
  logRow:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logText:        { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  logDate:        { fontSize: 11, color: '#9CA3AF' },
  emptyCard:      { padding: 32, alignItems: 'center', gap: 8, marginBottom: 16 },
  emptyTitle:     { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  emptySubtitle:  { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  inputLabel:     { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  chip:           { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  chipActive:     { backgroundColor: '#1A7A4A', borderColor: '#1A7A4A' },
  chipText:       { fontSize: 13, fontWeight: '600', color: '#666' },
  chipTextActive: { color: '#FFFFFF' },
  modalOverlay:   { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet:     { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle:     { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  modalContent:   { padding: 20, paddingBottom: 40 },
});
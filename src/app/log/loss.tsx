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

// ✅ Document specifies exactly these loss types
const LOSS_TYPES = ['STORAGE', 'TRANSPORT', 'MARKET', 'WEATHER', 'PEST', 'OTHER'] as const;
type LossType = typeof LOSS_TYPES[number];

const LOSS_TYPE_CONFIG: Record<LossType, { icon: keyof typeof MaterialIcons.glyphMap; color: string; label: string }> = {
  STORAGE:   { icon: 'warehouse',    color: '#795548', label: 'Storage'   },
  TRANSPORT: { icon: 'local-shipping', color: '#0288D1', label: 'Transport' },
  MARKET:    { icon: 'trending-down', color: '#C62828', label: 'Market'    },
  WEATHER:   { icon: 'wb-cloudy',    color: '#546E7A', label: 'Weather'   },
  PEST:      { icon: 'bug-report',   color: '#F57F17', label: 'Pest'      },
  OTHER:     { icon: 'help-outline', color: '#9CA3AF', label: 'Other'     },
};

export default function LossScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible,    setModalVisible]    = useState(false);
  const [lossType,        setLossType]        = useState<LossType | ''>('');
  const [quantityLostKg,  setQuantityLostKg]  = useState('');
  const [estimatedValue,  setEstimatedValue]  = useState('');
  const [occurredAt,      setOccurredAt]      = useState('');
  const [notes,           setNotes]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [syncStatus,      setSyncStatus]      = useState<SyncStatus | null>(null);
  const [errors,          setErrors]          = useState<Record<string, string>>({});
  const [savedLogs,       setSavedLogs]       = useState<any[]>([]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!lossType)                                          e.lossType       = 'Select a loss type';
    if (!quantityLostKg || isNaN(Number(quantityLostKg))) e.quantityLostKg = 'Enter a valid quantity';
    if (!occurredAt.trim())                                e.occurredAt     = 'Enter the date this occurred';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    // TODO Lesson 7: save to SQLite + api.losses.create()
    setTimeout(() => {
      setSavedLogs(prev => [{
        id: Date.now().toString(),
        lossType, quantityLostKg, estimatedValue,
        occurredAt, notes,
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
    setLossType(''); setQuantityLostKg(''); setEstimatedValue('');
    setOccurredAt(''); setNotes(''); setErrors({});
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Loss Event</Text>
          <Text style={styles.headerSub}>Record crop or post-harvest losses</Text>
        </View>
        {syncStatus && <SyncBadge status={syncStatus} />}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        {/* Warning card */}
        <Card style={styles.warningCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <MaterialIcons name="warning" size={22} color="#C62828" />
            </View>
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: '#C62828' }]}>Loss Recording</Text>
              <Text style={[styles.infoBody, { color: '#B71C1C' }]}>
                Record any crop losses due to storage, transport, weather, pests or market issues.
                This data improves your farm insights.
              </Text>
            </View>
          </View>
        </Card>

        {/* Loss type grid */}
        <Text style={styles.sectionTitle}>Loss Type Overview</Text>
        <View style={styles.lossTypeGrid}>
          {LOSS_TYPES.map(type => {
            const config = LOSS_TYPE_CONFIG[type];
            const count  = savedLogs.filter(l => l.lossType === type).length;
            return (
              <View key={type} style={styles.lossTypeTile}>
                <View style={[styles.lossTypeIcon, { backgroundColor: config.color + '1A' }]}>
                  <MaterialIcons name={config.icon} size={20} color={config.color} />
                </View>
                <Text style={styles.lossTypeName}>{config.label}</Text>
                <Text style={[styles.lossTypeCount, { color: config.color }]}>{count}</Text>
              </View>
            );
          })}
        </View>

        {savedLogs.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Saved Records</Text>
            {savedLogs.map(log => {
              const config = LOSS_TYPE_CONFIG[log.lossType as LossType];
              return (
                <Card key={log.id} style={styles.logCard}>
                  <View style={styles.logRow}>
                    <View style={[styles.logIconCircle, { backgroundColor: config.color + '1A' }]}>
                      <MaterialIcons name={config.icon} size={16} color={config.color} />
                    </View>
                    <View style={styles.logContent}>
                      <Text style={styles.logText}>{config.label} · {log.quantityLostKg} kg</Text>
                      {log.estimatedValue ? (
                        <Text style={styles.logSubText}>Est. GHS {log.estimatedValue}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.logDate}>{log.occurredAt}</Text>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {savedLogs.length === 0 && (
          <Card style={styles.emptyCard}>
            <MaterialIcons name="sentiment-satisfied" size={40} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No losses recorded</Text>
            <Text style={styles.emptySubtitle}>Good news! Record any losses if they occur.</Text>
          </Card>
        )}

        <Button label="+ Record Loss Event" onPress={() => setModalVisible(true)} variant="danger" />
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Loss Event</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <MaterialIcons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalContent}>

              {/* Loss type picker — document specifies exactly these 6 */}
              <Text style={styles.inputLabel}>Loss Type *</Text>
              {errors.lossType && <Text style={styles.errorText}>{errors.lossType}</Text>}
              <View style={styles.lossTypePicker}>
                {LOSS_TYPES.map(type => {
                  const config  = LOSS_TYPE_CONFIG[type];
                  const active  = lossType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setLossType(type)}
                      style={[
                        styles.lossTypePickerItem,
                        active && { backgroundColor: config.color, borderColor: config.color },
                      ]}
                    >
                      <MaterialIcons name={config.icon} size={18} color={active ? '#FFF' : config.color} />
                      <Text style={[styles.lossTypePickerText, active && { color: '#FFF' }]}>
                        {config.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Input
                label="Quantity Lost (kg) *"
                value={quantityLostKg}
                onChangeText={setQuantityLostKg}
                keyboardType="decimal-pad"
                placeholder="e.g. 50"
                error={errors.quantityLostKg}
              />
              <Input
                label="Estimated Value (GHS)"
                value={estimatedValue}
                onChangeText={setEstimatedValue}
                keyboardType="decimal-pad"
                placeholder="e.g. 300"
              />
              <Input
                label="Date Occurred *"
                value={occurredAt}
                onChangeText={setOccurredAt}
                placeholder="YYYY-MM-DD"
                error={errors.occurredAt}
              />
              <Input
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                placeholder="Describe what happened..."
                multiline
                numberOfLines={3}
              />
              <Button label="Save Loss Event" onPress={handleSave} loading={loading} variant="danger" />
              <Button label="Cancel" onPress={() => { setModalVisible(false); resetForm(); }} variant="secondary" />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#F5F5F5' },
  header:              { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn:             { padding: 4, marginRight: 8 },
  headerCenter:        { flex: 1 },
  headerTitle:         { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  headerSub:           { fontSize: 12, color: '#9CA3AF' },
  content:             { padding: 16 },
  warningCard:         { padding: 14, marginBottom: 16, backgroundColor: '#FFF8F8', borderColor: '#FFCDD2' },
  infoRow:             { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  infoIconCircle:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  infoText:            { flex: 1 },
  infoTitle:           { fontSize: 14, fontWeight: '700', color: '#1A7A4A', marginBottom: 4 },
  infoBody:            { fontSize: 13, color: '#2E7D32', lineHeight: 18 },
  sectionTitle:        { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  lossTypeGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  lossTypeTile:        { width: '30%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  lossTypeIcon:        { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  lossTypeName:        { fontSize: 11, fontWeight: '600', color: '#666', textAlign: 'center' },
  lossTypeCount:       { fontSize: 18, fontWeight: '800' },
  logCard:             { padding: 12, marginBottom: 8 },
  logRow:              { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logIconCircle:       { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logContent:          { flex: 1 },
  logText:             { fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  logSubText:          { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  logDate:             { fontSize: 11, color: '#9CA3AF' },
  emptyCard:           { padding: 32, alignItems: 'center', gap: 8, marginBottom: 16 },
  emptyTitle:          { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  emptySubtitle:       { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  inputLabel:          { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  errorText:           { fontSize: 12, color: '#C62828', marginBottom: 6 },
  lossTypePicker:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  lossTypePickerItem:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' },
  lossTypePickerText:  { fontSize: 13, fontWeight: '600', color: '#666' },
  modalOverlay:        { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet:          { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%' },
  modalHeader:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle:          { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  modalContent:        { padding: 20, paddingBottom: 40 },
});
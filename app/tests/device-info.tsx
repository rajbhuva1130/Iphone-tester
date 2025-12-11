import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Platform } from 'react-native';
import * as Device from 'expo-device';
// import { StorageAccessFramework } from 'expo-file-system'; 
import * as FileSystem from 'expo-file-system/legacy';
import * as Cellular from 'expo-cellular';
import Constants from 'expo-constants';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

// Helper to format bytes
const formatBytes = (bytes?: number | null) => {
  if (bytes === undefined || bytes === null) return 'Unknown';
  if (bytes === 0) return '0 B';
  const k = 1000;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

type InfoRow = { label: string; value: string | undefined; highlight?: boolean };

export default function DeviceInfoTest() {
  const updateResult = useTestStore((s) => s.updateResult);
  const [storage, setStorage] = useState<{ total: number; free: number } | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);

  useEffect(() => {
    // Gather async info
    async function load() {
      try {
        const total = await FileSystem.getTotalDiskCapacityAsync();
        const free = await FileSystem.getFreeDiskStorageAsync();
        setStorage({ total, free });
      } catch (e) {
        console.log('Storage info failed', e);
      }

      try {
        const carrierName = await Cellular.getCarrierNameAsync();
        setCarrier(carrierName || 'No SIM / Unknown');
      } catch (e) {
        // Web or simulator might fail
        setCarrier('N/A');
      }

      updateResult('deviceInfo', { status: 'running' });
    }
    load();
  }, [updateResult]);

  const rows: InfoRow[] = [
    { label: 'Device Model', value: Device.modelName || 'Unknown', highlight: true },
    { label: 'Brand', value: Device.brand || 'Apple' },
    { label: 'Device Design', value: Device.designName || 'iPhone' }, // e.g. "iPhone12,1"
    { label: 'OS Version', value: `${Device.osName} ${Device.osVersion}` },
    { label: 'Memory', value: formatBytes(Device.totalMemory) }, // RAM
    { label: 'Storage', value: storage ? `${formatBytes(storage.free)} free / ${formatBytes(storage.total)}` : 'Loading...' },
    { label: 'Carrier', value: carrier || 'Loading...' },
    { label: 'Region Code', value: Cellular.isoCountryCode?.toUpperCase() || 'Unknown' },
    { label: 'Architecture', value: Constants.platform?.ios?.model || Platform.OS },
  ];

  const TableRow = ({ item, index }: { item: InfoRow; index: number }) => (
    <View
      className={`flex-row justify-between py-3 px-2 border-b border-border ${index % 2 === 0 ? 'bg-surface/50' : 'bg-transparent'}`}
    >
      <Text className="text-muted font-medium" style={{ color: '#a1a1aa' }}>{item.label}</Text>
      <Text className={`font-semibold ${item.highlight ? 'text-primary' : 'text-white'}`} style={{ color: item.highlight ? '#007AFF' : 'white' }}>
        {item.value}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Identity & Specs" subtitle="Compare with ex-factory specs manually">
        <View className="bg-surface rounded-xl overflow-hidden border border-border mb-4">
          <View className="flex-row justify-between p-3 bg-card border-b border-border">
            <Text className="text-muted text-xs uppercase font-bold tracking-wider" style={{ color: '#a1a1aa' }}>Item</Text>
            <Text className="text-muted text-xs uppercase font-bold tracking-wider" style={{ color: '#a1a1aa' }}>Read Value</Text>
          </View>
          {rows.map((r, i) => (
            <TableRow key={r.label} item={r} index={i} />
          ))}
        </View>

        <View className="mt-2 flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('deviceInfo', { status: 'pass', notes: 'Specs Verified' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('deviceInfo', { status: 'fail', notes: 'Specs Mismatch' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

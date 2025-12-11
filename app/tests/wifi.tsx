import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import * as Network from 'expo-network';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Panel from '../../components/Panel';
import ResultsPanel from '../../components/ResultsPanel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function WifiTest() {
  const [state, setState] = useState<NetInfoState | null>(null);
  const [ip, setIp] = useState<string | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((next) => {
      setState(next);
      updateResult('wifi', {
        status: next.isConnected ? 'running' : 'fail',
        data: { type: next.type, isConnected: next.isConnected ?? false, ssid: (next.details as any)?.ssid ?? null }
      });
    });

    Network.getIpAddressAsync().then(setIp).catch(() => setIp(null));

    return () => subscription();
  }, [updateResult]);

  const refresh = async () => {
    const info = await NetInfo.fetch();
    setState(info);
    let currentIp = null;
    try {
      currentIp = await Network.getIpAddressAsync();
    } catch (e) {
      // ignore
    }
    setIp(currentIp);
    updateResult('wifi', {
      status: info.isConnected ? 'pass' : 'fail',
      data: { type: info.type, isConnected: info.isConnected ?? false, ssid: (info.details as any)?.ssid ?? null, ipAddress: currentIp }
    });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="WiFi & Connectivity" subtitle="Check connection type and IP">
        <ActionButton label="Refresh Connectivity" onPress={refresh} />
        <View className="mt-4">
          <ResultsPanel
            items={[
              { label: 'Connected', value: state?.isConnected ? 'Yes' : 'No', accent: state?.isConnected ? 'success' : 'danger' },
              { label: 'Type', value: state?.type ?? 'unknown', accent: 'muted' },
              { label: 'SSID', value: ((state?.details as any)?.ssid as string) ?? 'unknown', accent: 'muted' },
              { label: 'IP Address', value: ip ?? 'n/a', accent: 'muted' }
            ]}
          />
          {Platform.OS === 'ios' && (
            <Text className="mt-2 text-xs text-muted">SSID may be hidden on iOS due to privacy limitations.</Text>
          )}
        </View>
      </Panel>
    </ScrollView>
  );
}

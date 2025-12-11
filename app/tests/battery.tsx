import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text } from 'react-native';
import * as Battery from 'expo-battery';
import Panel from '../../components/Panel';
import ResultsPanel from '../../components/ResultsPanel';
import { useTestStore } from '../../store/useTestStore';

export default function BatteryTest() {
  const [level, setLevel] = useState<number | null>(null);
  const [state, setState] = useState<string>('unknown');
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    if (Platform.OS === 'web') {
      updateResult('battery', { status: 'warning', notes: 'Battery API limited on web' });
      return;
    }
    const init = async () => {
      const [lvl, st] = await Promise.all([Battery.getBatteryLevelAsync(), Battery.getBatteryStateAsync()]);
      setLevel(lvl);
      setState(Battery.BatteryState[st] ?? 'unknown');
      updateResult('battery', { status: 'running', data: { level: lvl, state: Battery.BatteryState[st] } });
    };
    init();

    const subLevel = Battery.addBatteryLevelListener(({ batteryLevel }) => setLevel(batteryLevel));
    const subState = Battery.addBatteryStateListener(({ batteryState }) => setState(Battery.BatteryState[batteryState]));

    return () => {
      subLevel.remove();
      subState.remove();
    };
  }, [updateResult]);

  useEffect(() => {
    if (level !== null) {
      updateResult('battery', { status: 'pass', data: { level, state } });
    }
  }, [level, state, updateResult]);

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Battery Health">
        <ResultsPanel
          items={[
            { label: 'Level', value: level !== null ? `${Math.round(level * 100)}%` : 'Loading', accent: 'warning' },
            { label: 'State', value: state, accent: 'muted' }
          ]}
        />
        <Text className="mt-2 text-muted">
          Battery level below 20% may indicate rapid discharge. Re-test after a full charge if unexpected.
        </Text>
      </Panel>
    </ScrollView>
  );
}

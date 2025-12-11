import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import * as Brightness from 'expo-brightness';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function BrightnessTest() {
  const [level, setLevel] = useState<number | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    Brightness.requestPermissionsAsync().finally(() => {
      Brightness.getBrightnessAsync().then((value) => {
        setLevel(value);
        updateResult('brightness', { status: 'running', notes: 'Ready' });
      });
    });
  }, [updateResult]);

  const setValue = async (value: number) => {
    if (Platform.OS === 'web') {
      setLevel(value);
      updateResult('brightness', { status: 'pass', notes: 'Simulated on web' });
      return;
    }
    await Brightness.setBrightnessAsync(value);
    setLevel(value);
    updateResult('brightness', { status: 'pass', data: { level: value } });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Brightness Sweep" subtitle="Move between minimum and maximum brightness">
        <Text className="mb-3 text-muted" style={{ color: '#a1a1aa' }}>
          We temporarily adjust screen brightness for this test. Settings are restored by the system afterward.
        </Text>
        <View className="flex-row gap-3">
          <ActionButton label="Min Brightness" variant="secondary" onPress={() => setValue(0.05)} />
          <ActionButton label="Max Brightness" onPress={() => setValue(1)} />
        </View>
        <View className="mt-4 rounded-xl border border-border bg-black/40 p-3">
          <Text className="text-white" style={{ color: 'white' }}>Current level: {level !== null ? level.toFixed(2) : 'Loading…'}</Text>
        </View>
      </Panel>
    </ScrollView>
  );
}

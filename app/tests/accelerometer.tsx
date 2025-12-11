import { useEffect, useState, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Panel from '../../components/Panel';
import ResultsPanel from '../../components/ResultsPanel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

type SensorData = { x: number; y: number; z: number };

export default function AccelerometerTest() {
  const [data, setData] = useState<SensorData>({ x: 0, y: 0, z: 0 });
  const updateResult = useTestStore((s) => s.updateResult);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener((next) => {
      setData(next);
      const now = Date.now();
      if (now - lastUpdate.current > 1000) {
        updateResult('accelerometer', { status: 'running', data: next });
        lastUpdate.current = now;
      }
    });

    return () => sub.remove();
  }, [updateResult]);

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Accelerometer" subtitle="Move and tilt the device to see live acceleration">
        <ResultsPanel
          items={[
            { label: 'X', value: data.x.toFixed(3), accent: 'warning' },
            { label: 'Y', value: data.y.toFixed(3), accent: 'warning' },
            { label: 'Z', value: data.z.toFixed(3), accent: 'warning' }
          ]}
        />
        <Text className="mt-3 text-muted">Values should change as you move or tilt the device.</Text>

        <View className="mt-4 flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('accelerometer', { status: 'pass', notes: 'Data responded to motion' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('accelerometer', { status: 'fail', notes: 'No response' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

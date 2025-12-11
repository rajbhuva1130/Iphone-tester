import { useEffect, useState, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import Panel from '../../components/Panel';
import ResultsPanel from '../../components/ResultsPanel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

type SensorData = { x: number; y: number; z: number };

export default function GyroscopeTest() {
  const [gyro, setGyro] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [mag, setMag] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });

  const updateResult = useTestStore((s) => s.updateResult);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    // Smoother updates for UI
    Gyroscope.setUpdateInterval(100);
    Magnetometer.setUpdateInterval(100);

    const gyroSub = Gyroscope.addListener((data) => {
      setGyro(data);
      // Throttle store updates to prevent lag
      const now = Date.now();
      if (now - lastUpdate.current > 1000) {
        updateResult('gyroscope', { status: 'running', data });
        lastUpdate.current = now;
      }
    });

    const magSub = Magnetometer.addListener((data) => {
      setMag(data);
      // We can share the throttle timer or just update local state
      // Updating store for mag can also be throttled/skipped if gyro handles the "running" state
    });

    return () => {
      gyroSub.remove();
      magSub.remove();
    };
  }, [updateResult]);

  const markPass = () => {
    updateResult('gyroscope', { status: 'pass' });
    updateResult('magnetometer', { status: 'pass' });
  };
  const markFail = () => {
    updateResult('gyroscope', { status: 'fail', notes: 'Unexpected gyro data' });
    updateResult('magnetometer', { status: 'fail', notes: 'Unexpected magnetometer data' });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Gyroscope Live Data">
        <ResultsPanel
          items={[
            { label: 'X', value: gyro.x.toFixed(3), accent: 'warning' },
            { label: 'Y', value: gyro.y.toFixed(3), accent: 'warning' },
            { label: 'Z', value: gyro.z.toFixed(3), accent: 'warning' }
          ]}
        />
      </Panel>
      <Panel title="Compass / Magnetometer">
        <ResultsPanel
          items={[
            { label: 'X', value: mag.x.toFixed(2), accent: 'warning' },
            { label: 'Y', value: mag.y.toFixed(2), accent: 'warning' },
            { label: 'Z', value: mag.z.toFixed(2), accent: 'warning' }
          ]}
        />
        <Text className="mt-3 text-muted">Move device to see values change.</Text>
        <View className="mt-3 flex-row gap-3">
          <ActionButton label="Mark Pass" onPress={markPass} style={{ flex: 1 }} />
          <ActionButton label="Mark Fail" variant="ghost" onPress={markFail} style={{ flex: 1 }} />
        </View>
      </Panel>
    </ScrollView>
  );
}

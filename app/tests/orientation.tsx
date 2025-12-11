import { useEffect, useState, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function OrientationTest() {
  const [orientation, setOrientation] = useState<string>('UNKNOWN');
  const updateResult = useTestStore((s) => s.updateResult);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    const sub = ScreenOrientation.addOrientationChangeListener((evt) => {
      const name = ScreenOrientation.Orientation[evt.orientationInfo.orientation];
      setOrientation(name);

      const now = Date.now();
      if (now - lastUpdate.current > 1000) {
        updateResult('orientation', { status: 'running', data: { orientation: name } });
        lastUpdate.current = now;
      }
    });

    // Initial check
    ScreenOrientation.getOrientationAsync().then((o) => {
      setOrientation(ScreenOrientation.Orientation[o]);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub);
    };
  }, [updateResult]);

  const lock = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    updateResult('orientation', { status: 'running', notes: 'Locked to Portrait' });
  };

  const unlock = async () => {
    await ScreenOrientation.unlockAsync();
    updateResult('orientation', { status: 'running', notes: 'Unlocked' });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Orientation" subtitle="Rotate device to see changes">
        <View className="items-center py-6">
          <Text className="text-3xl font-bold text-primary" style={{ color: '#007AFF' }}>{orientation}</Text>
        </View>
        <View className="flex-row gap-3">
          <ActionButton label="Lock Portrait" variant="secondary" onPress={lock} style={{ flex: 1 }} />
          <ActionButton label="Unlock" variant="ghost" onPress={unlock} style={{ flex: 1 }} />
        </View>
        <View className="mt-6 flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('orientation', { status: 'pass' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('orientation', { status: 'fail' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

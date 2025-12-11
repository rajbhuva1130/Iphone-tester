import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function FlashlightTest() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    updateResult('flashlight', { status: 'running' });
    if (!permission) {
      requestPermission();
      return;
    }
    if (!permission.granted) {
      updateResult('flashlight', { status: 'warning', notes: 'Awaiting camera permission' });
    }
  }, [updateResult, permission]);

  const toggleTorch = () => {
    setTorch((prev) => {
      const next = !prev;
      updateResult('flashlight', { status: 'pass', data: { enabled: next } });
      return next;
    });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Flashlight" subtitle="Uses camera torch API">
        {permission?.granted === false && <Text className="text-warning mb-2" style={{ color: '#FFCC00' }}>Grant camera access to enable torch.</Text>}
        {Platform.OS === 'web' ? (
          <Text className="text-muted" style={{ color: '#a1a1aa' }}>Torch is not available on web; toggling will be simulated.</Text>
        ) : (
          <CameraView ref={cameraRef} style={{ height: 200, borderRadius: 12 }} enableTorch={torch} />
        )}
        <View className="mt-4 flex-row gap-3">
          <ActionButton label={torch ? 'Torch Off' : 'Torch On'} onPress={toggleTorch} />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('flashlight', { status: 'fail', notes: 'Torch not visible' })}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

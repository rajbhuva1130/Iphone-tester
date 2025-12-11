import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function CameraTest() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [torch, setTorch] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    if (!permission) {
      requestPermission();
      return;
    }
    if (permission.granted) {
      updateResult('camera', { status: 'running', data: { facing: facing } });
    }
  }, [permission, facing, updateResult]);

  const ensurePermission = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        updateResult('camera', { status: 'fail', notes: 'Camera permission denied' });
      }
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    setZoom(0); // Reset zoom on switch
  };

  const capture = async () => {
    if (Platform.OS === 'web') {
      updateResult('camera', { status: 'pass', notes: 'Camera simulated on web' });
      return;
    }
    try {
      await ensurePermission();
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5, base64: false });
      if (photo?.uri) {
        setPreview(photo.uri);
        updateResult('camera', {
          status: 'pass',
          data: { lastPhotoUri: photo.uri, facing }
        });
      }
    } catch (error) {
      console.error(error);
      updateResult('camera', { status: 'fail', notes: 'Capture failed' });
    }
  };

  // Simple zoom steps
  const setZoomLevel = (level: number) => setZoom(level);

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Camera Preview" subtitle="Toggle front/back, test torch, and capture a sample frame">
        {permission?.granted === false && (
          <TouchableOpacity onPress={ensurePermission}>
            <Text className="text-warning">Grant camera access to continue.</Text>
          </TouchableOpacity>
        )}
        {Platform.OS === 'web' ? (
          <View className="h-64 items-center justify-center rounded-2xl border border-border bg-black/50">
            <Text className="text-muted">Camera preview not available on PWA emulator.</Text>
          </View>
        ) : (
          <CameraView
            ref={cameraRef}
            style={{ height: 300, borderRadius: 16 }}
            className="overflow-hidden"
            facing={facing}
            enableTorch={torch}
            zoom={zoom}
            onMountError={() => updateResult('camera', { status: 'fail', notes: 'Camera mount error' })}
          />
        )}

        {/* specific controls (Zoom) */}
        {facing === 'back' && (
          <View className="flex-row justify-center gap-4 my-2">
            {[0, 0.01, 0.03, 0.1].map(z => (
              <TouchableOpacity
                key={z}
                onPress={() => setZoomLevel(z)}
                className={`px-3 py-1 rounded-full ${Math.abs(zoom - z) < 0.001 ? 'bg-primary' : 'bg-surface border border-border'}`}
              >
                <Text className="text-white text-xs">{z === 0 ? '1x' : (z * 10).toFixed(1) + 'x'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="mt-3 flex-row flex-wrap gap-3">
          <ActionButton label="Flip" variant="secondary" onPress={toggleFacing} style={{ flex: 1, minWidth: 80 }} />
          <ActionButton label={torch ? 'Off' : 'Torch'} variant="ghost" onPress={() => setTorch((t) => !t)} style={{ flex: 1, minWidth: 80 }} />
          <ActionButton label="Capture" onPress={capture} style={{ flex: 1, minWidth: 100 }} />
        </View>

        {preview && (
          <View className="mt-4">
            <Text className="mb-2 text-sm text-muted">Last capture</Text>
            <Image source={{ uri: preview }} style={{ height: 160, borderRadius: 12 }} />
          </View>
        )}

        <View className="mt-6 flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('camera', { status: 'pass' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('camera', { status: 'fail' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

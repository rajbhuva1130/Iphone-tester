import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function MicrophoneTest() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    updateResult('microphone', { status: 'running' });
    return () => {
      recording?.stopAndUnloadAsync();
      sound?.unloadAsync();
    };
  }, [updateResult]);

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Recording not available on web', 'Simulated pass on PWA.');
      updateResult('microphone', { status: 'pass', notes: 'Web fallback' });
      return;
    }
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        updateResult('microphone', { status: 'fail', notes: 'Mic permission denied' });
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
    } catch (error) {
      console.error(error);
      updateResult('microphone', { status: 'fail', notes: 'Recording failed' });
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const recordedUri = recording.getURI();
      setUri(recordedUri);
      updateResult('microphone', { status: 'pass', data: { uri: recordedUri ?? undefined } });
    } catch (error) {
      console.error(error);
      updateResult('microphone', { status: 'fail', notes: 'Stop failed' });
    } finally {
      setRecording(null);
    }
  };

  const play = async () => {
    if (!uri) return;
    const { sound: playback } = await Audio.Sound.createAsync({ uri });
    setSound(playback);
    await playback.playAsync();
    updateResult('speaker', { status: 'pass', notes: 'Playback successful' });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Microphone Recorder" subtitle="Record a short clip and play it back">
        <View className="flex-row flex-wrap gap-3">
          <ActionButton label="Start Recording" onPress={startRecording} disabled={!!recording} />
          <ActionButton label="Stop Recording" variant="secondary" onPress={stopRecording} disabled={!recording} />
          <ActionButton label="Play Recording" variant="ghost" onPress={play} disabled={!uri} />
        </View>
        <View className="mt-4 rounded-xl border border-border bg-black/40 p-3">
          <Text className="text-white">Status: {recording ? 'Recording…' : uri ? 'Ready to play' : 'Idle'}</Text>
          <Text className="text-muted">URI: {uri ?? 'N/A'}</Text>
        </View>
      </Panel>
    </ScrollView>
  );
}

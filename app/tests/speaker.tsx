import { useEffect, useState, useRef } from 'react';
import { Platform, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react-native';

export default function SpeakerTest() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const soundRef = useRef<Audio.Sound | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  // User instructions:
  // 1. Place your mp3 file in: assets/audio/test_audio.mp3
  // 2. Uncomment the line below and comment out the remote URI line
  // const SOURCE = { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }; 
  const SOURCE = require('../../assets/audio/Sample.mp3');

  useEffect(() => {
    loadAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true
      });
      const { sound } = await Audio.Sound.createAsync(
        SOURCE,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      updateResult('speaker', { status: 'running' });
    } catch (error) {
      console.log('Audio load error:', error);
      updateResult('speaker', { status: 'fail', notes: 'Failed to load audio' });
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);
      if (status.didJustFinish) {
        soundRef.current?.setPositionAsync(0);
        soundRef.current?.pauseAsync();
      }
    }
  };

  const togglePlayback = async () => {
    if (!soundRef.current) return;
    if (playing) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
      updateResult('speaker', { status: 'pass', notes: 'Audio played' });
    }
  };

  const seek = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Speaker Test" subtitle="Verify audio output with music playback">
        <Text className="text-muted mb-4">
          Replace `assets/audio/test_audio.mp3` with your own file to test specific frequencies.
        </Text>

        <View className="bg-surface rounded-xl p-4 items-center mb-4 border border-border">
          <Text className="text-xl font-bold text-white mb-2">Test Audio Track</Text>
          <Text className="text-muted text-sm mb-6">Stereo Separation Test</Text>

          <View className="w-full flex-row items-center gap-3 mb-2">
            <Text className="text-muted text-xs font-variant-numeric">{formatTime(position)}</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={seek}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#555"
              thumbTintColor="#3b82f6"
            />
            <Text className="text-muted text-xs font-variant-numeric">{formatTime(duration)}</Text>
          </View>

          <View className="flex-row items-center gap-8 mt-2">
            <TouchableOpacity onPress={() => seek(Math.max(0, position - 5000))}>
              <SkipBack size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayback}
              className="w-16 h-16 bg-primary rounded-full items-center justify-center"
            >
              {playing ? <Pause size={32} color="#fff" fill="#fff" /> : <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => seek(Math.min(duration, position + 5000))}>
              <SkipForward size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('speaker', { status: 'pass' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('speaker', { status: 'fail' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

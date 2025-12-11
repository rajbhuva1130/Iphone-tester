import { useEffect } from 'react';
import { ScrollView, Text, View, Vibration, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function VibrationTest() {
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    updateResult('vibration', { status: 'running' });
  }, [updateResult]);

  const hapticImpact = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) { console.warn(e); }
  };

  const vibrateStandard = () => {
    // Default vibration (approx 400ms on iOS, customizable on Android)
    Vibration.vibrate(400);
  };

  const vibrateLong = () => {
    // Pattern: [wait, vibrate, wait, vibrate]
    // iOS: Ignores duration in pattern, but follows wait/vib sequence of fixed duration?
    // Actually modern iOS does support patterns somewhat, or we can loop.
    // For iOS "long", a pattern of [0, 500, 200, 500, 200, 500] gives a 3-pulse sensation.
    const pattern = Platform.OS === 'android' ? [0, 1000] : [0, 400, 100, 400, 100, 400];
    Vibration.vibrate(pattern);
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Vibration / Haptics" subtitle="Trigger different vibration engines">
        <View className="gap-3 mb-6">
          <ActionButton label="Short Haptic (Impact)" variant="secondary" onPress={hapticImpact} />
          <ActionButton label="Standard Buzz" variant="secondary" onPress={vibrateStandard} />
          <ActionButton label="Long / Pattern" onPress={vibrateLong} />
        </View>

        <View className="flex-row gap-3">
          <ActionButton
            label="Mark Pass"
            onPress={() => updateResult('vibration', { status: 'pass', notes: 'Vibration verified' })}
            style={{ flex: 1 }}
          />
          <ActionButton
            label="Mark Fail"
            variant="ghost"
            onPress={() => updateResult('vibration', { status: 'fail', notes: 'No vibration' })}
            style={{ flex: 1 }}
          />
        </View>
      </Panel>
    </ScrollView>
  );
}

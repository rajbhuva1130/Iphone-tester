import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function ProximityTest() {
  const [near, setNear] = useState(false);
  const updateResult = useTestStore((s) => s.updateResult);

  const toggle = () => {
    setNear((prev) => {
      const next = !prev;
      updateResult('proximity', { status: 'pass', data: { near: next } });
      return next;
    });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Proximity Sensor" subtitle="Simulated for PWA / web">
        <Text className="mb-3 text-muted">
          Native proximity APIs are limited on web. Use this control to simulate near/far states and confirm UI reacts.
        </Text>
        <View className="flex-row gap-3">
          <ActionButton label={near ? 'Mark Far' : 'Mark Near'} onPress={toggle} />
          <ActionButton
            label="Fail"
            variant="ghost"
            onPress={() => updateResult('proximity', { status: 'fail', notes: 'Sensor stuck or UI unresponsive' })}
          />
        </View>
        <Text className="mt-3 text-white">Current state: {near ? 'Near' : 'Far'}</Text>
      </Panel>
    </ScrollView>
  );
}

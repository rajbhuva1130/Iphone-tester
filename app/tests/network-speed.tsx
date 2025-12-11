import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Panel from '../../components/Panel';
import ActionButton from '../../components/ActionButton';
import ResultsPanel from '../../components/ResultsPanel';
import { measurePing } from '../../utils/ping';
import { useTestStore } from '../../store/useTestStore';

export default function NetworkSpeedTest() {
  const [latency, setLatency] = useState<number | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  const runPing = async () => {
    const result = await measurePing();
    setLatency(result);
    updateResult('networkSpeed', {
      status: result === -1 ? 'fail' : 'pass',
      data: { latencyMs: result }
    });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="Network Speed" subtitle="Quick latency ping">
        <ActionButton label="Run Ping" onPress={runPing} />
        {latency !== null && (
          <View className="mt-4">
            <ResultsPanel
              items={[
                { label: 'Latency (ms)', value: latency === -1 ? 'Unreachable' : `${latency} ms`, accent: latency > 200 ? 'warning' : 'success' }
              ]}
            />
            <Text className="mt-2 text-muted">For full speed tests, use a dedicated network benchmarking app.</Text>
          </View>
        )}
      </Panel>
    </ScrollView>
  );
}

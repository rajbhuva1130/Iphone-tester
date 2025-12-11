import { useMemo, useState } from 'react';
import { Platform, ScrollView, Text, View, Alert } from 'react-native';
import { Link } from 'expo-router';
import TestCard from '../components/TestCard';
import Panel from '../components/Panel';
import ResultsPanel from '../components/ResultsPanel';
import ChatBubble from '../components/ChatBubble';
import ActionButton from '../components/ActionButton';
import { analyzeTestResults, generateReport } from '../ai/assistant';
import { useTestStore } from '../store/useTestStore';

type Message = { from: 'ai' | 'user'; message: string };

const testList = [
  { key: 'camera', title: 'Camera', description: 'Front/back preview & torch', href: '/tests/camera' },
  { key: 'microphone', title: 'Microphone', description: 'Record + playback', href: '/tests/microphone' },
  { key: 'speaker', title: 'Speaker', description: 'Test tone playback', href: '/tests/speaker' },
  { key: 'touch', title: 'Touch', description: 'Tap every cell in the grid', href: '/tests/touch' },
  { key: 'deadPixels', title: 'Dead Pixels', description: 'Cycle RGB screens', href: '/tests/dead-pixels' },
  { key: 'brightness', title: 'Brightness', description: 'Min/max sweep', href: '/tests/brightness' },
  { key: 'vibration', title: 'Vibration', description: 'Haptic feedback test', href: '/tests/vibration' },
  { key: 'gyroscope', title: 'Gyroscope & Compass', description: 'Live motion data', href: '/tests/gyroscope' },
  { key: 'accelerometer', title: 'Accelerometer', description: 'Live acceleration data', href: '/tests/accelerometer' },
  { key: 'gps', title: 'GPS', description: 'Current coordinates', href: '/tests/gps' },
  { key: 'wifi', title: 'WiFi & Connectivity', description: 'Network type & strength', href: '/tests/wifi' },
  { key: 'networkSpeed', title: 'Network Speed', description: 'Simple latency check', href: '/tests/network-speed' },
  { key: 'battery', title: 'Battery', description: 'Level and state', href: '/tests/battery' },
  { key: 'deviceInfo', title: 'Device Info', description: 'Model, OS, brand', href: '/tests/device-info' },
  { key: 'orientation', title: 'Orientation', description: 'Lock/unlock rotation', href: '/tests/orientation' },
  { key: 'flashlight', title: 'Flashlight', description: 'Toggle torch safely', href: '/tests/flashlight' },
  { key: 'proximity', title: 'Proximity', description: 'Simulated web proximity', href: '/tests/proximity' }
] as const;

export default function Index() {
  const { results } = useTestStore();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', message: 'Run tests, then ask me to summarize hardware health.' }
  ]);
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    const values = Object.values(results);
    return {
      completed: values.filter((r) => r.status === 'pass' || r.status === 'fail').length,
      passed: values.filter((r) => r.status === 'pass').length,
      failed: values.filter((r) => r.status === 'fail').length,
      total: values.length
    };
  }, [results]);

  const runAi = async () => {
    setLoading(true);
    const res = await analyzeTestResults(results);
    setMessages((prev) => [
      ...prev,
      { from: 'user', message: 'Analyze my latest hardware test results.' },
      {
        from: 'ai',
        message: [res.message, ...res.issues.map((i) => `- ${i.key}: ${i.summary}`), ...res.suggestions.map((s) => `• ${s}`)].join(
          '\n'
        )
      }
    ]);
    setLoading(false);
  };

  const downloadReport = (type: 'json' | 'txt') => {
    const payload = type === 'json' ? JSON.stringify(results, null, 2) : generateReport(results);
    if (Platform.OS === 'web') {
      const blob = new Blob([payload], { type: type === 'json' ? 'application/json' : 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'json' ? 'hardware-report.json' : 'hardware-report.txt';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      Alert.alert('Report generated', 'Report logged to console for copy/paste.');
      console.log(payload);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">iPhone Hardware Tester</Text>
        <Link href="/assistant" asChild>
          <Text className="text-primary underline">Open Assistant</Text>
        </Link>
      </View>

      <Panel title="Diagnostics Overview" subtitle="Run each card to verify hardware health">
        <ResultsPanel
          items={[
            { label: 'Total', value: totals.total },
            { label: 'Completed', value: totals.completed, accent: 'warning' },
            { label: 'Passed', value: totals.passed, accent: 'success' },
            { label: 'Failed', value: totals.failed, accent: 'danger' }
          ]}
        />
      </Panel>

      <View className="mb-6 flex flex-col gap-4">
        {testList.map((test) => {
          const status = (results as any)[test.key]?.status ?? 'pending';
          return (
            <TestCard key={test.key} title={test.title} description={test.description} href={test.href} status={status} />
          );
        })}
      </View>

      <Panel title="AI Assistant" subtitle="Summarize issues, get fixes, and export reports">
        <View className="mb-4">
          {messages.map((message, idx) => (
            <ChatBubble key={`${message.from}-${idx}`} from={message.from} message={message.message} />
          ))}
        </View>
        <View className="flex-row gap-3">
          <ActionButton label={loading ? 'Analyzing…' : 'Analyze Results'} onPress={runAi} disabled={loading} />
          <ActionButton label="Download TXT" variant="secondary" onPress={() => downloadReport('txt')} />
          <ActionButton label="Download JSON" variant="ghost" onPress={() => downloadReport('json')} />
        </View>
      </Panel>
    </ScrollView>
  );
}

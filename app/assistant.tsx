import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Panel from '../components/Panel';
import ChatBubble from '../components/ChatBubble';
import ActionButton from '../components/ActionButton';
import { analyzeTestResults } from '../ai/assistant';
import { useTestStore } from '../store/useTestStore';

type Message = { from: 'ai' | 'user'; message: string };

export default function AssistantScreen() {
  const { results } = useTestStore();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', message: 'Ask anything about your diagnostics. I can spot trends and suggest fixes.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { from: 'user', message: userMessage }]);
    setLoading(true);
    const ai = await analyzeTestResults(results);
    setMessages((prev) => [
      ...prev,
      {
        from: 'ai',
        message: `${ai.message}\n${ai.issues.map((i) => `- ${i.key}: ${i.summary}`).join('\n')}\n${ai.suggestions.join('\n')}`
      }
    ]);
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="AI Assistant">
        {messages.map((m, idx) => (
          <ChatBubble key={`${m.from}-${idx}`} from={m.from} message={m.message} />
        ))}
        <View className="mt-3 gap-2 rounded-xl border border-border bg-surface/80 p-3">
          <Text className="text-sm text-muted">Message</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about battery, sensors, connectivity..."
            placeholderTextColor="#71717a"
            className="rounded-lg border border-border bg-black/30 px-3 py-2 text-white"
            multiline
          />
          <ActionButton label={loading ? 'Thinking…' : 'Send'} onPress={send} disabled={loading} />
        </View>
      </Panel>
    </ScrollView>
  );
}

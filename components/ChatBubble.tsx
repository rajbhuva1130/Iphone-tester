import { View, Text } from 'react-native';

type ChatBubbleProps = {
  message: string;
  from?: 'ai' | 'user';
};

const ChatBubble = ({ message, from = 'ai' }: ChatBubbleProps) => {
  const isAi = from === 'ai';
  return (
    <View className={`mb-3 flex-row ${isAi ? 'justify-start' : 'justify-end'}`}>
      <View
        className={`max-w-[85%] rounded-2xl border px-4 py-3 ${
          isAi ? 'rounded-tl-sm border-primary/30 bg-surface' : 'rounded-tr-sm border-border bg-primary/80'
        }`}
      >
        <Text className="text-white">{message}</Text>
      </View>
    </View>
  );
};

export default ChatBubble;

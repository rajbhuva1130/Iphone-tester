import { View, Text } from 'react-native';

type Item = { label: string; value: string | number; accent?: 'success' | 'danger' | 'warning' | 'muted' };

type Props = {
  title?: string;
  items: Item[];
};

const colorMap = {
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  muted: 'text-muted'
};

const ResultsPanel = ({ title, items }: Props) => {
  return (
    <View className="rounded-2xl border border-border bg-surface/80 p-4">
      {title && <Text className="mb-2 text-base font-semibold text-white">{title}</Text>}
      {items.map((item) => (
        <View key={item.label} className="flex-row items-center justify-between py-1">
          <Text className="text-sm text-muted">{item.label}</Text>
          <Text className={`text-sm font-semibold ${item.accent ? colorMap[item.accent] : 'text-white'}`}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ResultsPanel;

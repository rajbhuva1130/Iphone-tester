import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { TestStatus } from '../store/useTestStore';

type Props = {
  title: string;
  description: string;
  href: string;
  status?: TestStatus;
};

const statusColor: Record<TestStatus, string> = {
  pass: 'text-success',
  fail: 'text-danger',
  running: 'text-warning',
  pending: 'text-muted',
  warning: 'text-warning',
  skipped: 'text-muted'
};

const statusLabel: Record<TestStatus, string> = {
  pass: 'Pass',
  fail: 'Fail',
  running: 'Running',
  pending: 'Pending',
  warning: 'Warning',
  skipped: 'Skipped'
};

const TestCard = ({ title, description, href, status = 'pending' }: Props) => {
  return (
    <Link href={href as any} asChild>
      <Pressable className="w-full rounded-2xl border border-border bg-surface/80 p-4 shadow-md shadow-black/30">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-white" style={{ color: 'white' }}>{title}</Text>
          <Text className={`text-xs font-medium ${statusColor[status]}`}>{statusLabel[status]}</Text>
        </View>
        <Text className="text-sm text-muted" style={{ color: 'rgba(235, 235, 245, 0.6)' }}>{description}</Text>
      </Pressable>
    </Link>
  );
};

export default TestCard;

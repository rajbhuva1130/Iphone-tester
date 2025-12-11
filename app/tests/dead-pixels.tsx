import { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View, Text } from 'react-native';
import { useTestStore } from '../../store/useTestStore';

const colors = ['#ff0000', '#00ff00', '#0000ff', '#000000', '#ffffff'];

export default function DeadPixels() {
  const [index, setIndex] = useState(0);
  const updateResult = useTestStore((s) => s.updateResult);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    updateResult('deadPixels', { status: 'running', notes: 'Cycle colors and check for stuck pixels' });
  }, [updateResult]);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % colors.length), 2000);
    return () => clearInterval(timer);
  }, []);

  const markPass = () => updateResult('deadPixels', { status: 'pass', notes: 'No dead pixels seen' });
  const markFail = () => updateResult('deadPixels', { status: 'fail', notes: 'Dead pixel suspected' });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIndex((i) => (i + 1) % colors.length)}
      style={{ width, height, backgroundColor: colors[index] }}
      className="items-center justify-center"
    >
      <View className="absolute bottom-10 flex-row gap-4 rounded-full bg-black/60 px-4 py-2">
        <Text className="text-white">Tap to cycle colors • Long press to exit</Text>
      </View>
      <View className="absolute top-10 flex-row gap-4">
        <TouchableOpacity onPress={markPass} className="rounded-full bg-black/60 px-4 py-2">
          <Text className="text-success">Mark Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={markFail} className="rounded-full bg-black/60 px-4 py-2">
          <Text className="text-danger">Mark Fail</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

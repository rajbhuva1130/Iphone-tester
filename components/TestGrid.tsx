import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  size?: number;
  touched: Set<number>;
  onToggle: (index: number) => void;
};

const TestGrid = ({ size = 5, touched, onToggle }: Props) => {
  const cells = useMemo(() => Array.from({ length: size * size }, (_, i) => i), [size]);

  return (
    <View className="aspect-square w-full flex-row flex-wrap rounded-2xl border border-border bg-black/60">
      {cells.map((index) => {
        const isActive = touched.has(index);
        const sizePercent = `${100 / size}%`;
        return (
          <TouchableOpacity
            key={index}
            style={{ width: sizePercent as any, height: sizePercent as any }}
            className={`border border-border/40 ${isActive ? 'bg-primary' : 'bg-surface'}`}
            onPress={() => onToggle(index)}
            activeOpacity={0.7}
          />
        );
      })}
    </View>
  );
};

export default TestGrid;

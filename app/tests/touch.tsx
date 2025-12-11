import { useRef, useState, useMemo } from 'react';
import { View, Text, PanResponder, Dimensions, SafeAreaView } from 'react-native';
import { useTestStore } from '../../store/useTestStore';
import ActionButton from '../../components/ActionButton';
import { Stack } from 'expo-router';

const { width, height } = Dimensions.get('window');
const COLUMNS = 9;
const CELL_SIZE = width / COLUMNS;
const ROWS = Math.floor((height - 150) / CELL_SIZE); // Reserve space for header/footer
const TOTAL_CELLS = COLUMNS * ROWS;

export default function TouchTest() {
  const [touched, setTouched] = useState<Set<number>>(new Set());
  const updateResult = useTestStore((s) => s.updateResult);

  // We use a ref to track touched cells during a gesture to avoid excessive state updates causing lag during the gesture itself
  // However, for visual feedback, we do need to update state. 
  // Optimization: Debounce or just rely on React's batching.

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
    })
  ).current;

  const handleTouch = (x: number, y: number) => {
    // Determine which cell was touched based on coordinates
    // Adjust y to account for the view's position if needed, but here we cover most of the screen
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (col >= 0 && col < COLUMNS && row >= 0 && row < ROWS) {
      const index = row * COLUMNS + col;
      setTouched((prev) => {
        if (!prev.has(index)) {
          const next = new Set(prev);
          next.add(index);
          // Check progress
          const completed = next.size;
          updateResult('touch', {
            status: completed === TOTAL_CELLS ? 'pass' : 'running',
            data: { completed, total: TOTAL_CELLS }
          });
          return next;
        }
        return prev;
      });
    }
  };

  const reset = () => {
    setTouched(new Set());
    updateResult('touch', { status: 'pending', data: { completed: 0, total: TOTAL_CELLS } });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="px-4 py-2 flex-row justify-between items-center z-10 bg-background/90">
        <Text className="text-white font-bold" style={{ color: 'white' }}>Touch Test</Text>
        <Text className="text-muted text-xs" style={{ color: '#a1a1aa' }}>
          {touched.size} / {TOTAL_CELLS}
        </Text>
      </View>

      <View
        className="flex-1 flex-wrap flex-row content-start"
        {...panResponder.panHandlers}
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => (
          <View
            key={i}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: touched.has(i) ? '#4ade80' : '#333', // pass green or gray
              borderWidth: 0.5,
              borderColor: '#000'
            }}
          />
        ))}
      </View>

      <View className="p-4 flex-row gap-4 bg-background z-10">
        <ActionButton label="Reset" variant="secondary" onPress={reset} style={{ flex: 1 }} />
        <ActionButton
          label="Pass"
          onPress={() => updateResult('touch', { status: 'pass' })}
          style={{ flex: 1 }}
        />
        <ActionButton
          label="Fail"
          variant="ghost"
          onPress={() => updateResult('touch', { status: 'fail' })}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

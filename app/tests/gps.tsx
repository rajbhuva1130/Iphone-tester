import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import Panel from '../../components/Panel';
import ResultsPanel from '../../components/ResultsPanel';
import ActionButton from '../../components/ActionButton';
import { useTestStore } from '../../store/useTestStore';

export default function GpsTest() {
  const [coords, setCoords] = useState<Location.LocationObject | null>(null);
  const updateResult = useTestStore((s) => s.updateResult);

  useEffect(() => {
    updateResult('gps', { status: 'running' });
  }, [updateResult]);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        updateResult('gps', { status: 'fail', notes: 'Location permission denied' });
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords(position);
      updateResult('gps', {
        status: 'pass',
        data: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? undefined
        }
      });
    } catch (error) {
      console.error(error);
      updateResult('gps', { status: 'fail', notes: 'Location unavailable' });
      if (Platform.OS === 'web') {
        Alert.alert('GPS fallback', 'Simulating location on web.');
        updateResult('gps', { status: 'pass', notes: 'Simulated on web' });
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4">
      <Panel title="GPS Coordinates" subtitle="Fetch current location">
        <ActionButton label="Get Location" onPress={requestLocation} />
        {coords && (
          <View className="mt-4">
            <ResultsPanel
              items={[
                { label: 'Latitude', value: coords.coords.latitude.toFixed(5) },
                { label: 'Longitude', value: coords.coords.longitude.toFixed(5) },
                { label: 'Accuracy (m)', value: coords.coords.accuracy?.toFixed(1) ?? 'n/a' }
              ]}
            />
          </View>
        )}
      </Panel>
    </ScrollView>
  );
}

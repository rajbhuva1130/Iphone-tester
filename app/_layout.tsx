import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#09090b' },
                    headerTintColor: '#f4f4f5',
                    headerTitleStyle: { fontWeight: '600' },
                    contentStyle: { backgroundColor: '#09090b' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Hardware Tester' }} />
                <Stack.Screen name="assistant" options={{ title: 'AI Assistant', presentation: 'modal' }} />
                <Stack.Screen name="tests/camera" options={{ title: 'Camera Test' }} />
                <Stack.Screen name="tests/microphone" options={{ title: 'Microphone Test' }} />
                <Stack.Screen name="tests/speaker" options={{ title: 'Speaker Test' }} />
                <Stack.Screen name="tests/vibration" options={{ title: 'Vibration' }} />
                <Stack.Screen name="tests/brightness" options={{ title: 'Brightness' }} />
                <Stack.Screen name="tests/dead-pixels" options={{ title: 'Dead Pixels', headerShown: false }} />
                <Stack.Screen name="tests/touch" options={{ title: 'Touch Test', headerShown: false }} />
                <Stack.Screen name="tests/gyroscope" options={{ title: 'Gyroscope & Compass' }} />
                <Stack.Screen name="tests/accelerometer" options={{ title: 'Accelerometer' }} />
                <Stack.Screen name="tests/gps" options={{ title: 'GPS' }} />
                <Stack.Screen name="tests/wifi" options={{ title: 'WiFi & Connectivity' }} />
                <Stack.Screen name="tests/network-speed" options={{ title: 'Network Speed' }} />
                <Stack.Screen name="tests/flashlight" options={{ title: 'Flashlight' }} />
                <Stack.Screen name="tests/battery" options={{ title: 'Battery' }} />
                <Stack.Screen name="tests/device-info" options={{ title: 'Device Info' }} />
                <Stack.Screen name="tests/orientation" options={{ title: 'Orientation' }} />
                <Stack.Screen name="tests/proximity" options={{ title: 'Proximity' }} />
            </Stack>
        </SafeAreaProvider>
    );
}

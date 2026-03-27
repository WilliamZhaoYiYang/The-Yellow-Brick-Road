import { Stack } from 'expo-router';
import { PedometerProvider } from '../context/PedometerContext';

export default function RootLayout() {
    return (
        <PedometerProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="journey" />
                <Stack.Screen name="stats" />
            </Stack>
        </PedometerProvider>
    );
}
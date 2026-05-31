import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(authentication)" />
        <Stack.Screen name="(tabs)" />  {/* ✅ this fixes "Unknown child element" */}
      </Stack>
    </>
  );
}
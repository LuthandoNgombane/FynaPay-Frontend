import { Stack } from 'expo-router';

export default function Layout() {
  return (
    // "headerShown: false" hides the default top bar so your custom UI looks better
    <Stack screenOptions={{ headerShown: false }} />
  );
}
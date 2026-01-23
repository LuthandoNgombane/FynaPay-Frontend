import { Stack } from 'expo-router';

export default function Layout() {
  return (
    //LN -  "headerShown: false" hides the default top bar so your custom UI looks better
    <Stack screenOptions={{ headerShown: false }} />
  );
}
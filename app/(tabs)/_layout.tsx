import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarButton: HapticTab, tabBarStyle: { height: 58 + bottomPadding, paddingTop: 7, paddingBottom: bottomPadding, backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 0.5 }, tabBarLabelStyle: { fontFamily: 'Mulish', fontSize: 10, fontWeight: '700' } }}>
    <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={22} color={color} /> }} />
    <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color }) => <IconSymbol name="magnifyingglass" size={22} color={color} /> }} />
    <Tabs.Screen name="gallery" options={{ title: 'Gallery', tabBarIcon: ({ color }) => <IconSymbol name="photo.fill" size={22} color={color} /> }} />
    <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <IconSymbol name="book.fill" size={22} color={color} /> }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <IconSymbol name="person.fill" size={22} color={color} /> }} />
  </Tabs>;
}

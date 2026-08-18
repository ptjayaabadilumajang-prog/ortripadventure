import { Linking, Platform, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { officialContacts } from '@/lib/demo-data';

export function openWhatsApp(message = 'Halo Or.Trip Adventure, saya ingin bertanya tentang booking trip.') {
  return Linking.openURL(`https://wa.me/${officialContacts.whatsapp}?text=${encodeURIComponent(message)}`);
}

export function WhatsAppFab() {
  return <Pressable accessibilityLabel="Chat WhatsApp Or.Trip Adventure" onPress={() => openWhatsApp()} style={({ pressed }) => [{ position: Platform.OS === 'web' ? 'fixed' : 'absolute', right: 18, bottom: Platform.OS === 'web' ? 76 : 28, zIndex: 50, flexDirection: 'row', alignItems: 'center', borderRadius: 999, backgroundColor: '#1F8F45', paddingHorizontal: 14, paddingVertical: 12, shadowColor: '#1A251B', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 6, opacity: pressed ? 0.82 : 1 }]}><IconSymbol name="phone.fill" size={17} color="#FFFFFF" /><Text className="ml-2 font-body text-xs font-extrabold text-white">WhatsApp</Text></Pressable>;
}

export function LegalLinks() {
  return <View className="mt-5 flex-row flex-wrap"><Pressable onPress={() => router.push('/legal' as any)}><Text className="font-body text-xs font-bold text-primary">Privacy Policy</Text></Pressable><Text className="mx-2 font-body text-xs text-muted">·</Text><Pressable onPress={() => router.push('/legal?section=terms' as any)}><Text className="font-body text-xs font-bold text-primary">Booking Terms & Conditions</Text></Pressable></View>;
}

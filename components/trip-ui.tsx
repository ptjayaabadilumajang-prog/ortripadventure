import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatIDR, type Trip } from '@/lib/demo-data';

export function SectionHeader({ title, action = 'Lihat semua', onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <View className="mb-3 flex-row items-center justify-between"><Text className="font-heading text-xl font-bold text-foreground">{title}</Text>{onAction ? <Pressable onPress={onAction} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}><Text className="font-body text-xs font-bold text-primary">{action}</Text></Pressable> : null}</View>;
}

export function Pill({ label, active = false, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, borderRadius: 999, borderWidth: 1, borderColor: active ? '#2D5A27' : '#D5DED5', backgroundColor: active ? '#2D5A27' : '#FFFFFF', paddingHorizontal: 16, paddingVertical: 9, marginRight: 8 }]}><Text className={`font-body text-xs font-bold ${active ? 'text-white' : 'text-muted'}`}>{label}</Text></Pressable>;
}

export function TripCard({ trip, compact = false }: { trip: Trip; compact?: boolean }) {
  return <Pressable onPress={() => router.push(`/trip/${trip.id}`)} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, width: compact ? 288 : '100%', marginRight: compact ? 16 : 0, marginBottom: compact ? 0 : 16, overflow: 'hidden', borderRadius: 24, backgroundColor: '#FFFFFF' }]}><View className="relative"><Image source={{ uri: trip.image }} contentFit="cover" transition={250} style={{ width: '100%', height: compact ? 170 : 190 }} /><View className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1"><Text className="font-body text-[10px] font-bold text-white">{trip.type}</Text></View><View className="absolute bottom-3 right-3 flex-row items-center rounded-full bg-white/90 px-2 py-1"><IconSymbol name="star.fill" size={12} color="#B7791F" /><Text className="ml-1 font-body text-[10px] font-bold text-foreground">{trip.rating}</Text></View></View><View className="p-4"><Text className="font-body text-[11px] font-bold uppercase tracking-widest text-primary">{trip.tag}</Text><Text numberOfLines={2} className="mt-1 font-heading text-lg font-bold leading-6 text-foreground">{trip.title}</Text><View className="mt-2 flex-row items-center"><IconSymbol name="location.fill" size={14} color="#617064" /><Text className="ml-1 flex-1 font-body text-xs text-muted">{trip.location}</Text></View><View className="mt-3 flex-row items-end justify-between"><View><Text className="font-body text-[10px] text-muted">Mulai dari</Text><Text className="font-body text-base font-extrabold text-primary">{formatIDR(trip.price)}</Text></View><View className="items-end"><Text className="font-body text-[10px] text-muted">{trip.date}</Text><Text className="font-body text-[10px] font-bold text-foreground">{trip.seats} kursi tersisa</Text></View></View></View></Pressable>;
}

export function PrimaryButton({ label, onPress, icon = 'arrow.right', disabled = false }: { label: string; onPress: () => void; icon?: any; disabled?: boolean }) {
  return <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: disabled ? '#A3C9A8' : '#2D5A27', paddingHorizontal: 20, paddingVertical: 16, opacity: pressed ? 0.85 : 1 }]}><Text className="font-body text-sm font-extrabold text-white">{label}</Text><IconSymbol name={icon} size={17} color="#FFFFFF" style={{ marginLeft: 8 }} /></Pressable>;
}

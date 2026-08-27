import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pill, SectionHeader, TripCard } from '@/components/trip-ui';
import { trpc } from '@/lib/trpc';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Semua');
  const { data: tripsData } = trpc.trips.list.useQuery();
  
  const trips = useMemo(() => (tripsData || []).map(t => ({
    id: t.slug,
    title: t.title,
    location: t.location || "",
    province: "Jawa Timur",
    type: t.type,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    date: 'Tersedia',
    duration: '2 hari 1 malam',
    difficulty: 'Pemula' as const,
    price: parseFloat(t.priceBase.toString()),
    seats: 12,
    rating: 4.8,
    tag: 'Verified',
    description: t.description || "",
    includes: [],
    itinerary: [],
    faqs: [],
  })), [tripsData]);

  const filtered = useMemo(() => trips.filter((trip) => (type === 'Semua' || trip.type === type) && `${trip.title} ${trip.location}`.toLowerCase().includes(query.toLowerCase())), [query, type, trips]);
  return <ScreenContainer className="bg-background" safeAreaClassName="bg-background"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 36 }}>
    <Text className="font-body text-xs font-bold uppercase tracking-[3px] text-primary">JELAJAH TRIP</Text><Text className="mt-2 font-heading text-3xl font-bold text-foreground">Pilih cara kamu pergi.</Text><Text className="mt-2 font-body text-sm leading-5 text-muted">Trip kecil, informasi jelas, dan ruang untuk menikmati perjalanan.</Text>
    <View className="mt-5 flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3"><IconSymbol name="magnifyingglass" size={19} color="#617064" /><TextInput value={query} onChangeText={setQuery} placeholder="Cari Bromo, Semeru, Ijen..." placeholderTextColor="#8A978B" className="ml-3 flex-1 font-body text-sm text-foreground" /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4"><Pill label="Semua" active={type === 'Semua'} onPress={() => setType('Semua')} /><Pill label="Open Trip" active={type === 'Open Trip'} onPress={() => setType('Open Trip')} /><Pill label="Private Trip" active={type === 'Private Trip'} onPress={() => setType('Private Trip')} /></ScrollView>
    <View className="mt-7"><SectionHeader title={`${filtered.length} pengalaman tersedia`} action="Filter" /><View className="flex-row flex-wrap"><Pill label="Pemula" /><Pill label="≤ 2 hari" /><Pill label="Jawa Timur" /></View></View>
    <View className="mt-5">{filtered.map((trip) => <TripCard key={trip.id} trip={trip} />)}</View>
  </ScrollView></ScreenContainer>;
}

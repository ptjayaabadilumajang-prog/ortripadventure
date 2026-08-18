import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { Pill, SectionHeader } from '@/components/trip-ui';
import { gallery } from '@/lib/demo-data';

export default function GalleryScreen() {
  const [category, setCategory] = useState('Semua');
  const categories = ['Semua', 'Sunrise', 'Pendakian', 'Camping', 'Group', 'Landscape'];
  const items = category === 'Semua' ? gallery : gallery.filter((item) => item.category === category);
  return <ScreenContainer className="bg-background" safeAreaClassName="bg-background"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 36 }}><Text className="font-body text-xs font-bold uppercase tracking-[3px] text-primary">MOMEN PERJALANAN</Text><Text className="mt-2 font-heading text-3xl font-bold text-foreground">Cerita yang dibawa pulang.</Text><Text className="mt-2 font-body text-sm leading-5 text-muted">Lihat jejak perjalanan teman-teman Or.Trip di berbagai lanskap Indonesia.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-5">{categories.map((item) => <Pill key={item} label={item} active={category === item} onPress={() => setCategory(item)} />)}</ScrollView><View className="mt-7"><SectionHeader title="Visual diary" action="" /><View className="flex-row flex-wrap justify-between">{items.map((item, index) => <View key={item.id} className={`mb-4 overflow-hidden rounded-3xl bg-surface ${index % 3 === 0 ? 'w-full' : 'w-[48%]'}`}><Image source={{ uri: item.image }} contentFit="cover" style={{ width: '100%', height: index % 3 === 0 ? 230 : 170 }} /><View className="p-3"><Text className="font-body text-[10px] font-bold uppercase tracking-wider text-primary">{item.category}</Text><Text className="mt-1 font-heading text-base font-bold text-foreground">{item.title}</Text></View></View>)}</View></View></ScrollView></ScreenContainer>;
}

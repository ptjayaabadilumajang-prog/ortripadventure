import { useMemo, useState } from 'react';
import { Pressable, Text, View, Image, ScrollView, Linking } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ranuRoute } from '@/lib/demo-data';

export function RanuRouteMap() {
  const [selectedId, setSelectedId] = useState(ranuRoute[0].id);
  const selected = useMemo(() => ranuRoute.find((point) => point.id === selectedId) ?? ranuRoute[0], [selectedId]);
  const positions = ['left-[8%] top-[75%]', 'left-[28%] top-[56%]', 'left-[43%] top-[35%]', 'left-[72%] top-[13%]'];

  const openInMaps = (url?: string) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View className="mt-7">
      <View className="mb-3 flex-row items-end justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-heading text-xl font-bold text-foreground">Rute perjalanan</Text>
          <Text className="mt-1 font-body text-xs leading-5 text-muted">Ikuti jalur dari Ranu Pani menuju camping ground Ranu Kumbolo.</Text>
        </View>
        <View className="flex-row items-center rounded-full bg-[#E2E8E2] px-3 py-2">
          <IconSymbol name="map.fill" size={14} color="#2D5A27" />
          <Text className="ml-1 font-body text-[10px] font-extrabold text-primary">{ranuRoute.length} titik</Text>
        </View>
      </View>

      <View className="overflow-hidden rounded-3xl border border-border bg-[#DCE7DC] p-4" style={{ height: 285 }}>
        <View className="relative flex-1 overflow-hidden rounded-2xl bg-[#C8DCC9]">
          <View className="absolute -left-10 top-10 h-40 w-40 rounded-full border-[18px] border-[#B6CFB8]/80" />
          <View className="absolute -right-14 bottom-0 h-52 w-52 rounded-full border-[22px] border-[#B6CFB8]/70" />
          <View className="absolute left-[18%] top-[18%] h-[62%] w-[52%] rotate-[24deg] rounded-[50%] border-4 border-primary/80" />
          
          {ranuRoute.map((point, index) => (
            <Pressable 
              key={point.id} 
              onPress={() => setSelectedId(point.id)} 
              className={`absolute ${positions[index]} items-center`}
            >
              <View className={`h-7 w-7 items-center justify-center rounded-full border-2 border-white ${selectedId === point.id ? 'bg-[#1A251B]' : 'bg-primary'}`}>
                <Text className="font-body text-[10px] font-extrabold text-white">{index + 1}</Text>
              </View>
              <Text className="mt-1 rounded-full bg-white/85 px-2 py-1 font-body text-[9px] font-extrabold text-foreground">
                {point.shortLabel}
              </Text>
            </Pressable>
          ))}
          
          <View className="absolute bottom-3 left-3 rounded-xl bg-white/85 px-3 py-2">
            <Text className="font-body text-[9px] font-bold text-muted">Peta rute ilustratif</Text>
            <Text className="mt-0.5 font-body text-[9px] text-muted">Tap titik untuk detail</Text>
          </View>
        </View>
      </View>

      <View className="mt-3 rounded-2xl border border-border bg-surface p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="font-body text-xs font-extrabold uppercase tracking-widest text-primary">Titik terpilih</Text>
            <Text className="mt-1 font-heading text-lg font-bold text-foreground">{selected.label}</Text>
          </View>
          {selected.mapsUrl && (
            <Pressable 
              onPress={() => openInMaps(selected.mapsUrl)}
              className="flex-row items-center rounded-full bg-primary/10 px-3 py-1.5"
            >
              <IconSymbol name="location.fill" size={12} color="#2D5A27" />
              <Text className="ml-1 font-body text-[10px] font-extrabold text-primary">Maps</Text>
            </Pressable>
          )}
        </View>

        {selected.stats && (
          <View className="mt-3 flex-row items-center border-y border-border py-2">
            <View className="flex-1 flex-row items-center">
              <IconSymbol name="arrow.up.right" size={12} color="#617064" />
              <Text className="ml-1 font-body text-[10px] text-muted">{selected.stats.distance}</Text>
            </View>
            <View className="flex-1 flex-row items-center">
              <IconSymbol name="mountain.2.fill" size={12} color="#617064" />
              <Text className="ml-1 font-body text-[10px] text-muted">{selected.stats.elevation}</Text>
            </View>
            <View className="flex-1 flex-row items-center">
              <IconSymbol name="clock.fill" size={12} color="#617064" />
              <Text className="ml-1 font-body text-[10px] text-muted">{selected.stats.duration}</Text>
            </View>
          </View>
        )}

        <Text className="mt-2 font-body text-xs leading-5 text-muted">{selected.description}</Text>
        
        {selected.images && selected.images.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mt-3"
          >
            {selected.images.map((img, i) => (
              <Image 
                key={i} 
                source={{ uri: img }} 
                className="mr-2 h-16 w-24 rounded-lg bg-neutral"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View className="mt-3 flex-row flex-wrap">
        {ranuRoute.map((point, index) => (
          <Pressable 
            key={point.id} 
            onPress={() => setSelectedId(point.id)} 
            className={`mb-2 mr-2 flex-row items-center rounded-full border px-3 py-2 ${selectedId === point.id ? 'border-primary bg-[#E2E8E2]' : 'border-border bg-surface'}`}
          >
            <View className={`h-2 w-2 rounded-full ${index === ranuRoute.length - 1 ? 'bg-[#1A251B]' : 'bg-primary'}`} />
            <Text className="ml-2 font-body text-[10px] font-extrabold text-foreground">{point.shortLabel}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { journals } from '@/lib/demo-data';

export default function JournalScreen() {
  return <ScreenContainer className="bg-background" safeAreaClassName="bg-background"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 36 }}><Text className="font-body text-xs font-bold uppercase tracking-[3px] text-primary">OR.TRIP JOURNAL</Text><Text className="mt-2 font-heading text-3xl font-bold text-foreground">Bekal sebelum berangkat.</Text><Text className="mt-2 font-body text-sm leading-5 text-muted">Catatan destinasi, persiapan, dan cerita yang membuat perjalanan terasa lebih bermakna.</Text><View className="mt-7">{journals.map((article, index) => <Pressable key={article.id} onPress={() => router.push(`/journal/${article.id}`)} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]} className="mb-5 overflow-hidden rounded-3xl bg-surface"><Image source={{ uri: article.image }} contentFit="cover" style={{ width: '100%', height: index === 0 ? 210 : 170 }} /><View className="p-4"><View className="flex-row items-center justify-between"><Text className="font-body text-[10px] font-extrabold uppercase tracking-widest text-primary">{article.category}</Text><View className="flex-row items-center"><IconSymbol name="book.fill" size={13} color="#617064" /><Text className="ml-1 font-body text-[10px] text-muted">{article.readTime}</Text></View></View><Text className="mt-2 font-heading text-xl font-bold leading-6 text-foreground">{article.title}</Text><Text className="mt-2 font-body text-xs leading-5 text-muted">{article.excerpt}</Text></View></Pressable>)}</View></ScrollView></ScreenContainer>;
}

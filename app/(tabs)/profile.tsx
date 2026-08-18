import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';

const items = [
  { icon: 'calendar', title: 'Booking saya', body: 'Lihat status dan detail perjalanan', route: '/booking-success' },
  { icon: 'shield.fill', title: 'Aturan pendakian', body: 'Panduan aman untuk Semeru & Bromo', route: '/rules' },
  { icon: 'phone.fill', title: 'Bicara dengan tim', body: 'Kami siap membantu via WhatsApp', route: '/private-trip' },
];

export default function ProfileScreen() {
  return <ScreenContainer className="bg-background" safeAreaClassName="bg-background"><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 36 }}><View className="flex-row items-center"><View className="h-16 w-16 items-center justify-center rounded-3xl bg-primary"><Text className="font-heading text-2xl font-bold text-white">O</Text></View><View className="ml-4"><Text className="font-body text-xs font-bold uppercase tracking-widest text-primary">OR.TRIP ADVENTURE</Text><Text className="mt-1 font-heading text-2xl font-bold text-foreground">Ruang perjalananmu</Text></View></View><View className="mt-8 rounded-3xl bg-primary p-5"><Text className="font-body text-xs font-bold uppercase tracking-widest text-accent">TRUSTED ADVENTURE PARTNER</Text><Text className="mt-2 font-heading text-2xl font-bold leading-8 text-white">Pergi dengan persiapan yang lebih tenang.</Text><Text className="mt-2 font-body text-xs leading-5 text-white/80">Simpan booking, cek aturan, dan hubungi tim kapan pun kamu butuh bantuan.</Text></View><View className="mt-7">{items.map((item) => <Pressable key={item.title} onPress={() => router.push(item.route as any)} className="mb-3 flex-row items-center rounded-3xl border border-border bg-surface p-4"><View className="h-11 w-11 items-center justify-center rounded-2xl bg-neutral"><IconSymbol name={item.icon as any} size={21} color="#2D5A27" /></View><View className="ml-3 flex-1"><Text className="font-body text-sm font-extrabold text-foreground">{item.title}</Text><Text className="mt-1 font-body text-xs text-muted">{item.body}</Text></View><IconSymbol name="chevron.right" size={18} color="#617064" /></Pressable>)}</View><Text className="mt-6 font-body text-xs leading-5 text-muted">Versi demo lokal · Harga, jadwal, dan kuota pada aplikasi ini merupakan data contoh yang siap dihubungkan ke backend operasional.</Text></ScrollView></ScreenContainer>;
}

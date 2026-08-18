import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pill, PrimaryButton, SectionHeader, TripCard } from '@/components/trip-ui';
import { trips } from '@/lib/demo-data';
import { LegalLinks, openWhatsApp } from '@/components/whatsapp-fab';

export default function HomeScreen() {
  return (
    <ScreenContainer className="bg-background" safeAreaClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
        <View className="px-5 pb-4 pt-3">
          <View className="flex-row items-center justify-between">
            <View><Text className="font-body text-xs font-bold tracking-widest text-primary">OR.TRIP ADVENTURE</Text><Text className="mt-1 font-heading text-2xl font-bold text-foreground">Halo, petualang.</Text></View>
            <Pressable onPress={() => router.push('/booking-success')} className="h-11 w-11 items-center justify-center rounded-full bg-surface"><IconSymbol name="bell.fill" size={21} color="#2D5A27" /></Pressable>
          </View>
          <View className="mt-5 flex-row items-center rounded-2xl border border-border bg-surface px-4 py-3"><IconSymbol name="magnifyingglass" size={20} color="#617064" /><TextInput placeholder="Cari gunung atau pengalaman" placeholderTextColor="#8A978B" className="ml-3 flex-1 font-body text-sm text-foreground" /></View>
        </View>

        <View className="mx-5 overflow-hidden rounded-[28px] bg-primary">
          <Image source={{ uri: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=85' }} contentFit="cover" style={{ height: 220, width: '100%', opacity: 0.62 }} />
          <View className="absolute inset-0 justify-end p-5"><Text className="font-body text-xs font-extrabold uppercase tracking-[3px] text-accent">Jelajah dengan ritme sendiri</Text><Text className="mt-2 max-w-[270px] font-heading text-3xl font-bold leading-9 text-white">Temukan cerita baru di ketinggian.</Text><Text className="mt-2 max-w-[290px] font-body text-xs leading-5 text-white/85">Open trip hangat, private trip yang fleksibel, dan perjalanan yang lebih bertanggung jawab.</Text><View className="mt-4"><Pressable onPress={() => router.push('/(tabs)/explore')} className="flex-row items-center self-start rounded-full bg-white px-4 py-3"><Text className="font-body text-xs font-extrabold text-primary">Mulai eksplorasi</Text><IconSymbol name="arrow.right" size={15} color="#2D5A27" style={{ marginLeft: 7 }} /></Pressable><Pressable onPress={() => openWhatsApp('Halo Or.Trip Adventure, saya ingin booking open trip.')} className="mt-2 flex-row items-center self-start rounded-full bg-[#1F8F45] px-4 py-3"><IconSymbol name="phone.fill" size={15} color="#FFFFFF" /><Text className="ml-2 font-body text-xs font-extrabold text-white">Booking via WhatsApp</Text></Pressable></View></View>
        </View>

        <View className="mt-6 px-5"><ScrollView horizontal showsHorizontalScrollIndicator={false}><Pill label="Semua trip" active /><Pill label="Open trip" /><Pill label="Private trip" /><Pill label="Untuk pemula" /></ScrollView></View>
        <View className="mt-7 px-5"><SectionHeader title="Berangkat dalam waktu dekat" action="Lihat semua" onAction={() => router.push('/(tabs)/explore')} /><ScrollView horizontal showsHorizontalScrollIndicator={false}>{trips.slice(0, 3).map((trip) => <TripCard key={trip.id} trip={trip} compact />)}</ScrollView></View>

        <View className="mx-5 mt-7 rounded-3xl border border-border bg-surface p-5"><View className="flex-row items-center"><View className="h-10 w-10 items-center justify-center rounded-2xl bg-accent"><IconSymbol name="sparkles" size={20} color="#2D5A27" /></View><View className="ml-3 flex-1"><Text className="font-heading text-lg font-bold text-foreground">Butuh perjalanan khusus?</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">Ceritakan kebutuhan grupmu, kami bantu rancang dari awal.</Text></View></View><View className="mt-4"><PrimaryButton label="Rancang private trip" icon="arrow.right" onPress={() => router.push('/private-trip')} /></View></View>

        <View className="mx-5 mt-7 rounded-3xl border border-border bg-surface p-5"><View className="flex-row items-start"><View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F0E6]"><IconSymbol name="doc.text.fill" size={20} color="#2D5A27" /></View><View className="ml-3 flex-1"><Text className="font-heading text-lg font-bold text-foreground">Google Workspace</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">Drive, Docs, Sheets, dan Slides siap digunakan untuk mengelola materi perjalanan.</Text></View></View><View className="mt-4 rounded-2xl bg-[#FFF5E0] p-3"><Text className="font-body text-xs font-extrabold text-[#8A5A00]">Tes koneksi: perlu otorisasi tambahan</Text><Text className="mt-1 font-body text-[11px] leading-4 text-[#8A5A00]">Permintaan read-only ke Drive aman, tetapi token saat ini belum memiliki scope yang diperlukan. Tidak ada data pengguna yang diambil.</Text></View><Text className="mt-3 font-body text-[11px] leading-4 text-muted">Kapabilitas: mencari file, membaca spreadsheet, membaca dokumen, dan mengambil metadata presentasi setelah akses diberikan.</Text></View>\n\n        <View className="mt-7 px-5"><SectionHeader title="Kenapa Or.Trip?" action="" /><View className="flex-row justify-between"><TrustItem icon="shield.fill" title="Safety-first" body="Briefing & guide" /><TrustItem icon="person.2.fill" title="Small group" body="Lebih personal" /><TrustItem icon="checkmark.circle.fill" title="Jelas dari awal" body="Harga transparan" /></View><LegalLinks /></View>
      </ScrollView>
    </ScreenContainer>
  );
}

function TrustItem({ icon, title, body }: { icon: any; title: string; body: string }) { return <View className="w-[31%] items-center rounded-2xl bg-neutral p-3"><IconSymbol name={icon} size={19} color="#2D5A27" /><Text className="mt-2 text-center font-body text-[11px] font-extrabold text-foreground">{title}</Text><Text className="mt-1 text-center font-body text-[10px] text-muted">{body}</Text></View>; }

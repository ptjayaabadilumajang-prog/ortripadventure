import { Image } from 'expo-image';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton, SectionHeader } from '@/components/trip-ui';
import { buildBookingWhatsAppMessage, formatIDR, gallery, getRanuPackage, getTrip, guides, ranuFacilities, ranuMeals, ranuPackages, ranuTimeline, testimonials } from '@/lib/demo-data';
import { openWhatsApp } from '@/components/whatsapp-fab';
import { RanuRouteMap } from '@/components/ranu-route-map';

export default function TripDetailScreen() {
  const { id, package: packageId } = useLocalSearchParams<{ id: string; package?: string }>();
  const trip = getTrip(id);
  const isRanu = trip.id === 'ranu-kumbolo';
  const [selectedPackageId, setSelectedPackageId] = useState(packageId ?? ranuPackages[0].id);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const selectedPackage = getRanuPackage(selectedPackageId);
  const displayPrice = isRanu ? selectedPackage.price : trip.price;
  const bookingMessage = buildBookingWhatsAppMessage({ tripName: isRanu ? `${trip.title} · ${selectedPackage.name}` : trip.title, date: trip.date, participants: 1 });

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="bg-background" safeAreaClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 145 }}>
        <View className="relative">
          <Image source={{ uri: isRanu ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=90' : trip.image }} contentFit="cover" style={{ height: 310, width: '100%' }} />
          <View className="absolute inset-0 bg-[#1A251B]/20" />
          <Pressable onPress={() => router.back()} className="absolute left-5 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/90"><IconSymbol name="arrow.left" size={20} color="#1A251B" /></Pressable>
          <View className="absolute bottom-5 left-5 rounded-full bg-primary px-3 py-2"><Text className="font-body text-[10px] font-bold text-white">{isRanu ? 'Official Organizer' : trip.type}</Text></View>
        </View>
        <View className="px-5 pt-5">
          <Text className="font-body text-xs font-extrabold uppercase tracking-widest text-primary">{isRanu ? 'SEMERU · JAWA TIMUR' : `${trip.location} · ${trip.difficulty}`}</Text>
          <Text className="mt-2 font-heading text-3xl font-bold leading-9 text-foreground">{isRanu ? 'OPEN TRIP RANU KUMBOLO' : trip.title}</Text>
          <View className="mt-3 flex-row items-center"><IconSymbol name="star.fill" size={16} color="#B7791F" /><Text className="ml-1 font-body text-sm font-bold text-foreground">{trip.rating}</Text><Text className="ml-2 font-body text-sm text-muted">· 12 ulasan terbaru</Text></View>
          <Text className="mt-4 font-body text-sm leading-6 text-muted">{isRanu ? 'Nikmati pengalaman camping terbaik di Ranu Kumbolo bersama tim profesional, fasilitas lengkap, dan pelayanan terbaik.' : trip.description}</Text>
          {isRanu && <View className="mt-5 flex-row flex-wrap"><TrustBadge label="Berizin" /><TrustBadge label="Guide Profesional" /><TrustBadge label="Asuransi" /></View>}

          {isRanu ? <RanuContent selectedPackageId={selectedPackageId} setSelectedPackageId={setSelectedPackageId} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} bookingMessage={bookingMessage} trip={trip} setLightboxImage={setLightboxImage} /> : <StandardContent trip={trip} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} bookingMessage={bookingMessage} />}
        </View>
      </ScrollView>
      <Modal visible={Boolean(lightboxImage)} transparent animationType="fade" onRequestClose={() => setLightboxImage(null)}>
        <View className="flex-1 items-center justify-center bg-[#07100A]/95 px-4">
          <Pressable onPress={() => setLightboxImage(null)} className="absolute right-5 top-14 z-10 h-11 w-11 items-center justify-center rounded-full bg-white/15"><IconSymbol name="xmark" size={22} color="#FFFFFF" /></Pressable>
          {lightboxImage ? <Image source={{ uri: lightboxImage }} contentFit="contain" style={{ height: '72%', width: '100%' }} /> : null}
          <Text className="mt-5 font-body text-xs font-bold uppercase tracking-widest text-white/70">Ranu Kumbolo · Or.Trip Adventure</Text>
        </View>
      </Modal>
      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface px-5 pb-6 pt-4"><View className="flex-row items-center justify-between"><View><Text className="font-body text-[10px] text-muted">Mulai dari</Text><Text className="font-body text-lg font-extrabold text-primary">{formatIDR(displayPrice)}</Text></View><View className="w-[56%]"><PrimaryButton label="Booking sekarang" onPress={() => router.push(`/booking?tripId=${trip.id}${isRanu ? `&package=${selectedPackage.id}` : ''}` as any)} /></View></View></View>
    </ScreenContainer>
  );
}

function RanuContent({ selectedPackageId, setSelectedPackageId, expandedFaq, setExpandedFaq, bookingMessage, trip, setLightboxImage }: any) {
  return <>
    <View className="mt-6"><SectionHeader title="Pilih paket meeting point" action="" />{ranuPackages.map((item) => <Pressable key={item.id} onPress={() => setSelectedPackageId(item.id)} className={`mb-3 rounded-3xl border p-4 ${selectedPackageId === item.id ? 'border-primary bg-[#E2E8E2]' : 'border-border bg-surface'}`}><View className="flex-row items-start"><View className="flex-1"><Text className="font-body text-xs font-extrabold uppercase tracking-widest text-primary">{item.meetingPoint}</Text><Text className="mt-1 font-heading text-lg font-bold text-foreground">{item.name}</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">{item.note}</Text></View><Text className="font-body text-sm font-extrabold text-primary">{formatIDR(item.price)}</Text></View></Pressable>)}</View>
    <View className="mt-5 rounded-3xl bg-neutral p-4"><Text className="font-heading text-lg font-bold text-foreground">Semua paket include</Text><View className="mt-3 flex-row flex-wrap">{ranuFacilities.map((item) => <View key={item} className="mb-2 w-1/2 flex-row items-center"><IconSymbol name="checkmark.circle.fill" size={16} color="#2D5A27" /><Text className="ml-2 pr-2 font-body text-xs text-foreground">{item}</Text></View>)}</View></View>
    <View className="mt-6"><SectionHeader title="Makan selama perjalanan" action="" /><View className="flex-row justify-between">{ranuMeals.map((meal) => <View key={meal} className="w-[31%] rounded-2xl bg-surface p-3"><Text className="font-body text-xs font-extrabold text-primary">{meal === 'Breakfast' ? '🍳' : meal === 'Makan Siang' ? '🍛' : '🍲'}</Text><Text className="mt-2 font-body text-xs font-bold text-foreground">{meal}</Text></View>)}</View></View>
    <View className="mt-7"><SectionHeader title="Kenapa pilih Or.Trip?" action="" /><View className="flex-row flex-wrap"><Benefit icon="person.fill" title="Professional Guide" body="Berpengalaman lebih dari 10 tahun" /><Benefit icon="bag.fill" title="Peralatan Lengkap" body="Peralatan camping berkualitas" /><Benefit icon="shield.fill" title="Fasilitas Premium" body="Nyaman dan aman" /><Benefit icon="checkmark.seal.fill" title="Legal & Asuransi" body="SIMAKSI resmi dan peserta terlindungi" /></View></View>
    <View className="mt-7"><SectionHeader title="Timeline trip" action="" />{ranuTimeline.map((group) => <View key={group.day} className="mb-5"><Text className="font-heading text-lg font-bold text-primary">{group.day}</Text>{group.items.map((item, index) => <View key={item} className="flex-row"><View className="w-7 items-center"><View className="mt-2 h-3 w-3 rounded-full bg-primary" />{index < group.items.length - 1 && <View className="h-7 w-px bg-[#A3C9A8]" />}</View><Text className="flex-1 py-1.5 font-body text-sm text-muted">{item}</Text></View>)}</View>)}</View>
    <RanuRouteMap />
    <GalleryPreview onOpen={setLightboxImage} />
    <TestimonialPreview />
    <FaqSection trip={trip} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
    <View className="mt-7 rounded-3xl bg-primary p-5"><Text className="font-heading text-2xl font-bold text-white">Siap berpetualang ke Ranu Kumbolo?</Text><Text className="mt-2 font-body text-sm leading-5 text-white/80">Pilih meeting point, isi data peserta, lalu selesaikan booking dalam alur yang ringkas.</Text><Pressable onPress={() => openWhatsApp(bookingMessage)} className="mt-4 flex-row items-center justify-center rounded-full bg-white px-4 py-3"><IconSymbol name="phone.fill" size={17} color="#2D5A27" /><Text className="ml-2 font-body text-xs font-extrabold text-primary">Chat WhatsApp</Text></Pressable></View>
  </>;
}

function StandardContent({ trip, expandedFaq, setExpandedFaq, bookingMessage }: any) { return <><View className="mt-5 flex-row justify-between rounded-3xl bg-neutral p-4"><Info icon="calendar" label="Tanggal" value={trip.date} /><Info icon="person.2.fill" label="Kapasitas" value={`${trip.seats} kursi`} /><Info icon="clock" label="Durasi" value={trip.duration} /></View><View className="mt-7"><SectionHeader title="Yang kamu dapatkan" action="" />{trip.includes.map((item: string) => <View key={item} className="mb-2 flex-row items-center"><IconSymbol name="checkmark.circle.fill" size={17} color="#2D5A27" /><Text className="ml-2 font-body text-sm text-foreground">{item}</Text></View>)}</View><View className="mt-7"><SectionHeader title="Itinerary" action="" />{trip.itinerary.map((item: string) => <View key={item} className="mb-3 flex-row"><View className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" /><Text className="ml-3 flex-1 font-body text-sm leading-5 text-muted">{item}</Text></View>)}</View><FaqSection trip={trip} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} /><Pressable onPress={() => openWhatsApp(bookingMessage)} className="mt-5 flex-row items-center justify-center rounded-full bg-[#1F8F45] px-4 py-3"><IconSymbol name="phone.fill" size={17} color="#FFFFFF" /><Text className="ml-2 font-body text-xs font-extrabold text-white">Booking via WhatsApp</Text></Pressable></>; }

function FaqSection({ trip, expandedFaq, setExpandedFaq }: any) { return <View className="mt-7"><SectionHeader title="FAQ perjalanan" action="" />{trip.faqs.map((faq: any) => <Pressable key={faq.id} onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className="mb-3 rounded-2xl border border-border bg-surface p-4"><View className="flex-row items-center"><Text className="flex-1 font-body text-sm font-extrabold text-foreground">{faq.question}</Text><IconSymbol name={expandedFaq === faq.id ? 'chevron.up' : 'chevron.down'} size={18} color="#2D5A27" /></View>{expandedFaq === faq.id && <Text className="mt-3 font-body text-sm leading-6 text-muted">{faq.answer}</Text>}</Pressable>)}</View>; }

function GalleryPreview({ onOpen }: { onOpen: (image: string) => void }) { return <View className="mt-7"><SectionHeader title="Galeri perjalanan" action="Lihat semua" onAction={() => router.push('/gallery')} /><View className="flex-row flex-wrap justify-between">{gallery.slice(0, 6).map((item) => <Pressable key={item.id} onPress={() => onOpen(item.image)}><Image source={{ uri: item.image }} contentFit="cover" style={{ width: 108, height: 92, borderRadius: 16, marginBottom: 8 }} /></Pressable>)}</View></View>; }
function TestimonialPreview() { return <View className="mt-7"><SectionHeader title="Cerita peserta" action="" />{testimonials.slice(0, 2).map((item) => <View key={item.id} className="mb-3 rounded-3xl border border-border bg-surface p-4"><Text className="font-body text-sm leading-6 text-foreground">“{item.quote}”</Text><Text className="mt-3 font-body text-xs font-extrabold text-primary">{item.name} · {item.city} · {'★'.repeat(item.rating)}</Text></View>)}</View>; }
function TrustBadge({ label }: { label: string }) { return <View className="mb-2 mr-2 flex-row items-center rounded-full bg-[#E2E8E2] px-3 py-2"><IconSymbol name="checkmark" size={13} color="#2D5A27" /><Text className="ml-1 font-body text-[10px] font-extrabold text-primary">{label}</Text></View>; }
function Benefit({ icon, title, body }: { icon: any; title: string; body: string }) { return <View className="mb-3 w-1/2 pr-2"><View className="rounded-2xl bg-surface p-3"><IconSymbol name={icon} size={18} color="#2D5A27" /><Text className="mt-2 font-body text-xs font-extrabold text-foreground">{title}</Text><Text className="mt-1 font-body text-[10px] leading-4 text-muted">{body}</Text></View></View>; }
function Info({ icon, label, value }: { icon: any; label: string; value: string }) { return <View className="w-[31%]"><IconSymbol name={icon} size={17} color="#2D5A27" /><Text className="mt-2 font-body text-[10px] text-muted">{label}</Text><Text className="mt-1 font-body text-[11px] font-extrabold text-foreground">{value}</Text></View>; }

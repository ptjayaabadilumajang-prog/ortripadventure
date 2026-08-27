import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pill, PrimaryButton } from '@/components/trip-ui';
import { buildBookingWhatsAppMessage, formatIDR, getRanuPackage, getTrip, isBookingConsentComplete } from '@/lib/demo-data';
import { openWhatsApp } from '@/components/whatsapp-fab';
import { trpc } from '@/lib/trpc';

export default function BookingScreen() {
  const { tripId, package: packageId } = useLocalSearchParams<{ tripId?: string; package?: string }>();
  const trip = getTrip(tripId);
  const createLeadMutation = trpc.crm.createLead.useMutation();
  const logActivityMutation = trpc.crm.logActivity.useMutation();
  const [leadId, setLeadId] = useState<number | null>(null);

  const handleFieldBlur = async () => {
    if (!leadId && (customerName || phone || email)) {
      try {
        const id = await createLeadMutation.mutateAsync({
          name: customerName,
          phone,
          email,
          source: 'booking_form',
          productInterest: trip.id,
        });
        setLeadId(id);
        logActivityMutation.mutate({ leadId: id, action: 'start_booking', scoreAdded: 10 });
      } catch (e) {
        console.error("Failed to create lead", e);
      }
    } else if (leadId) {
      logActivityMutation.mutate({ leadId, action: 'fill_field', scoreAdded: 5 });
    }
  };
  const selectedPackage = trip.id === 'ranu-kumbolo' ? getRanuPackage(packageId) : null;
  const unitPrice = selectedPackage?.price ?? trip.price;
  const [participants, setParticipants] = useState(1);
  const [citizenship, setCitizenship] = useState('WNI');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Real departure selection
  const { data: departures = [] } = trpc.trips.getDepartures.useQuery({ tripId: trip.id === 'ranu-kumbolo' ? 1 : 0 }, { enabled: !!trip.id });
  const [selectedDepartureId, setSelectedDepartureId] = useState<number | null>(null);
  const [departureDate, setDepartureDate] = useState(trip.date === 'Custom date' ? '' : trip.date);
  
  const total = useMemo(() => unitPrice * participants, [unitPrice, participants]);
  const canContinue = isBookingConsentComplete(privacyAccepted, termsAccepted) && customerName.trim().length >= 2 && phone.trim().length >= 6 && email.includes('@') && departureDate.trim().length >= 6;
  const params = `tripId=${encodeURIComponent(trip.id)}&tripSlug=${encodeURIComponent(trip.id)}&participants=${participants}&package=${encodeURIComponent(selectedPackage?.id ?? '')}&customerName=${encodeURIComponent(customerName)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&total=${total}&date=${encodeURIComponent(departureDate)}&departureId=${selectedDepartureId || ''}`;
  return <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="bg-background" safeAreaClassName="bg-background"><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}><Pressable onPress={() => router.back()} className="mb-5 flex-row items-center"><IconSymbol name="arrow.left" size={18} color="#2D5A27" /><Text className="ml-2 font-body text-sm font-bold text-primary">Kembali</Text></Pressable><Text className="font-body text-xs font-bold uppercase tracking-widest text-primary">BOOKING TRIP</Text><Text className="mt-2 font-heading text-3xl font-bold text-foreground">Siap berangkat?</Text><View className="mt-5 rounded-3xl bg-surface p-4"><Text className="font-heading text-xl font-bold text-foreground">{trip.title}</Text><Text className="mt-1 font-body text-xs text-muted">{selectedPackage ? `${selectedPackage.name} · ${selectedPackage.meetingPoint}` : trip.date} · {trip.duration}</Text></View><Text className="mt-7 font-heading text-xl font-bold text-foreground">Detail peserta</Text><Field label="Nama lengkap" placeholder="Nama sesuai identitas" value={customerName} onChangeText={setCustomerName} onBlur={handleFieldBlur} /><Field label="Nomor WhatsApp" placeholder="08xx-xxxx-xxxx" keyboardType="phone-pad" value={phone} onChangeText={setPhone} onBlur={handleFieldBlur} /><Field label="Email" placeholder="nama@email.com" keyboardType="email-address" value={email} onChangeText={setEmail} onBlur={handleFieldBlur} />{departures.length > 0 ? (
            <View className="mt-4">
              <Text className="mb-2 font-body text-xs font-extrabold text-foreground">Pilih Jadwal Keberangkatan</Text>
              <View className="gap-2">
                {departures.map((d: any) => {
                  const isSelected = selectedDepartureId === d.id;
                  const isFull = d.seatsAvailable < participants;
                  return (
                    <Pressable 
                      key={d.id}
                      onPress={() => {
                        setSelectedDepartureId(d.id);
                        setDepartureDate(new Date(d.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }));
                      }}
                      className={`rounded-2xl border p-4 ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface'} ${isFull ? 'opacity-50' : ''}`}
                    >
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className={`font-body text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {new Date(d.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </Text>
                          <Text className="font-body text-xs text-muted mt-1">
                            Sisa kuota: {d.seatsAvailable} kursi
                          </Text>
                        </View>
                        {isSelected && <IconSymbol name="checkmark.circle.fill" size={20} color="#2D5A27" />}
                        {isFull && !isSelected && <Text className="font-body text-[10px] text-error font-bold">KUOTA PENUH</Text>}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {selectedDepartureId && departures.find((d: any) => d.id === selectedDepartureId)?.seatsAvailable < participants && (
                <View className="mt-2 rounded-xl bg-error/10 p-3">
                  <Text className="font-body text-xs text-error">
                    Kuota tidak mencukupi untuk {participants} orang. Anda akan dimasukkan ke daftar tunggu (waitlist).
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Field label="Tanggal keberangkatan" placeholder="Contoh: 15 Okt 2026" value={departureDate} onChangeText={setDepartureDate} />
          )}<View className="mt-4"><Text className="mb-2 font-body text-xs font-extrabold text-foreground">Jumlah peserta</Text><View className="flex-row items-center"><Pressable onPress={() => setParticipants(Math.max(1, participants - 1))} className="h-11 w-11 items-center justify-center rounded-2xl bg-neutral"><Text className="font-body text-xl font-bold text-primary">−</Text></Pressable><Text className="mx-5 font-body text-lg font-extrabold text-foreground">{participants}</Text><Pressable onPress={() => setParticipants(Math.min(trip.seats, participants + 1))} className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"><Text className="font-body text-xl font-bold text-white">+</Text></Pressable></View></View><View className="mt-6"><Text className="mb-2 font-body text-xs font-extrabold text-foreground">Kewarganegaraan</Text><View className="flex-row"><Pill label="WNI · IDR" active={citizenship === 'WNI'} onPress={() => setCitizenship('WNI')} /><Pill label="WNA · USD" active={citizenship === 'WNA'} onPress={() => setCitizenship('WNA')} /></View></View><View className="mt-7 rounded-3xl bg-neutral p-4"><View className="flex-row justify-between"><Text className="font-body text-sm text-muted">{formatIDR(unitPrice)} × {participants} peserta</Text><Text className="font-body text-sm font-bold text-foreground">{formatIDR(total)}</Text></View><View className="my-3 h-px bg-border" /><View className="flex-row justify-between"><Text className="font-body text-sm font-extrabold text-foreground">Total sementara</Text><Text className="font-body text-lg font-extrabold text-primary">{citizenship === 'WNI' ? formatIDR(total) : `$${Math.round(total / 16000).toLocaleString('en-US')}`}</Text></View></View><View className="mt-6 rounded-3xl border border-border bg-surface p-4"><Text className="font-heading text-lg font-bold text-foreground">Persetujuan booking</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">Baca dan setujui kedua dokumen sebelum melanjutkan.</Text><ConsentRow checked={privacyAccepted} onPress={() => setPrivacyAccepted(!privacyAccepted)} label="Saya menyetujui Privacy Policy" onLinkPress={() => router.push('/legal' as any)} /><ConsentRow checked={termsAccepted} onPress={() => setTermsAccepted(!termsAccepted)} label="Saya menyetujui Booking Terms & Conditions" onLinkPress={() => router.push('/legal?section=terms' as any)} /></View><View className="mt-5"><PrimaryButton label="Lanjut ke pembayaran" disabled={!canContinue} onPress={() => router.push(`/payment?${params}` as any)} /></View><Pressable onPress={() => openWhatsApp(buildBookingWhatsAppMessage({ tripName: selectedPackage ? `${trip.title} · ${selectedPackage.name}` : trip.title, date: departureDate, participants }))} className="mt-3 flex-row items-center justify-center rounded-2xl border border-[#1F8F45] px-4 py-3"><IconSymbol name="phone.fill" size={17} color="#1F8F45" /><Text className="ml-2 font-body text-sm font-extrabold text-[#1F8F45]">Tanya & booking via WhatsApp</Text></Pressable></ScrollView></ScreenContainer>;
}

function ConsentRow({ checked, onPress, label, onLinkPress }: { checked: boolean; onPress: () => void; label: string; onLinkPress: () => void }) { return <View className="mt-4 flex-row items-start"><Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} className={`mr-3 h-6 w-6 items-center justify-center rounded-md border ${checked ? 'border-primary bg-primary' : 'border-border bg-background'}`}>{checked && <IconSymbol name="checkmark" size={15} color="#FFFFFF" />}</Pressable><Pressable onPress={onLinkPress} className="flex-1"><Text className="font-body text-xs leading-5 text-primary underline">{label}</Text></Pressable></View>; }
function Field({ label, placeholder, keyboardType = 'default', value, onChangeText, onBlur }: { label: string; placeholder: string; keyboardType?: any; value: string; onChangeText: (value: string) => void; onBlur?: () => void }) { return <View className="mt-4"><Text className="mb-2 font-body text-xs font-extrabold text-foreground">{label}</Text><TextInput value={value} onChangeText={onChangeText} onBlur={onBlur} placeholder={placeholder} placeholderTextColor="#8A978B" keyboardType={keyboardType} className="rounded-2xl border border-border bg-surface px-4 py-3.5 font-body text-sm text-foreground" /></View>; }

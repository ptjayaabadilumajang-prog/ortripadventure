import { useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/trip-ui';
import { formatIDR, getRanuPackage, getTrip } from '@/lib/demo-data';
import { trpc } from '@/lib/trpc';

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams<{ tripId?: string; package?: string; participants?: string; customerName?: string; phone?: string; email?: string; total?: string; paymentMethod?: string; bookingCode?: string }>();
  const trip = getTrip(params.tripId);
  const selectedPackage = trip.id === 'ranu-kumbolo' ? getRanuPackage(params.package) : null;
  const participants = Number(params.participants ?? 1);
  const total = Number(params.total ?? trip.price * participants);
  const bookingCode = params.bookingCode ?? 'OR-PENDING';
  const [proof, setProof] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const uploadProof = trpc.booking.uploadPaymentProof.useMutation();
  const submitBooking = trpc.booking.submitToGoogleSheets.useMutation();

  async function pickProof() {
    setError('');
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'], copyToCacheDirectory: true, multiple: false, base64: Platform.OS === 'web' });
    if (result.canceled) return;
    const asset = result.assets[0];
    if ((asset.size ?? 0) > 10 * 1024 * 1024) { setError('Ukuran bukti pembayaran maksimal 10 MB.'); return; }
    setProof(asset);
  }

  async function submit() {
    if (!proof) { setError('Pilih bukti pembayaran terlebih dahulu.'); return; }
    setError('');
    try {
      const rawBase64 = proof.base64 ?? await FileSystem.readAsStringAsync(proof.uri, { encoding: FileSystem.EncodingType.Base64 });
      const base64 = rawBase64.includes(',') ? rawBase64.split(',').pop() ?? rawBase64 : rawBase64;
      const uploaded = await uploadProof.mutateAsync({ bookingCode, fileName: proof.name, mimeType: (proof.mimeType ?? 'image/jpeg') as 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf', base64 });
      await submitBooking.mutateAsync({ bookingCode, tripName: trip.title, packageName: selectedPackage?.name, date: trip.date, participants, customerName: params.customerName ?? '', phone: params.phone ?? '', email: params.email ?? '', total, paymentMethod: params.paymentMethod ?? 'qris', proofUrl: uploaded.url });
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Bukti belum dapat dikirim. Coba lagi.');
    }
  }

  return <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="bg-background" safeAreaClassName="bg-background"><ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}><Pressable onPress={() => router.replace('/(tabs)')} className="self-end"><IconSymbol name="xmark" size={22} color="#617064" /></Pressable><View className="mt-8 items-center"><View className="h-20 w-20 items-center justify-center rounded-full bg-accent"><IconSymbol name="checkmark.circle.fill" size={42} color="#2D5A27" /></View><Text className="mt-6 text-center font-heading text-3xl font-bold text-foreground">Booking tercatat.</Text><Text className="mt-2 max-w-[310px] text-center font-body text-sm leading-5 text-muted">Simpan kode ini, unggah bukti pembayaran, lalu tim Or.Trip akan memvalidasi reservasi kamu.</Text></View><View className="mt-8 rounded-3xl bg-primary p-5"><Text className="font-body text-xs font-bold uppercase tracking-widest text-accent">KODE BOOKING</Text><Text className="mt-2 font-body text-3xl font-extrabold tracking-[5px] text-white">{bookingCode}</Text><View className="mt-5 h-px bg-white/20" /><Text className="mt-4 font-body text-xs text-white/70">Status</Text><Text className="mt-1 font-body text-sm font-extrabold text-white">{submitted ? 'Bukti terkirim · menunggu validasi' : 'Menunggu bukti pembayaran'}</Text></View><View className="mt-5 rounded-3xl border border-border bg-surface p-4"><Text className="font-heading text-lg font-bold text-foreground">{trip.title}</Text><Text className="mt-1 font-body text-xs text-muted">{selectedPackage?.name ?? trip.location} · {trip.date} · {participants} peserta</Text><Text className="mt-3 font-body text-sm font-extrabold text-primary">{formatIDR(total)}</Text></View>{!submitted ? <View className="mt-6 rounded-3xl border border-border bg-surface p-4"><Text className="font-heading text-lg font-bold text-foreground">Upload bukti pembayaran</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">Format JPG, PNG, WEBP, atau PDF. Maksimal 10 MB.</Text><Pressable onPress={pickProof} className="mt-4 flex-row items-center rounded-2xl border border-dashed border-primary bg-accent/30 px-4 py-4"><IconSymbol name="paperclip" size={20} color="#2D5A27" /><View className="ml-3 flex-1"><Text className="font-body text-sm font-extrabold text-primary">{proof ? proof.name : 'Pilih file bukti transfer'}</Text><Text className="mt-1 font-body text-xs text-muted">{proof ? 'File siap dikirim' : 'Ketuk untuk membuka penyimpanan perangkat'}</Text></View></Pressable>{error ? <Text className="mt-3 font-body text-xs leading-5 text-error">{error}</Text> : null}<View className="mt-5"><PrimaryButton label={uploadProof.isPending || submitBooking.isPending ? 'Mengirim...' : 'Kirim bukti & submit booking'} disabled={uploadProof.isPending || submitBooking.isPending} onPress={submit} /></View></View> : <View className="mt-6 rounded-3xl bg-accent p-4"><Text className="font-body text-sm font-extrabold text-primary">Bukti pembayaran berhasil dikirim.</Text><Text className="mt-1 font-body text-xs leading-5 text-muted">Data booking diteruskan ke tim Or.Trip dan akan dicatat pada spreadsheet operasional.</Text></View>}<View className="mt-6"><PrimaryButton label="Kembali ke beranda" onPress={() => router.replace('/(tabs)')} /></View></ScrollView></ScreenContainer>;
}

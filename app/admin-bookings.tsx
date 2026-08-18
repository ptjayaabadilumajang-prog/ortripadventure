import { useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PrimaryButton } from '@/components/trip-ui';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/use-auth';
import type { BookingValidationStatus } from '@/lib/booking-status';

const statuses: BookingValidationStatus[] = ['under_review', 'approved', 'rejected'];

export default function AdminBookingsScreen() {
  const { user, loading } = useAuth();
  const [bookingCode, setBookingCode] = useState('');
  const [status, setStatus] = useState<BookingValidationStatus>('approved');
  const [message, setMessage] = useState('');
  const updateStatus = trpc.booking.updateStatus.useMutation();

  async function update() {
    if (!bookingCode.trim()) { setMessage('Masukkan kode booking.'); return; }
    setMessage('');
    try {
      const result = await updateStatus.mutateAsync({ bookingCode: bookingCode.trim(), status });
      setMessage('Status booking diperbarui.');
      if (result.whatsappUrl) await Linking.openURL(result.whatsappUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Status belum dapat diperbarui.');
    }
  }

  if (loading) return <ScreenContainer className="items-center justify-center"><Text className="font-body text-muted">Memuat akses admin...</Text></ScreenContainer>;
  if (!user) return <ScreenContainer className="p-5"><Text className="font-heading text-3xl font-bold text-foreground">Akses admin</Text><Text className="mt-3 font-body leading-6 text-muted">Masuk sebagai admin Or.Trip untuk memvalidasi booking. Server akan memeriksa hak akses saat status disimpan.</Text></ScreenContainer>;

  return <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="p-5"><Text className="font-heading text-3xl font-bold text-foreground">Validasi booking</Text><Text className="mt-2 font-body leading-6 text-muted">Pilih status pembayaran. Setelah disimpan, link notifikasi WhatsApp admin akan dibuka dengan detail booking.</Text><View className="mt-7 rounded-3xl border border-border bg-surface p-4"><Text className="font-body text-xs font-bold uppercase tracking-wider text-muted">Kode booking</Text><TextInput value={bookingCode} onChangeText={setBookingCode} autoCapitalize="characters" placeholder="OR-XXXXXX" placeholderTextColor="#879287" className="mt-2 rounded-2xl border border-border bg-background px-4 py-3 font-body text-base text-foreground" /><Text className="mt-5 font-body text-xs font-bold uppercase tracking-wider text-muted">Status baru</Text><View className="mt-3 flex-row flex-wrap gap-2">{statuses.map((item) => <Pressable key={item} onPress={() => setStatus(item)} className={status === item ? 'rounded-full bg-primary px-4 py-2' : 'rounded-full border border-border px-4 py-2'}><Text className={status === item ? 'font-body text-xs font-bold text-white' : 'font-body text-xs font-bold text-foreground'}>{item === 'under_review' ? 'Review' : item === 'approved' ? 'Disetujui' : 'Ditolak'}</Text></Pressable>)}</View><View className="mt-6"><PrimaryButton label={updateStatus.isPending ? 'Menyimpan...' : 'Simpan status & buka WhatsApp'} disabled={updateStatus.isPending} onPress={update} /></View>{message ? <Text className="mt-4 font-body text-sm leading-5 text-muted">{message}</Text> : null}</View></ScreenContainer>;
}

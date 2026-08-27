import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PrimaryButton } from '@/components/trip-ui';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/use-auth';
import { formatIDR } from '@/lib/demo-data';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { BookingValidationStatus } from '@/lib/booking-status';

const statuses: BookingValidationStatus[] = ['under_review', 'approved', 'rejected'];

export default function AdminDashboardScreen() {
  const { user, loading: authLoading } = useAuth();
  const [bookingCode, setBookingCode] = useState('');
  const [status, setStatus] = useState<BookingValidationStatus>('approved');
  const [message, setMessage] = useState('');
  
  const statsQuery = trpc.booking.getStats.useQuery(undefined, { enabled: !!user });
  const listQuery = trpc.booking.list.useQuery(undefined, { enabled: !!user });
  const updateStatus = trpc.booking.updateStatus.useMutation({
    onSuccess: () => {
      statsQuery.refetch();
      listQuery.refetch();
    }
  });

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

  if (authLoading) return <ScreenContainer className="items-center justify-center"><Text className="font-body text-muted">Memuat akses admin...</Text></ScreenContainer>;
  if (!user) return <ScreenContainer className="p-5"><Text className="font-heading text-3xl font-bold text-foreground">Akses admin</Text><Text className="mt-3 font-body leading-6 text-muted">Masuk sebagai admin Or.Trip untuk mengakses dashboard keuangan dan memvalidasi booking.</Text></ScreenContainer>;

  const stats = statsQuery.data;
  const bookings = listQuery.data ?? [];

  return (
    <ScreenContainer edges={['top', 'left', 'right', 'bottom']} className="bg-background">
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="font-heading text-3xl font-bold text-foreground">Dashboard Keuangan</Text>
        <Text className="mt-1 font-body text-sm text-muted">Ringkasan performa dan manajemen booking Or.Trip.</Text>

        {/* Stats Grid */}
        <View className="mt-6 flex-row flex-wrap justify-between gap-y-4">
          <StatCard label="Total Booking" value={stats?.totalBookings ?? 0} icon="paperplane.fill" />
          <StatCard label="Revenue (Approved)" value={formatIDR(stats?.totalRevenue ?? 0)} icon="banknote.fill" color="#2D5A27" />
          <StatCard label="Pending Revenue" value={formatIDR(stats?.pendingRevenue ?? 0)} icon="clock.fill" color="#F59E0B" />
          <StatCard label="Approved/Pending" value={`${stats?.approvedBookings ?? 0} / ${stats?.pendingBookings ?? 0}`} icon="checkmark.circle.fill" />
        </View>

        {/* Validation Section */}
        <View className="mt-8 rounded-3xl border border-border bg-surface p-5">
          <Text className="font-heading text-xl font-bold text-foreground">Validasi Cepat</Text>
          <Text className="mt-1 font-body text-xs text-muted">Update status pembayaran secara manual.</Text>
          
          <TextInput 
            value={bookingCode} 
            onChangeText={setBookingCode} 
            autoCapitalize="characters" 
            placeholder="Kode Booking (OR-XXXXXX)" 
            placeholderTextColor="#879287" 
            className="mt-4 rounded-2xl border border-border bg-background px-4 py-3.5 font-body text-sm text-foreground" 
          />
          
          <View className="mt-4 flex-row flex-wrap gap-2">
            {statuses.map((item) => (
              <Pressable 
                key={item} 
                onPress={() => setStatus(item)} 
                className={`rounded-full border px-4 py-2 ${status === item ? 'bg-primary border-primary' : 'border-border bg-background'}`}
              >
                <Text className={`font-body text-[10px] font-extrabold uppercase tracking-widest ${status === item ? 'text-white' : 'text-foreground'}`}>
                  {item === 'under_review' ? 'Review' : item === 'approved' ? 'Setujui' : 'Tolak'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-5">
            <PrimaryButton 
              label={updateStatus.isPending ? 'Menyimpan...' : 'Simpan & Buka WhatsApp'} 
              disabled={updateStatus.isPending} 
              onPress={update} 
            />
          </View>
          {message ? <Text className="mt-3 font-body text-xs text-center text-muted">{message}</Text> : null}
        </View>

        {/* Recent Bookings */}
        <View className="mt-8">
          <Text className="font-heading text-xl font-bold text-foreground">Booking Terbaru</Text>
          <View className="mt-4 gap-y-3">
            {bookings.length === 0 ? (
              <View className="rounded-2xl border border-dashed border-border p-8 items-center">
                <Text className="font-body text-sm text-muted">Belum ada data booking.</Text>
              </View>
            ) : (
              bookings.map((b) => (
                <View key={b.bookingCode} className="rounded-2xl border border-border bg-surface p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-2">
                      <Text className="font-body text-[10px] font-extrabold text-primary uppercase tracking-widest">{b.bookingCode}</Text>
                      <Text className="mt-1 font-heading text-base font-bold text-foreground">{b.customerName}</Text>
                      <Text className="font-body text-xs text-muted">{b.tripName}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-md ${b.status === 'approved' ? 'bg-success/10' : b.status === 'rejected' ? 'bg-error/10' : 'bg-warning/10'}`}>
                      <Text className={`font-body text-[10px] font-bold ${b.status === 'approved' ? 'text-success' : b.status === 'rejected' ? 'text-error' : 'text-warning'}`}>
                        {b.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-3 pt-3 border-t border-border flex-row justify-between items-center">
                    <Text className="font-body text-xs text-muted">{new Date(b.submittedAt).toLocaleDateString('id-ID')}</Text>
                    <Text className="font-body text-sm font-extrabold text-foreground">{formatIDR(b.total)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatCard({ label, value, icon, color = '#1A251B' }: { label: string; value: string | number; icon: string; color?: string }) {
  return (
    <View className="w-[48%] rounded-3xl border border-border bg-surface p-4">
      <View className="h-8 w-8 items-center justify-center rounded-xl bg-neutral mb-3">
        <IconSymbol name={icon as any} size={16} color={color} />
      </View>
      <Text className="font-body text-[10px] font-extrabold text-muted uppercase tracking-widest">{label}</Text>
      <Text className="mt-1 font-heading text-lg font-bold text-foreground" style={{ color }}>{value}</Text>
    </View>
  );
}

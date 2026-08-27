import React, { useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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
  const [activeTab, setActiveTab] = useState<'finance' | 'leads' | 'trips' | 'schedules' | 'settings'>('finance');
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [showNotificationTest, setShowNotificationTest] = useState(false);
  const [showLegalDocs, setShowLegalDocs] = useState(false);
  const [testTitle, setTestTitle] = useState('Tes Notifikasi');
  const [testBody, setTestBody] = useState('Halo admin, ini adalah notifikasi percobaan.');
  
  const statsQuery = trpc.booking.getStats.useQuery(undefined, { enabled: !!user });
  const listQuery = trpc.booking.list.useQuery(undefined, { enabled: !!user });
  const leadsQuery = trpc.crm.listLeads.useQuery(undefined, { enabled: !!user && activeTab === 'leads' });
  const tripsQuery = trpc.trips.list.useQuery(undefined, { enabled: !!user && activeTab === 'trips' });
  const leadDetailsQuery = trpc.crm.getLeadDetails.useQuery({ id: selectedLeadId! }, { enabled: !!user && !!selectedLeadId });
  const legalDocsQuery = trpc.legal.list.useQuery(undefined, { enabled: !!user && (activeTab === 'settings' || showLegalDocs) });

  const updateStatus = trpc.booking.updateStatus.useMutation({
    onSuccess: () => {
      statsQuery.refetch();
      listQuery.refetch();
      setBookingCode('');
      setMessage('Status booking berhasil diperbarui.');
    },
  });

  const updateTrip = trpc.trips.update.useMutation({
    onSuccess: () => tripsQuery.refetch(),
  });

  const sendTestNotification = trpc.notifications.test.useMutation({
    onSuccess: () => alert('Notifikasi tes berhasil dikirim!'),
  });

  if (authLoading) return <ScreenContainer className="items-center justify-center"><Text className="font-body text-muted">Memeriksa otorisasi...</Text></ScreenContainer>;
  if (!user || (user as any).role !== 'admin') return <ScreenContainer className="items-center justify-center"><Text className="font-heading text-xl font-bold text-error">Akses Ditolak</Text><Text className="mt-2 font-body text-muted">Halaman ini hanya untuk administrator.</Text></ScreenContainer>;

  return (
    <ScreenContainer className="bg-background" safeAreaClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-6">
          <Text className="font-body text-xs font-bold uppercase tracking-widest text-primary">Admin Command Center</Text>
          <Text className="mt-1 font-heading text-3xl font-bold text-foreground">Or.Trip Dashboard</Text>
        </View>

        <View className="mt-6 flex-row border-b border-border px-5">
          {(['finance', 'leads', 'trips', 'schedules', 'settings'] as const).map((tab) => (
            <Pressable 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`mr-6 border-b-2 pb-3 ${activeTab === tab ? 'border-primary' : 'border-transparent'}`}
            >
              <Text className={`font-body text-sm font-bold capitalize ${activeTab === tab ? 'text-primary' : 'text-muted'}`}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'finance' && (
          <View className="px-5 pt-6">
            <View className="flex-row gap-x-4">
              <StatCard title="Revenue" value={formatIDR(statsQuery.data?.totalRevenue || 0)} icon="banknote.fill" color="#2D5A27" />
              <StatCard title="Pending" value={formatIDR(statsQuery.data?.pendingRevenue || 0)} icon="clock.fill" color="#B7791F" />
            </View>
            
            <View className="mt-4 flex-row gap-x-4">
              <StatCard title="Total Trips" value={statsQuery.data?.totalBookings || 0} icon="checkmark.circle.fill" color="#2D5A27" />
              <StatCard title="Under Review" value={statsQuery.data?.pendingBookings || 0} icon="magnifyingglass" color="#617064" />
            </View>

            <View className="mt-8 rounded-3xl bg-surface p-5 border border-border">
              <Text className="font-heading text-xl font-bold text-foreground">Validasi Booking</Text>
              <TextInput 
                placeholder="Masukkan Kode Booking (e.g. TRP-123)" 
                value={bookingCode}
                onChangeText={setBookingCode}
                className="mt-4 rounded-2xl bg-neutral px-4 py-3 font-body text-sm text-foreground border border-border"
              />
              <View className="mt-4 flex-row gap-x-2">
                {statuses.map((s) => (
                  <Pressable 
                    key={s} 
                    onPress={() => setStatus(s)}
                    className={`flex-1 rounded-xl py-2 items-center border ${status === s ? 'bg-primary border-primary' : 'bg-transparent border-border'}`}
                  >
                    <Text className={`font-body text-xs font-bold ${status === s ? 'text-white' : 'text-muted'}`}>{s.replace('_', ' ')}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="mt-4">
                <PrimaryButton 
                  label={updateStatus.isPending ? 'Memproses...' : 'Update Status'} 
                  onPress={() => updateStatus.mutate({ bookingCode, status })}
                />
              </View>
              {message ? <Text className="mt-3 text-center font-body text-xs text-success font-bold">{message}</Text> : null}
            </View>
          </View>
        )}

        {activeTab === 'leads' && (
          <View className="px-5 pt-6">
            <Text className="font-heading text-xl font-bold text-foreground">CRM & Leads</Text>
            <Text className="mt-1 font-body text-xs text-muted">Pelacakan calon peserta berdasarkan skor aktivitas.</Text>
            
            <View className="mt-6 gap-y-4">
              {leadsQuery.data?.map((lead) => (
                <Pressable 
                  key={lead.id} 
                  onPress={() => setSelectedLeadId(lead.id)}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="font-heading text-base font-bold text-foreground">{lead.name || 'Anonymous'}</Text>
                      <Text className="font-body text-xs text-muted">{lead.phone || lead.email || 'No contact'}</Text>
                    </View>
                    <View className="items-end">
                      <View className="rounded-full bg-accent px-2 py-1">
                        <Text className="font-body text-[10px] font-bold text-primary">SCORE: {lead.score}</Text>
                      </View>
                      <Text className="mt-1 font-body text-[10px] text-muted uppercase">{lead.status}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'trips' && (
          <View className="px-5 pt-6">
            <Text className="font-heading text-xl font-bold text-foreground">Product Management</Text>
            <Text className="mt-1 font-body text-xs text-muted">Kelola status verifikasi dan visibilitas trip.</Text>
            
            <View className="mt-6 gap-y-4">
              {tripsQuery.data?.map(({ trip }: any) => (
                <View key={trip.id} className="rounded-2xl border border-border bg-surface p-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="font-heading text-base font-bold text-foreground">{trip.title}</Text>
                      <Text className="font-body text-xs text-muted">ID: {trip.slug}</Text>
                    </View>
                    <Pressable 
                      onPress={() => updateTrip.mutate({ id: trip.id, isVerified: !trip.isVerified })}
                      className={`rounded-full px-3 py-1.5 ${trip.isVerified ? 'bg-success' : 'bg-neutral'}`}
                    >
                      <Text className={`font-body text-[10px] font-bold ${trip.isVerified ? 'text-white' : 'text-muted'}`}>
                        {trip.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'schedules' && (
          <View className="px-5 pt-6">
            <Text className="font-heading text-xl font-bold text-foreground">Trip Schedules</Text>
            <Text className="mt-1 font-body text-xs text-muted">Pantau ketersediaan kursi keberangkatan.</Text>
            <TripScheduleSection />
          </View>
        )}

        {activeTab === 'settings' && (
          <View className="mt-6 px-5">
            <Text className="font-heading text-xl font-bold text-foreground">Business Configuration</Text>
            <Text className="mt-1 font-body text-xs text-muted">Update pengaturan operasional global.</Text>
            
            <View className="mt-6 gap-y-4">
              <ConfigItem title="Official Contacts" description="Nomor WhatsApp admin, email, dan link sosial media." />
              <ConfigItem title="Pricing & Packages" description="Kelola harga dasar dan paket meeting point." />
              <ConfigItem title="Lead Scoring Rules" description="Atur bobot poin untuk aktivitas chatbot dan form." />
              <ConfigItem title="Google Sheets Integration" description="Konfigurasi URL webhook Apps Script." />
              <ConfigItem 
                title="Push Notifications" 
                description="Kirim notifikasi tes dan kelola push tokens." 
                onPress={() => setShowNotificationTest(true)}
              />
              <ConfigItem 
                title="Legal Documents" 
                description="Arsip dokumen perusahaan (NIB, NPWP, Sertifikat)." 
                onPress={() => setShowLegalDocs(true)}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={showLegalDocs} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-[32px] p-6 h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-heading text-2xl font-bold text-foreground">Dokumen Legal</Text>
              <Pressable onPress={() => setShowLegalDocs(false)} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
                <IconSymbol name="xmark" size={20} color="#1A251B" />
              </Pressable>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {legalDocsQuery.isLoading ? (
                <Text className="font-body text-muted">Memuat dokumen...</Text>
              ) : (legalDocsQuery.data ?? []).map((doc: any) => (
                <View key={doc.id} className="mb-4 rounded-2xl border border-border bg-surface p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-heading text-base font-bold text-foreground">{doc.name}</Text>
                      <Text className="font-body text-xs text-muted">No: {doc.documentNumber || '-'}</Text>
                      <Text className="mt-1 font-body text-[10px] text-primary font-bold uppercase">{doc.type}</Text>
                    </View>
                    <View className={`rounded-full px-2 py-1 ${doc.isVerified ? 'bg-success/10' : 'bg-warning/10'}`}>
                      <Text className={`font-body text-[10px] font-bold ${doc.isVerified ? 'text-success' : 'text-warning'}`}>
                        {doc.isVerified ? 'VERIFIED' : 'PENDING'}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="mt-4 flex-row gap-2">
                    <Pressable 
                      onPress={() => Linking.openURL(doc.fileUrl)}
                      className="flex-1 rounded-xl bg-primary py-2.5 items-center justify-center"
                    >
                      <Text className="font-body text-xs font-bold text-white">Lihat PDF</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              
              <View className="mt-4 rounded-2xl bg-neutral p-4 border border-border border-dashed">
                <Text className="font-body text-[10px] text-muted leading-4 text-center">
                  Dokumen ini bersifat rahasia dan hanya untuk keperluan administrasi Or.Trip Adventure. Dilarang menyebarluaskan tanpa izin superadmin.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showNotificationTest} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-[32px] p-6 h-[60%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-heading text-2xl font-bold text-foreground">Test Notifikasi</Text>
              <Pressable onPress={() => setShowNotificationTest(false)} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
                <IconSymbol name="xmark" size={20} color="#1A251B" />
              </Pressable>
            </View>
            
            <View className="gap-y-4">
              <View>
                <Text className="font-body text-xs text-muted mb-2">Judul Notifikasi</Text>
                <TextInput 
                  value={testTitle}
                  onChangeText={setTestTitle}
                  className="rounded-2xl bg-neutral px-4 py-3 font-body text-sm text-foreground border border-border"
                />
              </View>
              <View>
                <Text className="font-body text-xs text-muted mb-2">Pesan</Text>
                <TextInput 
                  value={testBody}
                  onChangeText={setTestBody}
                  multiline
                  numberOfLines={3}
                  className="rounded-2xl bg-neutral px-4 py-3 font-body text-sm text-foreground border border-border h-24"
                />
              </View>
              <PrimaryButton 
                label={sendTestNotification.isPending ? 'Mengirim...' : 'Kirim Sekarang'} 
                onPress={() => sendTestNotification.mutate({ title: testTitle, body: testBody })}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedLeadId} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-[32px] p-6 h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-heading text-2xl font-bold text-foreground">Lead Details</Text>
              <Pressable onPress={() => setSelectedLeadId(null)} className="h-10 w-10 items-center justify-center rounded-full bg-surface">
                <IconSymbol name="xmark" size={20} color="#1A251B" />
              </Pressable>
            </View>
            
            {leadDetailsQuery.isLoading ? (
              <Text className="font-body text-muted">Memuat data...</Text>
            ) : leadDetailsQuery.data && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="rounded-2xl bg-neutral p-4">
                  <Text className="font-heading text-lg font-bold text-foreground">{(leadDetailsQuery.data as any).name}</Text>
                  <Text className="font-body text-sm text-muted">{(leadDetailsQuery.data as any).phone} · {(leadDetailsQuery.data as any).email}</Text>
                  <View className="mt-3 flex-row items-center">
                    <View className="rounded-full bg-primary px-3 py-1">
                      <Text className="font-body text-xs font-bold text-white">Score: {(leadDetailsQuery.data as any).score}</Text>
                    </View>
                    <Text className="ml-3 font-body text-xs text-muted uppercase">{(leadDetailsQuery.data as any).status}</Text>
                  </View>
                </View>
                
                <Text className="mt-6 font-heading text-lg font-bold text-foreground">Aktivitas Terbaru</Text>
                <View className="mt-3 gap-y-3">
                  {leadDetailsQuery.data.activities.map((act: any) => (
                    <View key={act.id} className="border-l-2 border-primary/20 pl-4 py-1">
                      <Text className="font-body text-sm font-bold text-foreground">{act.action.replace('_', ' ')}</Text>
                      <Text className="font-body text-xs text-muted">{new Date(act.createdAt).toLocaleString()}</Text>
                      {act.scoreAdded !== 0 && (
                        <Text className="font-body text-[10px] text-primary font-bold">+{act.scoreAdded} Points</Text>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  return (
    <View className="flex-1 rounded-3xl bg-surface p-4 border border-border shadow-sm">
      <View style={{ backgroundColor: `${color}10` }} className="h-10 w-10 items-center justify-center rounded-2xl mb-3">
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <Text className="font-body text-[10px] font-bold uppercase tracking-widest text-muted">{title}</Text>
      <Text className="mt-1 font-heading text-lg font-bold text-foreground">{value}</Text>
    </View>
  );
}

function TripScheduleSection() {
  const listQuery = trpc.booking.list.useQuery();
  const tripsQuery = trpc.trips.list.useQuery();
  
  const schedules = tripsQuery.data?.map(({ trip }: any) => {
    const tripBookings = listQuery.data?.filter(b => b.tripName === trip.title) || [];
    return {
      id: trip.id,
      title: trip.title,
      totalSeats: trip.seats || 30,
      bookedSeats: tripBookings.reduce((sum, b) => sum + (b as any).participantCount, 0),
    };
  });

  return (
    <View className="mt-6 gap-y-4">
      {schedules?.map((s) => (
        <View key={s.id} className="rounded-2xl border border-border bg-surface p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-heading text-base font-bold text-foreground">{s.title}</Text>
            <Text className="font-body text-xs text-muted">{s.bookedSeats} / {s.totalSeats} Kursi</Text>
          </View>
          <View className="h-2 w-full bg-neutral rounded-full overflow-hidden">
            <View 
              style={{ width: `${Math.min((s.bookedSeats / s.totalSeats) * 100, 100)}%` }} 
              className={`h-full ${s.bookedSeats >= s.totalSeats ? 'bg-error' : 'bg-primary'}`} 
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function ConfigItem({ title, description, onPress }: { title: string; description: string; onPress?: () => void }) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center rounded-2xl border border-border bg-surface p-4"
    >
      <View className="flex-1">
        <Text className="font-heading text-base font-bold text-foreground">{title}</Text>
        <Text className="mt-1 font-body text-xs text-muted">{description}</Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color="#617064" />
    </Pressable>
  );
}

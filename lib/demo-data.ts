export type Trip = {
  id: string;
  title: string;
  location: string;
  province: string;
  type: 'Open Trip' | 'Private Trip';
  image: string;
  date: string;
  duration: string;
  difficulty: 'Pemula' | 'Menengah' | 'Menantang';
  price: number;
  seats: number;
  rating: number;
  tag: string;
  description: string;
  includes: string[];
  itinerary: string[];
  faqs: { id: string; question: string; answer: string }[];
};

export const trips: Trip[] = [
  {
    id: 'bromo-sunrise', title: 'Bromo Sunrise Escape', location: 'Bromo, Jawa Timur', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=85', date: '14–15 Sep 2026', duration: '2 hari 1 malam', difficulty: 'Pemula', price: 875000, seats: 8, rating: 4.9, tag: 'Paling diminati',
    description: 'Menyambut matahari terbit dari Penanjakan, menikmati lautan pasir, dan mengakhiri hari dengan suasana hangat di homestay lokal.',
    includes: ['Transportasi lokal', 'Homestay 1 malam', 'Guide bersertifikat', 'Dokumentasi basic', 'Tiket destinasi'],
    itinerary: ['Hari 1 · Berangkat dari Malang, check-in, briefing keselamatan', 'Hari 2 · Sunrise Penanjakan, Kawah Bromo, Pasir Berbisik, pulang'],
    faqs: [{ id: 'bromo-meeting', question: 'Meeting point-nya di mana?', answer: 'Meeting point dikonfirmasi admin setelah booking, menyesuaikan titik keberangkatan dan kebutuhan peserta.' }, { id: 'bromo-beginner', question: 'Apakah cocok untuk pemula?', answer: 'Cocok. Ritme perjalanan santai dan ada briefing serta pendampingan guide.' }, { id: 'bromo-gear', question: 'Apa yang perlu saya bawa?', answer: 'Bawa jaket hangat, sepatu nyaman, obat pribadi, identitas, dan botol minum.' }],
  },
  {
    id: 'ranu-kumbolo', title: 'Open Trip Ranu Kumbolo', location: 'Semeru, Jawa Timur', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', date: '3–5 Okt 2026', duration: '3 hari 2 malam', difficulty: 'Menengah', price: 900000, seats: 12, rating: 4.8, tag: 'Paket favorit',
    description: 'Nikmati pengalaman camping terbaik di Ranu Kumbolo bersama tim profesional, fasilitas lengkap, dan pelayanan terbaik.',
    includes: ['Tenda dan perlengkapan camp', 'Porter logistik', 'Guide', 'Makan 5x', 'P3K dan safety kit'],
    itinerary: ['Hari 1 · Briefing, perjalanan ke Ranu Pani, bermalam', 'Hari 2 · Trek ke Ranu Kumbolo, camp dan menikmati sunset', 'Hari 3 · Sunrise, turun, evaluasi, kembali ke Malang'],
    faqs: [{ id: 'ranu-permit', question: 'Apakah izin pendakian sudah termasuk?', answer: 'Administrasi kawasan dan kebutuhan izin dibantu sesuai ketentuan yang berlaku pada tanggal perjalanan.' }, { id: 'ranu-fitness', question: 'Seberapa berat treknya?', answer: 'Levelnya menengah. Kamu perlu cukup fit untuk berjalan beberapa jam dengan daypack.' }, { id: 'ranu-weather', question: 'Bagaimana jika cuaca berubah?', answer: 'Guide akan menyesuaikan itinerary berdasarkan kondisi lapangan dan prioritas keselamatan.' }],
  },
  {
    id: 'ijen-private', title: 'Ijen Private Dawn', location: 'Kawah Ijen, Banyuwangi', province: 'Jawa Timur', type: 'Private Trip',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85', date: 'Custom date', duration: '1 hari', difficulty: 'Menengah', price: 2100000, seats: 4, rating: 5.0, tag: 'Private favorite',
    description: 'Rancang perjalanan privat untuk keluarga atau teman dekat menuju blue fire dan panorama Kawah Ijen bersama local guide.',
    includes: ['Mobil private', 'Guide lokal', 'Tiket destinasi', 'Air mineral', 'Dokumentasi'],
    itinerary: ['Malam · Penjemputan dan perjalanan ke Paltuding', 'Dini hari · Trek, sunrise, sarapan lokal, kembali'],
    faqs: [{ id: 'ijen-private-date', question: 'Bisakah memilih tanggal sendiri?', answer: 'Bisa, karena paket ini private. Admin akan mengecek ketersediaan guide dan kendaraan.' }, { id: 'ijen-group', question: 'Berapa jumlah peserta ideal?', answer: 'Paket ini nyaman untuk keluarga atau grup kecil sampai kapasitas yang tercantum.' }, { id: 'ijen-pickup', question: 'Apakah tersedia penjemputan?', answer: 'Penjemputan dapat dirancang dalam itinerary private dan dikonfirmasi bersama admin.' }],
  },
  {
    id: 'b29-weekend', title: 'B29 Weekend Camp', location: 'B29, Lumajang', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', date: '21–22 Nov 2026', duration: '2 hari 1 malam', difficulty: 'Pemula', price: 690000, seats: 12, rating: 4.7, tag: 'Budget friendly',
    description: 'Camping ringan dengan pemandangan negeri di atas awan, cocok untuk first-timer yang ingin mencoba suasana alam tanpa terburu-buru.',
    includes: ['Tenda sharing', 'Transport lokal', 'Makan 3x', 'Guide', 'Tiket kawasan'],
    itinerary: ['Hari 1 · Berangkat, trekking pendek, camp dan api unggun', 'Hari 2 · Sunrise, sarapan, foto grup, kembali'],
    faqs: [{ id: 'b29-camp', question: 'Apakah perlengkapan camping tersedia?', answer: 'Tenda sharing dan perlengkapan dasar camp termasuk dalam paket.' }, { id: 'b29-firsttimer', question: 'Apakah ramah first-timer?', answer: 'Ya. Trek relatif ringan dengan pendampingan guide dan briefing sebelum kegiatan.' }, { id: 'b29-family', question: 'Apakah bisa untuk keluarga?', answer: 'Bisa untuk keluarga yang nyaman dengan aktivitas outdoor ringan dan camping.' }],
  },
];

export const ranuPackages = [
  { id: 'mepo-ranu-pani', name: 'MEPO RANU PANI', price: 900000, meetingPoint: 'Ranu Pani', note: 'Pilihan paling praktis untuk peserta yang datang mandiri.' },
  { id: 'mepo-lumajang', name: 'MEPO LUMAJANG', price: 1150000, meetingPoint: 'Lumajang', note: 'Termasuk koordinasi keberangkatan dari kota Lumajang.' },
  { id: 'mepo-malang', name: 'MEPO MALANG', price: 1300000, meetingPoint: 'Malang', note: 'Meeting point nyaman untuk peserta dari Malang dan sekitarnya.' },
  { id: 'mepo-surabaya', name: 'MEPO SURABAYA', price: 1450000, meetingPoint: 'Surabaya', note: 'Pilihan lengkap dengan koordinasi dari Surabaya.' },
];
export const ranuFacilities = ['SIMAKSI', 'Tour Leader', 'PPGST', 'Welcome Drink', 'Tenda', 'Alat Masak', 'Snack Camp', 'Minuman Isotonik', 'P3K', 'Porter', 'Kursi', 'Meja', 'Sop Buah', 'HT', 'Bantal Tidur', 'Tisu dalam Tenda', 'Kantong Sampah', 'SIMAKSI Ranu Regulo', 'Asuransi', 'Porter Masak', 'Materai', 'Dokumentasi Foto & Video', 'Souvenir'];
export const ranuMeals = ['Breakfast', 'Makan Siang', 'Makan Malam'];
export const ranuTimeline = [
  { day: 'Hari Pertama', items: ['Meeting point', 'Registrasi', 'Menuju Ranu Pani', 'Check SIMAKSI', 'Trekking', 'Sampai Ranu Kumbolo', 'Camping', 'Snack camp', 'Dinner', 'Sharing free time'] },
  { day: 'Hari Kedua', items: ['Sunrise', 'Breakfast', 'Foto', 'Makan siang', 'Packing', 'Turun', 'Finish'] },
];
export const testimonials = [
  { id: 't1', name: 'Nadia Putri', city: 'Surabaya', rating: 5, quote: 'Briefing jelas, fasilitas lengkap, dan timnya sigap dari meeting point sampai turun.' },
  { id: 't2', name: 'Fajar Ramadhan', city: 'Malang', rating: 5, quote: 'Ranu Kumbolo jadi terasa lebih nyaman untuk first-timer karena semua kebutuhan sudah terkoordinasi.' },
  { id: 't3', name: 'Aulia Sari', city: 'Lumajang', rating: 5, quote: 'Dokumentasi dan pelayanan guide sangat membantu. Pemandangannya luar biasa.' },
];

export const guides = [
  { name: 'Arif Pratama', role: 'Lead Guide', experience: '8 tahun pengalaman', rating: 4.9, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' },
  { name: 'Sinta Ayuning', role: 'Mountain Guide', experience: 'Spesialis Semeru & Bromo', rating: 5.0, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' },
];

export const gallery = [
  { id: 'ranu1', title: 'Ranu Kumbolo Lake', category: 'Ranu Kumbolo', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80' },
  { id: 'ranu2', title: 'Morning at the Lake', category: 'Ranu Kumbolo', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80' },
  { id: 'ranu3', title: 'Camp on the Ridge', category: 'Ranu Kumbolo', image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=900&q=80' },
  { id: 'ranu4', title: 'Trail Friends', category: 'Ranu Kumbolo', image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=80' },
  { id: 'semeru1', title: 'Semeru Landscape', category: 'Semeru', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80' },
  { id: 'semeru2', title: 'Mountain Trail', category: 'Semeru', image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=80' },
  { id: 'bromo1', title: 'Bromo Sunrise', category: 'Gunung Bromo', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80' },
  { id: 'bromo2', title: 'Sea of Sand', category: 'Gunung Bromo', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80' },
  { id: 'b29-1', title: 'Sunrise B29', category: 'Sunrise B29', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80' },
  { id: 'b29-2', title: 'Cloudline Camp', category: 'Sunrise B29', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80' },
  { id: 'g1', title: 'Sunrise Penanjakan', category: 'Sunrise', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80' },
  { id: 'g2', title: 'Ranu Kumbolo Morning', category: 'Pendakian', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
  { id: 'g3', title: 'Campfire Stories', category: 'Camping', image: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=800&q=80' },
  { id: 'g4', title: 'Trail Friends', category: 'Group', image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80' },
  { id: 'g5', title: 'Forest Breath', category: 'Landscape', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
  { id: 'g6', title: 'Cloudline', category: 'Landscape', image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=800&q=80' },
];

export const journals = [
  { id: 'j1', category: 'Persiapan', title: 'Checklist pendakian pertama: ringan, aman, dan tidak berlebihan', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80', excerpt: 'Mulai dari pakaian, air, sampai cara membaca kondisi badan sebelum berangkat.' },
  { id: 'j2', category: 'Destinasi', title: 'Kenapa Bromo selalu punya cara baru untuk membuat kita berhenti', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=900&q=80', excerpt: 'Panduan menikmati Bromo dengan ritme yang lebih mindful dan bertanggung jawab.' },
  { id: 'j3', category: 'Tips', title: 'Cara memilih trip yang cocok dengan level pengalamanmu', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80', excerpt: 'Kenali tingkat kesulitan, durasi, dan support system yang kamu butuhkan.' },
];

export const rules = [
  { title: 'Pastikan izin dan registrasi sesuai ketentuan', body: 'Gunakan jalur resmi dan ikuti status buka-tutup kawasan sebelum berangkat.', tone: 'warning' },
  { title: 'Kondisi fisik adalah syarat utama', body: 'Tunda perjalanan bila mengalami demam, sesak, atau kondisi yang dapat membahayakan diri.', tone: 'neutral' },
  { title: 'Bawa turun kembali semua sampah', body: 'Gunakan prinsip Leave No Trace dan hormati warga, flora, fauna, serta peserta lain.', tone: 'success' },
];

export const formatIDR = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
export const buildBookingWhatsAppMessage = ({ tripName, date, participants }: { tripName: string; date: string; participants: number }) => `Halo Or.Trip Adventure, saya ingin booking ${tripName}.\nTanggal: ${date}\nJumlah peserta: ${participants}`;
export const isBookingConsentComplete = (privacyAccepted: boolean, termsAccepted: boolean) => privacyAccepted && termsAccepted;
export const getTrip = (id?: string) => trips.find((trip) => trip.id === id) ?? trips[0];
export const getRanuPackage = (id?: string) => ranuPackages.find((item) => item.id === id) ?? ranuPackages[0];


export const officialContacts = {
  company: 'PT Jaya Abadi Lumajang',
  email: 'ptjayaabadilumajang@gmail.com',
  admins: [
    { label: 'Admin 1', phone: '085856602819' },
    { label: 'Admin 2', phone: '085927214806' },
    { label: 'Admin 3', phone: '0895325521587' },
  ],
  whatsapp: '6285856602819',
  instagram: 'https://www.instagram.com/or__trip?igsh=MXEycGd2dWdsN3VvbQ==',
  tiktok: 'https://www.tiktok.com/@openrekantripadventure?_r=1&_t=ZS-98yTMWyamub',
  website: 'https://ortrip-adventure.base44.app',
};

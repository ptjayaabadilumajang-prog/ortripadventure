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
};

export const trips: Trip[] = [
  {
    id: 'bromo-sunrise', title: 'Bromo Sunrise Escape', location: 'Bromo, Jawa Timur', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=85', date: '14–15 Sep 2026', duration: '2 hari 1 malam', difficulty: 'Pemula', price: 875000, seats: 8, rating: 4.9, tag: 'Paling diminati',
    description: 'Menyambut matahari terbit dari Penanjakan, menikmati lautan pasir, dan mengakhiri hari dengan suasana hangat di homestay lokal.',
    includes: ['Transportasi lokal', 'Homestay 1 malam', 'Guide bersertifikat', 'Dokumentasi basic', 'Tiket destinasi'],
    itinerary: ['Hari 1 · Berangkat dari Malang, check-in, briefing keselamatan', 'Hari 2 · Sunrise Penanjakan, Kawah Bromo, Pasir Berbisik, pulang'],
  },
  {
    id: 'ranu-kumbolo', title: 'Ranu Kumbolo Slow Hike', location: 'Semeru, Jawa Timur', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', date: '3–5 Okt 2026', duration: '3 hari 2 malam', difficulty: 'Menengah', price: 1450000, seats: 5, rating: 4.8, tag: 'New departure',
    description: 'Pendakian santai untuk menikmati Ranu Kumbolo dengan ritme yang aman, pendampingan guide, dan briefing persiapan lengkap.',
    includes: ['Tenda dan perlengkapan camp', 'Porter logistik', 'Guide', 'Makan 5x', 'P3K dan safety kit'],
    itinerary: ['Hari 1 · Briefing, perjalanan ke Ranu Pani, bermalam', 'Hari 2 · Trek ke Ranu Kumbolo, camp dan menikmati sunset', 'Hari 3 · Sunrise, turun, evaluasi, kembali ke Malang'],
  },
  {
    id: 'ijen-private', title: 'Ijen Private Dawn', location: 'Kawah Ijen, Banyuwangi', province: 'Jawa Timur', type: 'Private Trip',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85', date: 'Custom date', duration: '1 hari', difficulty: 'Menengah', price: 2100000, seats: 4, rating: 5.0, tag: 'Private favorite',
    description: 'Rancang perjalanan privat untuk keluarga atau teman dekat menuju blue fire dan panorama Kawah Ijen bersama local guide.',
    includes: ['Mobil private', 'Guide lokal', 'Tiket destinasi', 'Air mineral', 'Dokumentasi'],
    itinerary: ['Malam · Penjemputan dan perjalanan ke Paltuding', 'Dini hari · Trek, sunrise, sarapan lokal, kembali'],
  },
  {
    id: 'b29-weekend', title: 'B29 Weekend Camp', location: 'B29, Lumajang', province: 'Jawa Timur', type: 'Open Trip',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85', date: '21–22 Nov 2026', duration: '2 hari 1 malam', difficulty: 'Pemula', price: 690000, seats: 12, rating: 4.7, tag: 'Budget friendly',
    description: 'Camping ringan dengan pemandangan negeri di atas awan, cocok untuk first-timer yang ingin mencoba suasana alam tanpa terburu-buru.',
    includes: ['Tenda sharing', 'Transport lokal', 'Makan 3x', 'Guide', 'Tiket kawasan'],
    itinerary: ['Hari 1 · Berangkat, trekking pendek, camp dan api unggun', 'Hari 2 · Sunrise, sarapan, foto grup, kembali'],
  },
];

export const guides = [
  { name: 'Arif Pratama', role: 'Lead Guide', experience: '8 tahun pengalaman', rating: 4.9, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80' },
  { name: 'Sinta Ayuning', role: 'Mountain Guide', experience: 'Spesialis Semeru & Bromo', rating: 5.0, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80' },
];

export const gallery = [
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
export const getTrip = (id?: string) => trips.find((trip) => trip.id === id) ?? trips[0];


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

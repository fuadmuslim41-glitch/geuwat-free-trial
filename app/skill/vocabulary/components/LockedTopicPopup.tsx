'use client';

import { X, Sparkles } from 'lucide-react';
import type { VocabularyTopicId } from '../topic/data/types';

interface LockedTopicPopupProps {
  topicId: VocabularyTopicId;
  topicTitle: string;
  onClose: () => void;
}

const TOPIC_TEASER_CONTENT: Record<string, { headline: string; features: string[] }> = {
  color: {
    headline: 'Kuasai Semua Warna dalam Bahasa Inggris!',
    features: [
      '🎨 50+ kosakata warna dari basic sampai advanced',
      '💬 Contoh kalimat praktis untuk deskripsi sehari-hari',
      '🎯 Latihan interaktif dengan gambar dan audio',
      '✨ Tips menggunakan warna dalam fashion, desain, dan percakapan',
    ],
  },
  size: {
    headline: 'Deskripsikan Ukuran dengan Tepat!',
    features: [
      '📏 Kosakata lengkap untuk semua jenis ukuran',
      '💬 Cara membandingkan benda dengan natural',
      '🎯 Latihan praktis untuk shopping dan daily conversation',
      '✨ Frasa umum seperti "too big", "just right", "way too small"',
    ],
  },
  'body-parts': {
    headline: 'Kenali Semua Bagian Tubuh dalam Bahasa Inggris!',
    features: [
      '🫀 100+ kosakata body parts dari head to toe',
      '💬 Contoh kalimat untuk konteks kesehatan dan olahraga',
      '🎯 Audio pronunciation untuk setiap kata',
      '✨ Idiom dan ekspresi yang menggunakan body parts',
    ],
  },
  family: {
    headline: 'Ceritakan Keluargamu dengan Lancar!',
    features: [
      '👨‍👩‍👧‍👦 Kosakata lengkap family tree dari inti sampai extended family',
      '💬 Dialog praktis untuk memperkenalkan keluarga',
      '🎯 Latihan menceritakan family activities',
      '✨ Cultural notes tentang family terms di berbagai negara',
    ],
  },
  'daily-routines': {
    headline: 'Ceritakan Rutinitas Harianmu dengan Percaya Diri!',
    features: [
      '⏰ 80+ aktivitas harian dari wake up sampai sleep',
      '💬 Time expressions dan sequence words',
      '🎯 Latihan menyusun daily schedule dalam bahasa Inggris',
      '✨ Phrasal verbs umum untuk daily activities',
    ],
  },
  home: {
    headline: 'Deskripsikan Rumahmu dengan Detail!',
    features: [
      '🏠 150+ kosakata ruangan, furniture, dan home appliances',
      '💬 Cara menjelaskan layout rumah dan lokasi benda',
      '🎯 Latihan praktis untuk real estate dan home tour',
      '✨ Vocabulary untuk home maintenance dan decoration',
    ],
  },
  'time-date': {
    headline: 'Master Waktu dan Tanggal dalam Bahasa Inggris!',
    features: [
      '🕐 Semua cara menyebut waktu: formal dan casual',
      '📅 Hari, bulan, tahun, dan cara membaca tanggal',
      '🎯 Time expressions: yesterday, next week, in 2 hours',
      '✨ Latihan membuat appointment dan jadwal',
    ],
  },
  number: {
    headline: 'Kuasai Angka dari Nol sampai Triliun!',
    features: [
      '🔢 Cardinal numbers lengkap dengan pronunciation',
      '💬 Cara menyebut nomor telepon, harga, dan alamat',
      '🎯 Operasi matematika dasar dalam bahasa Inggris',
      '✨ Large numbers dan cara membaca angka panjang',
    ],
  },
  'ordinal-number': {
    headline: 'Urutan dan Ranking dalam Bahasa Inggris!',
    features: [
      '🥇 Ordinal numbers dari first sampai thousandth',
      '💬 Cara menyebut tanggal, floor, dan position',
      '🎯 Latihan untuk ranking, competition, dan sequence',
      '✨ Special cases dan irregular forms',
    ],
  },
  feelings: {
    headline: 'Ekspresikan Perasaanmu dengan Tepat!',
    features: [
      '❤️ 100+ emotion vocabulary dari basic sampai nuanced',
      '💬 Cara natural mengungkapkan perasaan',
      '🎯 Latihan responding to emotions',
      '✨ Idiom dan slang untuk express feelings',
    ],
  },
  transport: {
    headline: 'Navigasi Transportasi dengan Lancar!',
    features: [
      '🚗 Semua jenis kendaraan dan public transportation',
      '💬 Cara bertanya arah dan membeli tiket',
      '🎯 Vocabulary untuk airport, station, dan traffic',
      '✨ Travel phrases dan emergency situations',
    ],
  },
  places: {
    headline: 'Kenali Semua Tempat di Sekitarmu!',
    features: [
      '📍 150+ lokasi umum: public places, buildings, landmarks',
      '💬 Cara menjelaskan lokasi dan memberikan directions',
      '🎯 Latihan praktis untuk city tour dan navigation',
      '✨ Prepositions of place dan location phrases',
    ],
  },
  clothes: {
    headline: 'Fashion Vocabulary untuk Semua Occasion!',
    features: [
      '👔 200+ kosakata pakaian, accessories, dan styles',
      '💬 Cara describe outfit dan fashion preferences',
      '🎯 Shopping phrases dan size vocabulary',
      '✨ Fashion trends dan clothing care terms',
    ],
  },
  food: {
    headline: 'Semua Vocabulary Makanan yang Kamu Butuhkan!',
    features: [
      '🍕 300+ food items dari breakfast sampai dessert',
      '💬 Cara order makanan dan describe taste',
      '🎯 Cooking methods dan food preparation',
      '✨ Restaurant phrases dan dietary restrictions',
    ],
  },
  drinks: {
    headline: 'Pesan Minuman Favoritmu dengan Percaya Diri!',
    features: [
      '☕ 80+ jenis minuman hot dan cold',
      '💬 Cara customize order di café',
      '🎯 Describe taste, temperature, dan preferences',
      '✨ Barista terms dan drink recipes',
    ],
  },
  weather: {
    headline: 'Ngobrol Cuaca Seperti Native Speaker!',
    features: [
      '🌤️ Semua weather conditions dan phenomena',
      '💬 Weather forecast vocabulary',
      '🎯 Cara describe temperature dan seasons',
      '✨ Weather idioms dan small talk phrases',
    ],
  },
  taste: {
    headline: 'Deskripsikan Rasa dengan Akurat!',
    features: [
      '😋 50+ taste descriptors: sweet, savory, umami, dll',
      '💬 Cara give feedback tentang makanan',
      '🎯 Intensity words: slightly, very, extremely',
      '✨ Food review vocabulary dan culinary terms',
    ],
  },
  vegetables: {
    headline: 'Kenali Semua Sayuran dalam Bahasa Inggris!',
    features: [
      '🥬 100+ vegetables dari common sampai exotic',
      '💬 Cara belanja di pasar dan grocery store',
      '🎯 Cooking vegetables dan preparation methods',
      '✨ Nutrition vocabulary dan health benefits',
    ],
  },
  fruit: {
    headline: 'Master Vocabulary Buah-buahan!',
    features: [
      '🍎 80+ fruits dengan pronunciation guide',
      '💬 Describe ripeness, taste, dan texture',
      '🎯 Fruit shopping dan selection tips',
      '✨ Tropical fruits dan seasonal vocabulary',
    ],
  },
  school: {
    headline: 'Semua Vocabulary untuk Kehidupan Sekolah!',
    features: [
      '🏫 200+ school-related vocabulary',
      '💬 Classroom language dan school activities',
      '🎯 Subjects, supplies, dan school facilities',
      '✨ Academic phrases dan student life terms',
    ],
  },
  'physical-appearance': {
    headline: 'Deskripsikan Penampilan dengan Sopan dan Akurat!',
    features: [
      '👤 150+ vocabulary untuk describe people',
      '💬 Cara polite mendeskripsikan physical features',
      '🎯 Height, build, hair, face, dan style',
      '✨ Compliments dan positive descriptions',
    ],
  },
  'hobbies-interests': {
    headline: 'Ceritakan Hobimu dengan Antusias!',
    features: [
      '🎨 100+ hobbies dan leisure activities',
      '💬 Cara discuss interests dan preferences',
      '🎯 Indoor/outdoor activities vocabulary',
      '✨ Hobby-related verbs dan expressions',
    ],
  },
  sports: {
    headline: 'Vocabulary Olahraga dari A sampai Z!',
    features: [
      '⚽ 150+ sports, equipment, dan positions',
      '💬 Cara discuss games, scores, dan matches',
      '🎯 Action verbs dan sports idioms',
      '✨ Fitness vocabulary dan workout terms',
    ],
  },
  games: {
    headline: 'Gaming Vocabulary untuk Semua Jenis Permainan!',
    features: [
      '🎮 100+ gaming terms: digital dan traditional',
      '💬 Cara discuss strategy dan gameplay',
      '🎯 Game genres, actions, dan results',
      '✨ Esports vocabulary dan gaming slang',
    ],
  },
  'entertainment-media': {
    headline: 'Ngobrol Film, Musik, dan Media dengan Lancar!',
    features: [
      '🎬 200+ entertainment vocabulary',
      '💬 Cara review movies, music, dan shows',
      '🎯 Media platforms dan content types',
      '✨ Pop culture terms dan trending vocabulary',
    ],
  },
  education: {
    headline: 'Academic Vocabulary untuk Kesuksesan Pendidikan!',
    features: [
      '🎓 150+ education system vocabulary',
      '💬 Cara discuss academic progress',
      '🎯 Degrees, majors, dan educational paths',
      '✨ Study skills dan academic writing terms',
    ],
  },
  shapes: {
    headline: 'Semua Bentuk Geometri dalam Bahasa Inggris!',
    features: [
      '⬛ 50+ shapes dari basic sampai complex',
      '💬 Cara describe objects dan patterns',
      '🎯 2D dan 3D shapes vocabulary',
      '✨ Mathematical terms dan spatial descriptions',
    ],
  },
  electronics: {
    headline: 'Tech Vocabulary untuk Era Digital!',
    features: [
      '📱 150+ electronic devices dan gadgets',
      '💬 Cara discuss features dan specifications',
      '🎯 Troubleshooting vocabulary',
      '✨ Tech trends dan innovation terms',
    ],
  },
  shopping: {
    headline: 'Shopping Vocabulary untuk Belanja Apapun!',
    features: [
      '🛍️ 200+ shopping-related vocabulary',
      '💬 Cara negotiate, ask prices, dan make purchases',
      '🎯 Payment methods dan customer service',
      '✨ Online shopping dan delivery terms',
    ],
  },
  bathroom: {
    headline: 'Bathroom Vocabulary Lengkap!',
    features: [
      '🚿 80+ bathroom items dan activities',
      '💬 Personal hygiene vocabulary',
      '🎯 Bathroom fixtures dan toiletries',
      '✨ Daily routine phrases',
    ],
  },
  kitchen: {
    headline: 'Kitchen Vocabulary untuk Home Chef!',
    features: [
      '🍳 200+ kitchen equipment dan utensils',
      '💬 Cooking verbs dan techniques',
      '🎯 Kitchen appliances dan tools',
      '✨ Recipe vocabulary dan measurements',
    ],
  },
  'social-media': {
    headline: 'Social Media Vocabulary untuk Digital Native!',
    features: [
      '📱 150+ social media terms dan actions',
      '💬 Cara discuss online activities',
      '🎯 Platform features dan content types',
      '✨ Internet slang dan trending phrases',
    ],
  },
};

export default function LockedTopicPopup({ topicId, topicTitle, onClose }: LockedTopicPopupProps) {
  const content = TOPIC_TEASER_CONTENT[topicId] || {
    headline: `Unlock ${topicTitle} Vocabulary!`,
    features: [
      '📚 Ratusan kosakata praktis untuk daily conversation',
      '💬 Contoh kalimat real-life situations',
      '🎯 Latihan interaktif dengan audio pronunciation',
      '✨ Tips dan tricks dari native speakers',
    ],
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-purple-500/30 backdrop-blur-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all duration-200"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl" />

        <div className="relative p-4 md:p-6">
          <div className="text-center mb-3">
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              {content.headline}
            </h2>
            <p className="text-slate-300 text-xs">
              Dapatkan akses ke vocabulary topic <strong className="text-purple-300">{topicTitle}</strong> dengan fitur lengkap:
            </p>
          </div>

          <div className="mb-4 bg-slate-900/50 rounded-xl p-3 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <h3 className="text-sm font-semibold text-purple-300">Fitur yang Anda Dapatkan:</h3>
            </div>
            <ul className="space-y-1.5">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300 text-xs">
                  <span className="text-purple-400 mt-0.5">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-slate-300 mb-2 text-xs">
              Daftar sekarang dan unlock <strong className="text-emerald-300">semua 33 vocabulary topics</strong>!
            </p>
            <a
              href="https://learningenglishgeuwat-ten.vercel.app/register"
              className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50"
              target="_blank"
              rel="noopener noreferrer"
            >
              Daftar Sekarang
            </a>
            <p className="mt-2 text-xs text-slate-400">
              🎁 Bonus special untuk pendaftar baru!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

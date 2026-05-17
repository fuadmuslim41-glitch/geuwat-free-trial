# Typography System - Font Size Guidelines

Sistem typography ini mengikuti standar Gemini UI untuk memastikan konsistensi ukuran font di seluruh aplikasi.

## 📏 Ukuran Font Standar

| Elemen | Desktop (Laptop) | Mobile (HP) | Class CSS | Karakteristik |
|--------|------------------|-------------|-----------|---------------|
| **Teks Utama (Body)** | 16px (1rem) | 15px-16px | `.text-body` | Line-height 1.5 (~24px) untuk kenyamanan membaca |
| **Judul Bagian (H2)** | 20px-22px | 18px-20px | `.text-h2` | Font-weight 700, kontras hierarki jelas |
| **Sub-Judul (H3)** | 16px-18px | 15px-16px | `.text-h3` | Font-weight 600, sedikit lebih besar dari body |
| **Blok Kode** | 14px | 13px-14px | `.text-code` | Monospace, ukuran lebih kecil agar tidak wrap |
| **Teks Kecil** | 14px | 13px | `.text-small` | Untuk caption, label |
| **Teks Extra Kecil** | 12px | 11px | `.text-xs-custom` | Untuk metadata, timestamp |

## 🎯 Cara Penggunaan

### 1. Menggunakan Utility Classes

```tsx
// Body text
<p className="text-body">
  Ini adalah teks utama yang nyaman dibaca dengan line-height 1.5
</p>

// Heading 2
<h2 className="text-h2">
  Judul Bagian Utama
</h2>

// Heading 3
<h3 className="text-h3">
  Sub-judul atau Bagian Kecil
</h3>

// Code block
<code className="text-code">
  const example = "monospace code";
</code>

// Small text
<span className="text-small">
  Label atau caption kecil
</span>

// Extra small
<span className="text-xs-custom">
  Metadata atau timestamp
</span>
```

### 2. Elemen HTML Otomatis

Elemen HTML standar sudah mengikuti sistem ini secara otomatis:

```tsx
// Otomatis menggunakan text-body
<p>Paragraf ini sudah mengikuti standar 16px/15px</p>

// Otomatis menggunakan text-h2
<h2>Heading 2 otomatis 22px/20px</h2>

// Otomatis menggunakan text-h3
<h3>Heading 3 otomatis 18px/16px</h3>

// Otomatis menggunakan text-code
<code>Kode otomatis 14px/13px monospace</code>
```

### 3. Button dan Input

```tsx
// Button otomatis 15px/14px
<button>Click Me</button>

// Input tetap 16px untuk mencegah zoom di iOS
<input type="text" placeholder="Email" />
```

## 📱 Responsive Behavior

Sistem ini otomatis menyesuaikan ukuran font berdasarkan viewport:

- **Desktop (≥768px)**: Menggunakan ukuran yang lebih besar
- **Mobile (<768px)**: Menggunakan ukuran yang lebih kecil

Tidak perlu menambahkan media query manual, cukup gunakan class yang tersedia.

## ✅ Best Practices

### DO ✓

```tsx
// Gunakan class utility untuk konsistensi
<p className="text-body">Konten artikel...</p>

// Gunakan semantic HTML
<h2>Judul Bagian</h2>
<h3>Sub-judul</h3>

// Gunakan text-small untuk label
<label className="text-small">Username</label>
```

### DON'T ✗

```tsx
// Jangan hardcode ukuran font
<p className="text-[14px]">Konten...</p>

// Jangan gunakan Tailwind size yang tidak konsisten
<p className="text-sm">Konten...</p> // Gunakan text-body atau text-small

// Jangan override tanpa alasan kuat
<p style={{ fontSize: '13px' }}>Konten...</p>
```

## 🎨 Contoh Implementasi

### Card dengan Typography Konsisten

```tsx
<div className="card">
  <h2 className="text-h2 mb-2">
    Pronunciation Practice
  </h2>
  
  <p className="text-body mb-4">
    Master your English pronunciation with interactive exercises 
    and real-time feedback.
  </p>
  
  <div className="flex items-center gap-2">
    <span className="text-small text-slate-400">
      12 lessons
    </span>
    <span className="text-xs-custom text-slate-500">
      Updated 2 days ago
    </span>
  </div>
  
  <button className="mt-4">
    Start Learning
  </button>
</div>
```

### Code Example dengan Syntax Highlighting

```tsx
<div className="code-block">
  <h3 className="text-h3 mb-2">Example Code</h3>
  <pre className="text-code bg-slate-900 p-4 rounded">
    <code>
      const greeting = "Hello World";
      console.log(greeting);
    </code>
  </pre>
</div>
```

## 🔧 Customization

Jika Anda perlu ukuran khusus untuk kasus tertentu, tambahkan di `globals.css`:

```css
@layer utilities {
  .text-custom-size {
    font-size: 17px;
  }
  
  @media (max-width: 767px) {
    .text-custom-size {
      font-size: 16px;
    }
  }
}
```

## 📚 Referensi

- Line-height untuk body text: **1.5** (24px pada 16px font)
- Line-height untuk headings: **1.3-1.4**
- Line-height untuk code: **1.6**
- Font families:
  - Body: `var(--font-ui)` (Inter, Segoe UI)
  - Display: `var(--font-display)` (Space Grotesk)
  - Code: `var(--font-tech)` (JetBrains Mono)

## 🚀 Migration Guide

Untuk mengupdate komponen existing:

1. Ganti `text-sm`, `text-base`, `text-lg` dengan class baru
2. Ganti hardcoded font-size dengan utility classes
3. Test di mobile dan desktop
4. Pastikan line-height tetap nyaman

```tsx
// Before
<p className="text-base">Content</p>
<h2 className="text-2xl font-bold">Title</h2>

// After
<p className="text-body">Content</p>
<h2 className="text-h2">Title</h2>
```

---

**Note**: Sistem ini dirancang untuk memberikan pengalaman membaca yang optimal di semua device sambil menjaga konsistensi visual di seluruh aplikasi.

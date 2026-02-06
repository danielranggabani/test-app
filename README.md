# Context7-CRM (MasWebsite.id)

Aplikasi CRM AI berbasis web yang dibangun dengan teknologi modern untuk mengotomatisasi manajemen leads, penjadwalan, dan interaksi pelanggan melalui WhatsApp menggunakan Gemini AI.

## 🚀 Teknologi yang Digunakan

*   **Framework:** Next.js 14 (App Router) dengan TypeScript.
*   **Database:** Neon (Serverless Postgres).
*   **ORM:** Drizzle ORM.
*   **Autentikasi:** NextAuth.js (v5) - Credentials Provider.
*   **Styling:** Tailwind CSS + Shadcn UI (Tema Industrial Dark Mode).
*   **AI:** Google Gemini Pro & Gemini Embedding.
*   **Messaging:** Fonnte (WhatsApp Gateway API).
*   **State Management:** Tanstack Query (React Query).

## 📋 Fitur Utama

### 1. 🔐 Sistem Autentikasi Aman
*   Halaman login khusus admin dengan desain industrial.
*   Proteksi middleware untuk semua rute dashboard.
*   Akses level admin.

### 2. 📊 Dashboard Overview (`/dashboard`)
*   **Statistik Realtime:** Menampilkan total chat, leads prioritas (Hot), dan invoice yang belum dibayar langsung dari database.
*   **Action Required:** Tabel prioritas yang otomatis memfilter leads dengan status `waiting_invoice` agar admin tidak melewatkan closing.
*   **Desain:** Minimalis dengan nuansa gelap (Zinc-950) untuk fokus maksimal.

### 3. 💬 Live Chat & Human Handoff (`/chat`)
*   **WhatsApp Web Clone:** Antarmuka familiar untuk memudahkan penggunaan.
*   **Smart Sidebar:** Daftar kontak diurutkan otomatis berdasarkan waktu interaksi terakhir.
*   **AI Toggle Switch:** Fitur eksklusif untuk mematikan/menyalakan AI pada percakapan spesifik. Berguna saat Admin ingin mengambil alih pembicaraan rumit.
*   **Polling Realtime:** Pesan masuk muncul tanpa refresh halaman (interval 3 detik).
*   **Direct Reply:** Balasan admin dari dashboard langsung terkirim ke WhatsApp user via Fonnte.

### 4. 👥 Manajemen Leads (`/leads`)
*   **Database Terpusat:** Menyimpan semua nomor telepon yang menghubungi WhatsApp bisnis Anda.
*   **Status Pipeline:** Lacak perjalanan pelanggan dari Cold -> Warm -> Hot -> Deal.
*   **Quick Update:** Ubah status lead cukup dengan mengklik badge status di tabel.
*   **Needs Summary:** Kolom ringkasan kebutuhan klien yang bisa diisi manual atau otomatis oleh AI (future update).

### 5. 🧠 AI Knowledge Base (`/brain`)
*   **Otak Cadangan:** Tempat Anda melatih AI agar paham produk/jasa MasWebsite.id.
*   **RAG System:** Saat user bertanya, AI akan mencari potongan teks paling relevan di sini sebelum menjawab.
*   **Input Fleksibel:** Tambahkan teks manual, FAQ, atau daftar harga. Sistem otomatis membuat "Embedding" (vektor matematika) agar teks bisa dicari mesin.
*   **Manajemen Konteks:** Hapus data lama yang sudah tidak valid agar AI tidak halusinasi.

### 6. 📅 Penjadwalan (`/schedule`)
*   **Kalender Mingguan:** Visualisasi slot waktu 08:00 - 20:00.
*   **Status Slot:** Warna hijau untuk Available, Putih untuk Booked, dan Abu-abu untuk Istirahat.
*   **Single Source of Truth:** AI akan mengecek tabel ini sebelum menjanjikan waktu meeting ke klien.

### 7. 🤖 WhatsApp AI Automation (Webhook)
*   **Endpoint:** `/api/webhook/whatsapp`
*   **Cara Kerja:**
    1.  **Identifikasi:** Cek apakah pengirim pesan adalah Lead baru atau lama.
    2.  **Filter AI:** Cek apakah fitur AI aktif untuk Lead ini.
    3.  **Retrieval (RAG):** Cari 3 potongan info relevan dari Knowledge Base menggunakan `pgvector` (Cosine Similarity).
    4.  **Prompting:** Gabungkan Konteks + Riwayat Chat + Pertanyaan User -> Kirim ke Gemini Pro.
    5.  **Respon:** Jawaban AI disimpan ke database dan dikirim ke WA User.

---

## 🛠️ Cara Setup Project

### Prasyarat
1.  **Node.js (v18+)**: Runtime environment.
2.  **Akun Neon Database**: Database Postgres serverless. Pastikan ekstensi `vector` aktif.
3.  **Google AI Studio**: Dapatkan API Key untuk Gemini Pro.
4.  **Fonnte**: Layanan gateway WhatsApp (Gratis/Berbayar).

### Langkah Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/context7-crm.git
    cd context7-crm
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (.env)**
    Buat file `.env` di root folder. Salin template berikut:

    ```env
    # Database (Neon Connection String)
    DATABASE_URL="postgres://user:password@host:port/dbname?sslmode=require"

    # Keamanan (Generate string acak bebas)
    AUTH_SECRET="rahasia_super_aman_123"

    # Akun Admin Default (Backdoor untuk login pertama kali)
    ADMIN_EMAIL="admin@maswebsite.id"
    ADMIN_PASSWORD="password123"

    # AI Config
    GEMINI_API_KEY="AIzaSy..."

    # WhatsApp Config (Dashboard Fonnte)
    FONNTE_TOKEN="token_fonnte_anda"
    ```

4.  **Setup Database**
    Jalankan perintah ini untuk membuat tabel di Neon:
    ```bash
    npx drizzle-kit generate   # Membuat file migrasi SQL
    npx drizzle-kit push       # Menerapkan schema ke DB Cloud
    ```

5.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka browser di [http://localhost:3000](http://localhost:3000).

### Langkah Integrasi WhatsApp (Webhook)

1.  Pastikan aplikasi Anda sudah online (deploy ke Vercel/VPS) agar punya domain publik (https).
2.  Buka Dashboard Fonnte -> Device.
3.  Scan QR Code dengan WhatsApp Bisnis Anda.
4.  Masuk ke menu **Webhook**.
5.  Isi URL: `https://domain-anda.com/api/webhook/whatsapp`.
6.  Centang status "Active".

---

## 📚 Struktur Database

Berikut adalah gambaran tabel utama dalam sistem:

*   **users**: Menyimpan data login admin.
*   **leads**: Data prospek (No HP, Nama, Status, AI Active).
*   **chats**: Riwayat percakapan (User, AI, Admin).
*   **knowledge_base**: Data pelatihan AI + Vektor Embedding (768 dimensi).
*   **availability_slots**: Jadwal booking meeting.

---

## 🔧 Troubleshooting

*   **AI Menjawab "Maaf, saya sedang mengalami gangguan"**:
    *   Cek `GEMINI_API_KEY` di `.env`.
    *   Pastikan kuota API Google belum habis.
*   **Pesan tidak masuk ke Dashboard**:
    *   Cek koneksi internet server.
    *   Pastikan Webhook Fonnte sudah diset dengan benar.
*   **Login Gagal**:
    *   Pastikan email/password sesuai dengan `.env` atau data di tabel `users`.

---

## 🤖 Mengubah Persona AI

Anda dapat mengubah gaya bahasa atau aturan AI dengan mengedit file:
`src/app/api/webhook/whatsapp/route.ts`

Cari bagian `const systemPrompt` dan ubah teks di dalamnya:
```typescript
const systemPrompt = `
You are Rangga's Assistant...
RULES:
1. ...
`
```

---

## 🎨 Design System
*   **Tema:** Industrial Minimalist.
*   **Warna Utama:** Hitam (Zinc-950), Putih (Zinc-50), Abu-abu (Zinc-800).
*   **Library:** Shadcn UI + Tailwind CSS.

---

## 🤝 Kontribusi
Project ini dikembangkan khusus untuk MasWebsite.id.

License: Private / Proprietary.

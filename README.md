# Context7-CRM (MasWebsite.id)

Aplikasi CRM AI berbasis web yang dibangun dengan teknologi modern untuk mengotomatisasi manajemen leads, penjadwalan, dan interaksi pelanggan melalui WhatsApp menggunakan Gemini AI.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Tech](https://img.shields.io/badge/Tech-Next.js%2014%20%7C%20Neon%20%7C%20Gemini-blue)

## 🚀 Teknologi & Stack

*   **Framework:** Next.js 14 (App Router) dengan TypeScript.
*   **Database:** Neon (Serverless Postgres) + `pgvector`.
*   **ORM:** Drizzle ORM (Type-safe SQL).
*   **Autentikasi:** NextAuth.js (v5) - Credentials Provider.
*   **Styling:** Tailwind CSS + Shadcn UI (Tema Industrial Dark Mode).
*   **AI Engine:**
    *   Generative: Google Gemini Pro.
    *   Vector Search: Gemini Embedding-001.
*   **Messaging:** Fonnte (Unofficial WhatsApp Gateway API).
*   **State Management:** Tanstack Query (React Query) untuk real-time polling.

---

## 🏛️ Arsitektur Sistem

Sistem ini bekerja dengan menggabungkan Database Relasional untuk data bisnis dan Vector Search untuk memori AI.

### Alur Pesan Masuk (Webhook)
```mermaid
graph TD
    A[User WhatsApp] -->|Kirim Pesan| B(Fonnte Gateway)
    B -->|Webhook POST| C{Next.js API Route}
    C -->|1. Cek User| D[Neon DB: Leads Table]
    C -->|2. Cek AI Active?| E{AI Switch}
    E -- OFF --> F[Stop / Simpan Chat Saja]
    E -- ON --> G[Gemini Embedding]
    G -->|Vector Search| H[Neon DB: Knowledge Base]
    H -->|3. Retrieve Context| I[Gemini Pro LLM]
    I -->|Prompt Engineering| J[Generate Jawaban]
    J -->|4. Simpan & Kirim| K[Fonnte Send API]
    K --> A
```

---

## 📋 Fitur Utama & Panduan Penggunaan

### 1. 🔐 Sistem Autentikasi Aman
*   Halaman login khusus admin (`/login`) dengan desain industrial.
*   Proteksi middleware: User yang belum login akan otomatis dialihkan.
*   **Keamanan:** Password di-hash menggunakan bcrypt.

### 2. 📊 Dashboard Overview (`/dashboard`)
Pusat kontrol utama untuk melihat kesehatan bisnis secara realtime.
*   **Card Total Chat:** Menghitung total interaksi yang terjadi dalam sistem.
*   **Card Hot Leads:** Jumlah prospek potensial yang siap closing.
*   **Action Required:** Tabel prioritas yang **HANYA** menampilkan leads dengan status `waiting_invoice`.
    *   *Skenario:* Admin login pagi hari, langsung cek tabel ini untuk memproses tagihan yang tertunda.

### 3. 💬 Live Chat & Human Handoff (`/chat`)
Antarmuka chat yang terhubung langsung ke database dan WhatsApp user.
*   **Sidebar:** Daftar kontak diurutkan berdasarkan pesan terbaru.
*   **AI Toggle Switch (PENTING):**
    *   *ON:* AI menjawab otomatis setiap pesan masuk.
    *   *OFF:* AI diam. Gunakan ini saat Admin ingin mengambil alih percakapan (misal: negosiasi harga rumit atau menangani komplain).
*   **Polling Realtime:** Pesan baru dari WhatsApp user akan muncul di layar dalam 3 detik tanpa perlu refresh browser.

### 4. 👥 Manajemen Leads (`/leads`)
CRM sederhana untuk melacak status pelanggan.
*   **Status Pipeline:**
    *   `Cold`: Baru bertanya, belum ada minat jelas.
    *   `Warm`: Mulai tanya harga/detail.
    *   `Hot`: Sangat tertarik, minta diskon/meeting.
    *   `Waiting Invoice`: Menunggu pembayaran.
    *   `Deal`: Sudah bayar.
*   **Cara Update:** Klik langsung pada badge status di tabel untuk mengubahnya ke tahap selanjutnya.

### 5. 🧠 AI Knowledge Base (`/brain`)
"Otak" cadangan untuk AI. Di sini Anda menyimpan SOP, Harga, dan FAQ.
*   **Cara Menambah Data:**
    1.  Klik "Add New Data".
    2.  Ketik/Paste teks (misal: "Harga Paket Basic Rp 2.000.000, fitur A, B, C").
    3.  Klik Simpan. Sistem otomatis mengubah teks menjadi *Vector Embedding*.
*   **Skenario:** Jika Anda mengubah harga, hapus data lama di sini dan tambahkan data harga baru agar AI tidak memberikan info kadaluarsa.

### 6. 📅 Penjadwalan (`/schedule`)
*   Visualisasi ketersediaan waktu tim.
*   AI akan membaca data di tabel ini (via RAG) sebelum menjanjikan waktu meeting ke klien.
*   *Note:* Saat ini fitur booking otomatis oleh AI masih dalam tahap pengembangan (Roadmap v2).

---

## 🛠️ Cara Setup Project (Lengkap)

### 1. Persiapan Akun & API Key
Sebelum coding, pastikan Anda memiliki:
*   **Neon Database:** Buat project baru, pilih Postgres. Salin `Connection String`.
*   **Google AI Studio:** Buat API Key untuk Gemini Pro.
*   **Fonnte:** Daftar di [fonnte.com](https://fonnte.com), hubungkan WhatsApp, dan salin Token API.

### 2. Instalasi Lokal
```bash
# Clone repo
git clone https://github.com/username/context7-crm.git
cd context7-crm

# Install paket
npm install
```

### 3. Konfigurasi Environment (.env)
Buat file `.env` di root project. **JANGAN SAMPAI SALAH COPY**.

```env
# DATABASE (Neon)
# Pastikan ada ?sslmode=require di ujungnya
DATABASE_URL="postgres://user:password@ep-xyz.aws.neon.tech/dbname?sslmode=require"

# KEAMANAN
# Generate random string: openssl rand -base64 32
AUTH_SECRET="rahasia_super_aman_123"

# AKUN ADMIN (Initial Setup)
ADMIN_EMAIL="admin@maswebsite.id"
ADMIN_PASSWORD="password123"

# GOOGLE AI
GEMINI_API_KEY="AIzaSy..."

# WHATSAPP (Fonnte)
FONNTE_TOKEN="token_fonnte_anda"
```

### 4. Database Push
Kirim struktur tabel (Schema) ke Neon.
```bash
npx drizzle-kit push
```
*Jika sukses, Anda akan melihat pesan "Changes applied".*

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Akses di `http://localhost:3000`.

### 6. Setup Webhook (Agar AI Membalas)
1.  Pastikan aplikasi sudah dideploy ke internet (misal: Vercel). URL lokal (`localhost`) **TIDAK BISA** menerima webhook dari Fonnte.
2.  Buka Dashboard Fonnte -> Menu Webhook.
3.  Isi URL: `https://nama-project-anda.vercel.app/api/webhook/whatsapp`.
4.  Centang status "Active".
5.  Simpan.

---

## 🔒 Security Best Practices

1.  **Environment Variables:** Jangan pernah commit file `.env` ke GitHub. Pastikan `.gitignore` sudah mencakup `.env`.
2.  **Admin Password:** Segera ubah logika login di `src/auth.ts` untuk tidak lagi menggunakan hardcoded password setelah fase setup selesai, atau ganti password di `.env` dengan string yang sangat kuat.
3.  **Middleware:** Selalu cek apakah route baru yang Anda buat sudah tercover oleh `middleware.ts` agar tidak bisa diakses publik.

---

## 🔧 Troubleshooting

### AI Tidak Menjawab
*   Cek `GEMINI_API_KEY`.
*   Cek apakah fitur "AI Auto-Reply" di halaman `/chat` untuk user tersebut sedang OFF?
*   Cek log Vercel/Terminal: Apakah ada error `quota exceeded` dari Google?

### Pesan Webhook Gagal (Fonnte)
*   Pastikan URL webhook di Fonnte benar (menggunakan HTTPS).
*   Cek apakah server Anda (Vercel) sedang down/maintenance.

### Database Error (ECONNREFUSED)
*   Ini biasanya terjadi saat build lokal tanpa koneksi internet yang stabil ke Neon.
*   Solusi: Pastikan koneksi internet lancar, atau set `DATABASE_URL` dengan benar.

---

## 🤝 Kontribusi & Lisensi
Dikembangkan oleh Tim Teknis MasWebsite.id.
Dilarang mendistribusikan ulang tanpa izin.

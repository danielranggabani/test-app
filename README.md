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
*   Statistik realtime dari Database: Total Chat, Hot Leads, Pending Invoice.
*   Tabel "Action Required" mengambil data leads dengan status `waiting_invoice`.
*   Desain minimalis dan informatif.

### 3. 💬 Live Chat & Human Handoff (`/chat`)
*   Antarmuka chat mirip WhatsApp Web terhubung langsung ke Database.
*   Sidebar daftar kontak diurutkan berdasarkan interaksi terakhir.
*   **Toggle AI:** Aktifkan/Nonaktifkan AI untuk lead tertentu langsung dari UI.
*   **Polling Realtime:** Pesan baru muncul otomatis tanpa refresh halaman.
*   **Kirim Pesan:** Admin dapat membalas pesan langsung yang terkirim ke WhatsApp user via Fonnte.

### 4. 👥 Manajemen Leads (`/leads`)
*   Tabel data prospek terpusat dari Database.
*   Status tracking interaktif: Klik badge status untuk mengubah (Cold -> Warm -> Hot -> Deal).
*   Ringkasan kebutuhan klien (Summary Needs).

### 5. 🧠 AI Knowledge Base (`/brain`)
*   Pusat data untuk melatih AI (RAG - Retrieval Augmented Generation).
*   **Input Data:** Tambahkan teks/konteks bisnis baru yang otomatis di-embedding menggunakan Gemini.
*   **Manajemen:** Hapus data konteks lama.
*   Tampilan Grid Masonry untuk dokumen.

### 6. 📅 Penjadwalan (`/schedule`)
*   Kalender mingguan interaktif.
*   Visualisasi slot waktu: Available, Booked, Lunch Break.
*   Manajemen ketersediaan untuk AI.

### 7. 🤖 WhatsApp AI Automation (Webhook)
*   Endpoint terintegrasi: `/api/webhook/whatsapp`.
*   **Alur Logika Cerdas:**
    1.  **Cek Konteks:** Identifikasi Lead berdasarkan nomor telepon.
    2.  **Cek Status AI:** Jika fitur AI dimatikan untuk lead tersebut, bot tidak akan menjawab.
    3.  **RAG Search:** Mencari data relevan di `knowledge_base` menggunakan `pgvector`.
    4.  **Generasi Jawaban:** Gemini Pro menyusun jawaban berdasarkan konteks dan riwayat chat.
    5.  **Eksekusi:** Jawaban dikirim otomatis ke WhatsApp pengguna.

---

## 🛠️ Cara Setup Project

### Prasyarat
*   Node.js (v18+)
*   Akun Neon Database (Postgres) dengan ekstensi `vector` aktif.
*   API Key Google Gemini (AI Studio).
*   Akun Fonnte (untuk WhatsApp Gateway).

### Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/context7-crm.git
    cd context7-crm
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` di root project dan isi dengan konfigurasi berikut:

    ```env
    # Database (Neon)
    DATABASE_URL="postgres://user:password@host:port/dbname?sslmode=require"

    # Authentication
    AUTH_SECRET="rahasia_super_aman_generate_string_acak"

    # Admin Backdoor (Untuk Setup Awal)
    ADMIN_EMAIL="admin@maswebsite.id"
    ADMIN_PASSWORD="password123"

    # AI (Gemini)
    GEMINI_API_KEY="isi_dengan_api_key_google_anda"

    # WhatsApp (Fonnte)
    # Dapatkan token di dashboard.fonnte.com
    FONNTE_TOKEN="isi_dengan_token_fonnte_anda"
    ```

4.  **Database Migration (Drizzle)**
    Generate dan push schema ke database Neon:
    ```bash
    npx drizzle-kit generate
    npx drizzle-kit push
    ```

5.  **Jalankan Aplikasi (Development)**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

### Cara Menggunakan

1.  **Login Admin:** Masuk ke `/login` menggunakan email dan password yang diset di `.env`.
2.  **Knowledge Base:** Masuk ke menu "AI Brain" (`/brain`) dan isi data bisnis (Harga, FAQ, dll) agar AI memiliki konteks awal.
3.  **WhatsApp Integration:**
    *   Setup akun Fonnte dan scan QR Code WhatsApp.
    *   Di Dashboard Fonnte, set webhook URL ke `https://domain-anda.com/api/webhook/whatsapp`.
    *   Pastikan opsi "Webhook Status" aktif.

---

## 🎨 Design System
Project ini menggunakan **Shadcn UI** dengan kustomisasi warna **Zinc (Monochrome)** untuk menciptakan nuansa "Industrial Professional".

*   **Background:** `#09090b` (Zinc 950)
*   **Foreground:** `#fafafa` (Zinc 50)
*   **Accent:** `#18181b` (Zinc 900)

---

## 🤝 Kontribusi
Project ini dikembangkan khusus untuk MasWebsite.id.

License: Private / Proprietary.

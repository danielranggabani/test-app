# Context7-CRM (MasWebsite.id)

Aplikasi CRM AI berbasis web yang dibangun dengan teknologi modern untuk mengotomatisasi manajemen leads, penjadwalan, dan interaksi pelanggan melalui WhatsApp menggunakan Gemini AI.

## 🚀 Teknologi yang Digunakan

*   **Framework:** Next.js 14 (App Router) dengan TypeScript.
*   **Database:** Neon (Serverless Postgres).
*   **ORM:** Drizzle ORM.
*   **Autentikasi:** NextAuth.js (v5) - Credentials Provider.
*   **Styling:** Tailwind CSS + Shadcn UI (Tema Industrial Dark Mode).
*   **AI:** Google Gemini Pro & Gemini Embedding.
*   **State Management:** Tanstack Query (React Query).

## 📋 Fitur Utama

### 1. 🔐 Sistem Autentikasi Aman
*   Halaman login khusus admin dengan desain industrial.
*   Proteksi middleware untuk semua rute dashboard.
*   Akses level admin.

### 2. 📊 Dashboard Overview (`/dashboard`)
*   Statistik realtime: Total Chat, Hot Leads, Pending Invoice.
*   Tabel "Action Required" untuk prioritas tugas.
*   Desain minimalis dan informatif.

### 3. 💬 Live Chat & Human Handoff (`/chat`)
*   Antarmuka chat mirip WhatsApp Web.
*   Sidebar daftar kontak dengan status.
*   **Toggle AI:** Aktifkan/Nonaktifkan AI untuk mengambil alih percakapan.
*   Simulasi realtime dengan polling data.

### 4. 👥 Manajemen Leads (`/leads`)
*   Tabel data prospek terpusat.
*   Status tracking: Cold, Warm, Hot, Deal.
*   Ringkasan kebutuhan klien (Summary Needs).

### 5. 🧠 AI Knowledge Base (`/brain`)
*   Pusat data untuk melatih AI (RAG - Retrieval Augmented Generation).
*   Mendukung input teks manual, PDF, dan link web (Stub).
*   Tampilan Grid Masonry untuk dokumen.

### 6. 📅 Penjadwalan (`/schedule`)
*   Kalender mingguan interaktif.
*   Visualisasi slot waktu: Available, Booked, Lunch Break.
*   Manajemen ketersediaan untuk AI.

### 7. 🤖 WhatsApp AI Automation (Webhook)
*   Endpoint terintegrasi untuk Fonnte/WhatsApp Gateway.
*   Logika otomatis:
    1.  Cek konteks user (Lead baru/lama).
    2.  Pencarian RAG (Retrieval) dari Knowledge Base.
    3.  Generasi jawaban via Gemini Pro.
    4.  Penyimpanan riwayat chat.

---

## 🛠️ Cara Setup Project

### Prasyarat
*   Node.js (v18+)
*   Akun Neon Database (Postgres)
*   API Key Google Gemini

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
2.  **Dashboard:** Pantau statistik utama.
3.  **Knowledge Base:** Masuk ke menu "AI Brain" (`/brain`) dan tambahkan data bisnis (Harga, FAQ, dll) agar AI bisa menjawab pertanyaan pelanggan.
4.  **WhatsApp Integration:**
    *   Setup akun Fonnte atau Gateway WA lainnya.
    *   Set webhook URL ke `https://domain-anda.com/api/webhook/whatsapp`.

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

# 📋 PLAN.md — VestPrompt

> **AI Prompt Optimizer for the Terminal**
> Dokumen perencanaan teknis & roadmap pengembangan resmi untuk project `vestprompt`.

<p align="center">
  <b>Status:</b> 🟡 In Development &nbsp;|&nbsp; <b>Version:</b> 0.1.0 (Pre-Alpha) &nbsp;|&nbsp; <b>License:</b> MIT
</p>

---

## Daftar Isi

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Core Features & Specifications](#2-core-features--specifications)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Architecture & File Structure](#4-architecture--file-structure)
5. [Development Phases (Roadmap)](#5-development-phases-roadmap)
6. [Future Enhancements](#6-future-enhancements)

---

## 1. Project Overview & Goals

### 1.1 Apa itu VestPrompt?

**VestPrompt** adalah sebuah *CLI Tool* berbasis Node.js yang berfungsi sebagai **AI Prompt Optimizer**. Tool ini memungkinkan developer, prompt engineer, maupun pengguna umum untuk mengubah prompt yang masih kasar, ambigu, atau kurang terstruktur menjadi prompt yang **matang, presisi, dan siap pakai** — semua dilakukan secara instan langsung dari terminal, tanpa perlu membuka browser atau aplikasi tambahan.

VestPrompt memanfaatkan kekuatan **Gemini API** dengan model *reasoning* (`gemini-2.0-flash-thinking-exp`) untuk melakukan analisis mendalam terhadap *intent* pengguna sebelum menghasilkan output akhir, sehingga hasil optimasi prompt memiliki kualitas setara standar industri.

> 💡 **Filosofi Produk:** *"Type rough, get sharp."* — VestPrompt menjembatani gap antara ide kasar dan prompt profesional dalam hitungan detik.

### 1.2 Tujuan Utama

| Tujuan | Deskripsi | Indikator Keberhasilan |
|---|---|---|
| **⚡ Efisiensi** | Dapat dijalankan sebagai perintah global (`vestprompt`) dari direktori mana pun di terminal, tanpa perlu `cd` ke folder project. | Command dapat dipanggil dari root, subfolder, maupun home directory lain tanpa error path. |
| **🎯 Kualitas** | Menggunakan *thinking model* Gemini untuk menganalisis konteks & intent sebelum menghasilkan prompt akhir, bukan sekadar *rewriting* biasa. | Output prompt mengikuti best-practice prompt engineering (clarity, context, constraints, format). |

---

## 2. Core Features & Specifications

### 2.1 Global CLI Executable

- Dikonfigurasi melalui field `bin` pada `package.json` agar dikenali sebagai *executable command*.
- Menggunakan `npm link` selama fase development untuk membuat symlink global ke sistem lokal.
- Menyertakan **shebang line** (`#!/usr/bin/env node`) di baris pertama `index.js` agar file dapat dieksekusi langsung oleh Node.js runtime dari shell.

```bash
# Setelah proses link, command berikut dapat dijalankan dari mana saja:
$ vestprompt
```

### 2.2 Minimalist & Professional Terminal UI

- Tampilan terminal yang **bersih (clean)**, tidak berlebihan, dan fokus pada konten.
- Branding minimal berupa teks `vestprompt` pada header, tanpa ASCII art yang terlalu ramai.
- Spasi (*whitespace*) yang rapi antar section untuk meningkatkan keterbacaan.
- Visual separator elegan (garis horizontal tipis) untuk memisahkan input, proses, dan output.

> ⚠️ **Prinsip Desain:** *Less is more.* UI tidak boleh terasa seperti "demo AI generik" — harus terasa seperti tool profesional yang dipakai sehari-hari oleh developer.

### 2.3 Deep Reasoning Process

- Terintegrasi dengan **Gemini Thinking Model** (`gemini-2.0-flash-thinking-exp`).
- Alur kerja: `User Input (raw prompt)` → `Intent Analysis (reasoning)` → `Structured Prompt Generation (output)`.
- Menggunakan *system instruction* khusus agar model konsisten menghasilkan prompt yang mengikuti struktur standar (persona, context, task, constraints, output format).

### 2.4 Absolute `.env` Path Resolution

- Karena tool dijalankan secara **global** dari direktori mana pun, path menuju file `.env` **tidak boleh relatif** terhadap *current working directory* user.
- Solusi: resolve path `.env` berdasarkan lokasi absolut file `index.js` itu sendiri (menggunakan `import.meta.url` + `path.dirname`), bukan berdasarkan `process.cwd()`.
- Memastikan API key tetap terbaca dengan benar meskipun user menjalankan `vestprompt` dari `~/Desktop`, `~/projects/lain`, atau direktori manapun.

---

## 3. Tech Stack & Dependencies

| Kategori | Teknologi | Keterangan |
|---|---|---|
| **Runtime** | Node.js (ES Modules) | Menggunakan `"type": "module"` pada `package.json` untuk sintaks `import/export` modern. |
| **AI SDK** | `@google/generative-ai` | SDK resmi Google untuk mengakses Gemini API, termasuk model *thinking/reasoning*. |
| **CLI/UI Library** | `@clack/prompts` *(atau `inquirer`)* | Untuk membangun antarmuka prompt interaktif yang rapi di terminal. |
| **Env Management** | `dotenv` | Memuat variabel environment (API Key) dari file `.env`. |
| **Styling (opsional)** | `chalk` / `picocolors` | Untuk pewarnaan teks minimalis di terminal. |
| **Loading Indicator (opsional)** | `ora` | Spinner untuk menunjukkan proses "thinking" sedang berjalan. |

### 3.1 Contoh Dependencies di `package.json`

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@clack/prompts": "^0.7.0",
    "dotenv": "^16.4.5",
    "chalk": "^5.3.0",
    "ora": "^8.1.0"
  }
}
```

> 📌 **Catatan:** Versi library di atas bersifat indikatif. Selalu cek versi terbaru yang stabil pada saat instalasi (`npm info <package> versions`).

---

## 4. Architecture & File Structure

Struktur folder dirancang seminimalis mungkin, menghindari *over-engineering* untuk tool berskala kecil-menengah seperti ini.

```
vestprompt/
├── bin/
│   └── index.js          # Entry point utama (shebang + logic CLI)
├── src/
│   ├── ai.js              # Konfigurasi & pemanggilan Gemini API
│   ├── ui.js              # Komponen tampilan terminal (header, separator, dsb.)
│   └── config.js          # Absolute path resolver untuk .env
├── .env                   # Menyimpan GEMINI_API_KEY (tidak di-commit)
├── .env.example           # Template kosong untuk referensi kontributor
├── .gitignore             # Mengabaikan node_modules, .env, dsb.
├── package.json           # Metadata project + konfigurasi "bin"
├── PLAN.md                # Dokumen ini
└── README.md              # Dokumentasi instalasi & penggunaan
```

### 4.1 Penjelasan Komponen Kunci

| File/Folder | Fungsi |
|---|---|
| `bin/index.js` | Titik masuk eksekusi CLI, berisi shebang `#!/usr/bin/env node` dan alur utama program. |
| `src/ai.js` | Modul terpisah untuk inisialisasi Gemini client, system instruction, dan fungsi generate. |
| `src/ui.js` | Modul untuk elemen visual: header branding, separator, format output. |
| `src/config.js` | Logic path resolution absolut agar `.env` selalu terbaca dari lokasi instalasi package. |
| `.gitignore` | Wajib mengabaikan `node_modules/`, `.env`, dan file log lokal. |

---

## 5. Development Phases (Roadmap)

### Phase 1 — Project Setup & Dependency Configuration
- [ ] Inisialisasi project dengan `npm init -y`.
- [ ] Set `"type": "module"` pada `package.json`.
- [ ] Install seluruh dependencies inti (`@google/generative-ai`, `dotenv`, `@clack/prompts`).
- [ ] Buat struktur folder awal (`bin/`, `src/`).
- [ ] Setup `.gitignore` dan `.env.example`.

### Phase 2 — Environment & Global CLI Link Setup
- [ ] Tambahkan shebang line `#!/usr/bin/env node` di `bin/index.js`.
- [ ] Konfigurasi field `"bin": { "vestprompt": "./bin/index.js" }` pada `package.json`.
- [ ] Jalankan `npm link` dan verifikasi command global `vestprompt` dapat dipanggil dari direktori manapun.
- [ ] Implementasi *absolute path resolution* untuk `.env` menggunakan `import.meta.url`.
- [ ] Uji baca `GEMINI_API_KEY` dari beberapa direktori berbeda.

### Phase 3 — UI/UX Terminal Design
- [ ] Desain header branding minimalis "vestprompt" (teks + versi, tanpa ASCII berlebihan).
- [ ] Buat komponen separator visual (garis tipis elegan) antar-section.
- [ ] Rancang alur input pengguna menggunakan `@clack/prompts` (text input multi-line jika diperlukan).
- [ ] Tambahkan indikator loading (`ora`) saat proses *thinking* berjalan.
- [ ] Rapikan output akhir agar mudah dibaca & di-copy oleh user.

### Phase 4 — Gemini API Integration & System Instruction Engineering
- [ ] Inisialisasi client `@google/generative-ai` dengan model `gemini-2.0-flash-thinking-exp`.
- [ ] Rancang **system instruction** yang memaksa model melakukan reasoning terhadap intent user sebelum output final.
- [ ] Tentukan struktur output prompt standar (Persona → Context → Task → Constraints → Format).
- [ ] Implementasi fungsi `optimizePrompt(rawInput)` di `src/ai.js`.
- [ ] Uji berbagai jenis prompt kasar (singkat, ambigu, multi-intent) untuk validasi kualitas output.

### Phase 5 — Testing, Error Handling, & Optimization
- [ ] Tangani error koneksi API (timeout, rate limit, invalid API key) dengan pesan yang informatif.
- [ ] Validasi input kosong/invalid dari user sebelum dikirim ke API.
- [ ] Tambahkan fallback message jika `.env` tidak ditemukan.
- [ ] Uji performa & response time pada berbagai kondisi jaringan.
- [ ] Finalisasi `README.md` dengan instruksi instalasi & penggunaan.

---

## 6. Future Enhancements

> Berikut adalah ide-ide pengembangan lanjutan yang **tidak wajib** ada di versi awal (v1.0), namun berpotensi meningkatkan nilai produk secara signifikan di versi mendatang.

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| 📋 **Clipboard Integration** | Otomatis menyalin hasil prompt yang telah dioptimasi ke clipboard sistem (menggunakan library seperti `clipboardy`), sehingga user bisa langsung *paste* tanpa perlu select-copy manual. | Tinggi |
| 🗂️ **Local History Log** | Menyimpan riwayat prompt (input mentah & output optimasi) ke file lokal (misalnya `.vestprompt/history.json`), memungkinkan user meninjau kembali prompt-prompt sebelumnya. | Sedang |
| 🎨 **Custom Output Templates** | Memberikan opsi bagi user untuk memilih gaya/format output prompt (misalnya: format untuk coding, untuk copywriting, untuk data analysis). | Sedang |
| 🌐 **Multi-Model Support** | Menambahkan opsi untuk beralih antar model AI (Gemini, Claude, GPT) sesuai preferensi user. | Rendah |
| ⚙️ **Config File (`vestprompt.config.js`)** | Memungkinkan user mengatur preferensi default (model, bahasa output, panjang maksimal) tanpa mengubah source code. | Rendah |

---

<p align="center">
  <i>Dokumen ini bersifat living document dan akan diperbarui seiring perkembangan project VestPrompt.</i>
</p>

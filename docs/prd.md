# Product Requirements Document: Markdown to PDF

**Status:** Draft  
**Versi:** 1.0  
**Platform:** Web  
**Target pengguna:** Pengguna umum  
**Stack utama:** Vite + React  
**Pemilik produk:** TBD  
**Target rilis:** TBD  

## 1. Executive Summary

### Problem Statement

Pengguna membutuhkan cara sederhana untuk mengubah dokumen Markdown menjadi PDF tanpa memasang aplikasi khusus, memahami perintah terminal, atau mengirim dokumen ke layanan konversi yang tidak jelas. Solusi yang ada sering kali tidak menyediakan preview langsung atau pengaturan halaman yang cukup sebelum PDF dibuat.

### Proposed Solution

Membangun web app berbasis Vite dan React yang memungkinkan pengguna menulis atau mengunggah file Markdown, melihat preview secara langsung, mengatur tampilan halaman, lalu mengunduh hasilnya sebagai PDF. Pemrosesan dokumen pada MVP dilakukan di browser agar cepat, sederhana, dan menjaga privasi pengguna.

### Success Criteria

- Minimal 95% dari dokumen pada kumpulan uji berhasil dikonversi tanpa error.
- Hasil preview dan PDF memiliki kesesuaian visual minimal 90% berdasarkan checklist pengujian elemen, tipografi, warna, dan pemisahan halaman.
- Pengguna dapat menyelesaikan alur dari membuka aplikasi hingga menghasilkan PDF dalam maksimal 3 menit pada pengujian pengguna pertama kali.
- Preview diperbarui maksimal 300 ms setelah pengguna berhenti mengetik selama 300 ms untuk dokumen hingga 10.000 kata pada perangkat uji kelas menengah.
- Skor Lighthouse pada build produksi mencapai minimal 90 untuk Performance dan 100 untuk Accessibility pada halaman utama di desktop.

## 2. User Experience & Functionality

### User Personas

#### Persona 1: Pengguna umum

Pengguna yang ingin mengubah catatan, artikel, dokumentasi, atau tugas dalam format Markdown menjadi PDF tanpa mempelajari alat teknis.

#### Persona 2: Pelajar dan mahasiswa

Pengguna yang menulis laporan atau tugas dalam Markdown dan membutuhkan dokumen PDF yang rapi untuk dikumpulkan atau dibagikan.

#### Persona 3: Penulis teknis dan developer

Pengguna yang telah memiliki file `.md` dan ingin memeriksa tampilannya serta mengekspor dokumen ke PDF secara cepat.

### User Flow

1. Pengguna membuka web app.
2. Aplikasi menampilkan editor, contoh Markdown, dan preview.
3. Pengguna memilih salah satu tindakan:
   - menulis atau menempel Markdown di editor; atau
   - mengunggah satu file `.md`.
4. Preview diperbarui secara langsung ketika isi Markdown berubah.
5. Pengguna membuka pengaturan dokumen.
6. Pengguna memilih ukuran kertas, orientasi, margin, dan tema dokumen.
7. Pengguna memeriksa preview halaman.
8. Pengguna memilih **Unduh PDF**.
9. Aplikasi membuat dan mengunduh PDF atau menampilkan pesan error yang dapat ditindaklanjuti.

### User Stories

#### US-01: Menulis dan mengedit Markdown

Sebagai pengguna, saya ingin menulis atau menempel Markdown di editor agar saya dapat membuat dokumen tanpa menyiapkan file terlebih dahulu.

**Acceptance Criteria**

- Editor menerima input teks biasa dan Markdown.
- Editor menampilkan nomor baris.
- Editor mendukung undo, redo, select all, copy, cut, dan paste melalui perilaku standar browser.
- Aplikasi menyediakan contoh Markdown saat pertama dibuka.
- Isi editor tidak hilang ketika halaman dimuat ulang pada browser dan perangkat yang sama, kecuali pengguna menghapus data situs.
- Dokumen dengan panjang hingga 10.000 kata tetap dapat diedit tanpa input lag lebih dari 100 ms pada perangkat uji kelas menengah.

#### US-02: Mengunggah file Markdown

Sebagai pengguna, saya ingin mengunggah file Markdown agar saya tidak perlu menyalin isinya secara manual.

**Acceptance Criteria**

- Pengguna dapat memilih satu file dengan ekstensi `.md` atau `.markdown`.
- Ukuran file maksimum pada MVP adalah 5 MB.
- Isi file yang valid dimuat ke editor dan langsung ditampilkan pada preview.
- Aplikasi meminta konfirmasi sebelum mengganti isi editor yang belum kosong.
- File dengan ekstensi atau format yang tidak didukung ditolak dengan pesan yang menjelaskan format yang diterima.
- File tidak dikirim ke server pada MVP.

#### US-03: Melihat preview langsung

Sebagai pengguna, saya ingin melihat hasil Markdown secara langsung agar saya dapat memperbaiki dokumen sebelum membuat PDF.

**Acceptance Criteria**

- Preview diperbarui maksimal 300 ms setelah pengguna berhenti mengetik selama 300 ms.
- Preview mendukung heading, paragraf, emphasis, strong text, blockquote, ordered list, unordered list, link, image berbasis URL, tabel, horizontal rule, inline code, fenced code block, dan task list.
- HTML mentah dari Markdown tidak dieksekusi secara default.
- Link pada preview memiliki tampilan yang dapat dibedakan dari teks biasa.
- Code block mempertahankan whitespace dan dapat digulir horizontal jika melebihi lebar halaman.
- Gambar yang gagal dimuat menampilkan indikator error tanpa menghentikan preview atau ekspor elemen lain.

#### US-04: Mengatur halaman dokumen

Sebagai pengguna, saya ingin mengatur format halaman agar PDF sesuai dengan kebutuhan saya.

**Acceptance Criteria**

- Pengguna dapat memilih ukuran kertas A4, A5, Letter, atau Legal.
- Pengguna dapat memilih orientasi portrait atau landscape.
- Pengguna dapat memilih margin kecil, normal, atau besar.
- Pengguna dapat memilih tema terang atau gelap untuk isi dokumen.
- Perubahan pengaturan terlihat pada preview sebelum ekspor.
- Pengaturan terakhir disimpan pada browser dan dipakai kembali pada kunjungan berikutnya.
- Kombinasi pengaturan yang tidak dapat dirender harus dicegah atau menghasilkan pesan error yang jelas.

#### US-05: Mengunduh PDF

Sebagai pengguna, saya ingin mengunduh dokumen sebagai PDF agar saya dapat menyimpan, mencetak, atau membagikannya.

**Acceptance Criteria**

- Tombol **Unduh PDF** tersedia setelah aplikasi siap digunakan.
- Nama file hasil menggunakan nama file Markdown yang diunggah atau `document.pdf` untuk dokumen baru.
- PDF mengikuti ukuran kertas, orientasi, margin, dan tema yang dipilih.
- Heading, paragraf, daftar, tabel, gambar, link, blockquote, dan code block tampil pada PDF.
- Teks pada PDF dapat dipilih dan dicari, bukan hanya berupa satu gambar halaman.
- Link eksternal pada PDF tetap dapat diklik jika didukung oleh mesin ekspor yang dipilih.
- Aplikasi mencegah pemotongan baris teks dan gambar di luar area cetak.
- Aplikasi menampilkan status proses ketika ekspor memerlukan lebih dari 500 ms.
- Kegagalan ekspor tidak menghapus isi editor dan menampilkan opsi untuk mencoba kembali.

#### US-06: Menghapus dan memulai dokumen baru

Sebagai pengguna, saya ingin mengosongkan dokumen agar saya dapat memulai pekerjaan baru tanpa memuat ulang halaman.

**Acceptance Criteria**

- Tindakan **Dokumen Baru** tersedia dari antarmuka utama.
- Aplikasi meminta konfirmasi jika editor berisi teks.
- Setelah dikonfirmasi, editor kembali ke contoh awal atau keadaan kosong sesuai keputusan desain final.
- Nama file dan status dokumen sebelumnya ikut direset.

#### US-07: Menggunakan aplikasi pada berbagai ukuran layar

Sebagai pengguna, saya ingin menggunakan aplikasi dari desktop, tablet, atau ponsel agar saya dapat melakukan konversi dari perangkat yang tersedia.

**Acceptance Criteria**

- Pada viewport minimal 1024 px, editor dan preview dapat ditampilkan berdampingan.
- Pada viewport di bawah 1024 px, pengguna dapat berpindah antara tab Editor dan Preview.
- Seluruh fungsi utama dapat digunakan pada lebar viewport mulai 320 px.
- Tidak ada kontrol utama yang membutuhkan hover untuk ditemukan atau digunakan.
- Seluruh kontrol dapat dioperasikan dengan keyboard dan memiliki focus indicator yang terlihat.

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Editor Markdown dengan penyimpanan lokal | Must |
| FR-02 | Unggah satu file `.md` atau `.markdown` | Must |
| FR-03 | Preview Markdown secara langsung | Must |
| FR-04 | Dukungan GitHub Flavored Markdown dasar | Must |
| FR-05 | Pengaturan ukuran kertas | Must |
| FR-06 | Pengaturan orientasi halaman | Must |
| FR-07 | Pengaturan margin | Must |
| FR-08 | Pilihan tema dokumen terang atau gelap | Must |
| FR-09 | Ekspor dan unduh PDF berbasis teks | Must |
| FR-10 | Layout responsif | Must |
| FR-11 | Pemulihan draft dan pengaturan dari browser | Should |
| FR-12 | Nama PDF mengikuti nama file sumber | Should |
| FR-13 | Penyorotan sintaks pada code block | Could |

### Non-Functional Requirements

- Build produksi harus dapat dijalankan sebagai static web app.
- Aplikasi harus berfungsi pada dua versi terbaru Chrome, Edge, Firefox, dan Safari.
- Tidak boleh ada unggahan dokumen ke server pada MVP.
- Aplikasi harus tetap dapat dibuka dan digunakan setelah seluruh aset awal selesai dimuat, kecuali untuk gambar eksternal di dalam dokumen.
- Ukuran JavaScript awal terkompresi ditargetkan maksimal 500 KB; library ekspor PDF boleh dimuat secara dinamis.
- Seluruh teks kontrol harus tersedia dalam Bahasa Indonesia pada MVP.
- Kontras teks dan komponen interaktif harus memenuhi WCAG 2.2 AA.
- Error pada satu gambar atau satu elemen Markdown tidak boleh menyebabkan seluruh aplikasi berhenti.

### Non-Goals

- Akun pengguna, autentikasi, dan sinkronisasi cloud.
- Penyimpanan dokumen pada database atau server.
- Kolaborasi dan pengeditan bersama secara real-time.
- Riwayat versi dokumen.
- Konversi batch untuk beberapa file sekaligus.
- Impor dari Google Drive, Dropbox, GitHub, Notion, atau URL.
- Aplikasi desktop atau mobile native.
- Template PDF buatan pengguna.
- Header, footer, nomor halaman, daftar isi otomatis, dan cover generator pada MVP.
- Pengeditan PDF setelah file dibuat.
- Dukungan penuh untuk HTML mentah, Mermaid, LaTeX, atau diagram khusus.
- Sistem pembayaran, paket berlangganan, atau iklan.

## 3. AI System Requirements (If Applicable)

### Applicability

Tidak berlaku untuk MVP. Konversi Markdown ke PDF bersifat deterministik dan tidak membutuhkan model AI.

### Tool Requirements

Tidak ada API atau model AI yang diperlukan. Parsing Markdown, sanitasi, preview, dan ekspor PDF dilakukan dengan library lokal di aplikasi.

### Evaluation Strategy

Tidak ada evaluasi AI. Kualitas keluaran diukur menggunakan pengujian visual, fungsional, aksesibilitas, performa, dan kompatibilitas browser yang dijelaskan pada bagian teknis.

## 4. Technical Specifications

### Architecture Overview

Aplikasi menggunakan arsitektur single-page application berbasis Vite dan React. Seluruh pemrosesan utama berjalan pada sisi klien.

```text
Input pengguna atau file .md
        |
        v
React state + penyimpanan lokal
        |
        v
Markdown parser
        |
        v
Sanitasi HTML
        |
        +--------------------+
        |                    |
        v                    v
Preview responsif     Mesin ekspor PDF
                             |
                             v
                    File PDF untuk diunduh
```

### Component Overview

| Component | Responsibility |
|---|---|
| `AppShell` | Mengatur layout utama dan state aplikasi tingkat atas |
| `MarkdownEditor` | Menangani input, edit, dan nomor baris |
| `FileImporter` | Memvalidasi dan membaca file Markdown lokal |
| `MarkdownRenderer` | Mengubah Markdown menjadi struktur preview yang aman |
| `PreviewPane` | Menampilkan hasil render sesuai pengaturan halaman |
| `DocumentSettings` | Mengatur kertas, orientasi, margin, dan tema |
| `PdfExporter` | Membuat PDF berbasis teks dan memicu unduhan |
| `LocalDraftStore` | Menyimpan draft dan pengaturan pada browser |
| `ErrorBoundary` | Mencegah error komponen merusak seluruh aplikasi |

### State Model

```ts
type DocumentState = {
  source: string;
  sourceFileName: string | null;
  isDirty: boolean;
  settings: {
    paperSize: "A4" | "A5" | "Letter" | "Legal";
    orientation: "portrait" | "landscape";
    margin: "small" | "normal" | "large";
    theme: "light" | "dark";
  };
};
```

Nilai margin aktual dalam milimeter ditetapkan pada tahap implementasi dan harus konsisten antara preview dan PDF.

### Technology Constraints

- Build tool: Vite.
- UI framework: React.
- Bahasa implementasi: TypeScript direkomendasikan; keputusan final `TBD`.
- Styling: CSS Modules, Tailwind CSS, atau CSS biasa; keputusan final `TBD`.
- Markdown parser harus mendukung GitHub Flavored Markdown.
- Sanitizer harus memiliki allowlist elemen dan atribut.
- Mesin PDF wajib menghasilkan teks yang dapat dipilih.
- Library editor dan ekspor PDF dipilih melalui technical spike sebelum implementasi penuh.

### Integration Points

- File API browser untuk membaca file lokal.
- Web Storage API atau IndexedDB untuk menyimpan draft dan pengaturan lokal.
- Blob dan Download API browser untuk mengunduh hasil PDF.
- Tidak ada API backend, database, atau autentikasi pada MVP.
- Gambar dari URL eksternal bergantung pada ketersediaan sumber dan kebijakan CORS; aplikasi harus menangani kegagalannya.

### Data Handling

- Isi Markdown hanya disimpan pada browser pengguna.
- Draft lokal disimpan otomatis setelah perubahan dengan debounce maksimal 1 detik.
- Aplikasi tidak mengirim isi dokumen, nama file, atau hasil PDF ke server.
- Pengguna dapat menghapus draft dengan tindakan **Dokumen Baru** atau membersihkan data situs melalui browser.
- Jika analitik ditambahkan kemudian, analitik tidak boleh merekam isi dokumen, nama file, atau URL gambar di dalam dokumen.

### Security & Privacy

- HTML mentah tidak dieksekusi secara default.
- Output parser harus disanitasi sebelum ditampilkan.
- Skema URL berbahaya seperti `javascript:` harus diblokir.
- Link eksternal yang dibuka pada tab baru harus menggunakan `rel="noopener noreferrer"`.
- Nama file harus dinormalisasi sebelum digunakan sebagai nama PDF.
- Ukuran file dan tipe file harus divalidasi sebelum dibaca.
- Content Security Policy direkomendasikan untuk deployment produksi.
- Tidak ada data dokumen yang dikirim atau disimpan pada server pada MVP.

### Accessibility Requirements

- Seluruh fungsi utama dapat digunakan dengan keyboard.
- Label kontrol terhubung secara programatis dengan input masing-masing.
- Focus indicator terlihat pada seluruh elemen interaktif.
- Status loading dan error diumumkan melalui live region.
- Tab Editor dan Preview menggunakan pola ARIA tabs yang benar pada perangkat kecil.
- Kontras teks, ikon, border penting, dan tombol memenuhi WCAG 2.2 AA.
- Zoom browser hingga 200% tidak menghilangkan fungsi utama.

### Error and Empty States

- File tidak didukung: jelaskan ekstensi yang diterima.
- File terlalu besar: tampilkan batas 5 MB.
- File tidak dapat dibaca: pertahankan isi editor dan sediakan coba lagi.
- Markdown kosong: preview menampilkan petunjuk singkat.
- Gambar eksternal gagal: tampilkan placeholder dan lanjutkan render.
- Ekspor gagal: pertahankan dokumen, tampilkan penyebab jika diketahui, dan sediakan coba lagi.
- Penyimpanan lokal tidak tersedia: aplikasi tetap berfungsi dan memberi tahu bahwa draft tidak akan dipulihkan.

### Testing Strategy

#### Unit Tests

- Parsing setiap elemen Markdown yang didukung.
- Validasi tipe dan ukuran file.
- Normalisasi nama file PDF.
- Mapping ukuran kertas, orientasi, dan margin.
- Penyimpanan serta pemulihan draft.
- Pemblokiran URL dan HTML berbahaya.

#### Integration Tests

- Mengetik Markdown memperbarui preview.
- Mengunggah file mengganti editor setelah konfirmasi.
- Mengubah pengaturan memperbarui preview dan hasil ekspor.
- Ekspor membuat file dengan nama dan konfigurasi yang benar.
- Error ekspor tidak menghapus state dokumen.

#### End-to-End Tests

- Alur membuat dokumen baru hingga mengunduh PDF.
- Alur unggah file hingga mengunduh PDF.
- Pemulihan draft setelah reload.
- Navigasi penuh menggunakan keyboard.
- Layout desktop, tablet, dan mobile.

#### Visual and PDF Tests

Kumpulan uji minimal terdiri dari 20 dokumen yang mencakup seluruh sintaks yang didukung, dokumen panjang, tabel lebar, code block panjang, gambar besar, karakter Unicode, dan kombinasi halaman portrait serta landscape.

Setiap PDF diperiksa berdasarkan:

- tidak ada teks terpotong;
- urutan konten benar;
- font dan ukuran teks konsisten;
- tabel dan code block berada dalam area halaman;
- gambar mempertahankan rasio;
- pemisahan halaman tidak meninggalkan heading sendirian di akhir halaman;
- teks dapat dipilih dan dicari;
- link dapat diklik jika mesin ekspor mendukungnya.

Target kelulusan regresi adalah minimal 95% kasus uji tanpa defect severity tinggi.

#### Performance Tests

- Dokumen 10.000 kata diperbarui pada preview dalam target 300 ms setelah debounce.
- Ekspor dokumen 20 halaman selesai dalam target 10 detik pada perangkat uji kelas menengah.
- Tidak ada long task lebih dari 200 ms selama pengetikan normal.

### Definition of Done

- Seluruh acceptance criteria berprioritas Must terpenuhi.
- Seluruh unit, integration, dan end-to-end test utama lulus.
- Tidak ada defect severity tinggi yang terbuka.
- Target Accessibility dan Performance Lighthouse terpenuhi.
- Aplikasi berhasil diuji pada browser yang didukung.
- Build produksi dapat dijalankan dan di-deploy sebagai static web app.
- Dokumentasi penggunaan dan batasan format tersedia.

## 5. Risks & Roadmap

### Phased Rollout

#### MVP

- Editor Markdown.
- Unggah satu file Markdown.
- Preview langsung.
- Dukungan elemen GitHub Flavored Markdown dasar.
- Pengaturan ukuran kertas, orientasi, margin, dan tema.
- Ekspor serta unduh PDF berbasis teks.
- Penyimpanan draft lokal.
- Layout responsif dan aksesibel.

#### v1.1

- Header dan footer.
- Nomor halaman.
- Daftar isi otomatis dari heading.
- Pilihan font dan ukuran font.
- Template dokumen bawaan.
- Penyorotan sintaks code block.
- Dukungan drag-and-drop file.

#### v2.0

- Konversi beberapa file sekaligus.
- Dukungan Mermaid dan rumus matematika.
- Template kustom.
- Progressive Web App dan penggunaan offline penuh.
- Impor dari URL atau layanan penyimpanan eksternal.
- Opsi akun dan sinkronisasi cloud hanya jika kebutuhan pengguna tervalidasi.

### Technical Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Preview dan PDF terlihat berbeda | Pengguna menerima hasil yang tidak sesuai ekspektasi | Gunakan satu sumber token styling, buat test fixture PDF, dan lakukan regression test visual |
| Pemisahan halaman memotong tabel, code block, atau gambar | PDF sulit dibaca | Tambahkan aturan page-break dan uji dokumen panjang serta elemen oversized |
| Library PDF menghasilkan dokumen berbasis gambar | Teks tidak dapat dicari dan ukuran file besar | Jadikan selectable text sebagai kriteria wajib dalam technical spike |
| Font tidak tertanam atau karakter Unicode hilang | Isi PDF berubah atau menjadi kotak kosong | Gunakan font berlisensi terbuka, embed subset font, dan uji Bahasa Indonesia serta Unicode |
| Gambar eksternal diblokir CORS | Gambar tidak masuk ke PDF | Tampilkan error per gambar dan dokumentasikan batasan; evaluasi import gambar lokal pada versi berikutnya |
| Dokumen besar membebani main thread | Editor dan preview terasa lambat | Terapkan debounce, lazy-load mesin PDF, dan evaluasi Web Worker jika target performa gagal |
| HTML atau link berbahaya masuk melalui Markdown | Risiko XSS dan phishing | Nonaktifkan HTML mentah, sanitasi output, dan batasi skema URL |
| Penyimpanan browser penuh atau dinonaktifkan | Draft tidak dapat dipulihkan | Tangani exception, beri notifikasi, dan pertahankan fungsi utama tanpa autosave |
| Perbedaan implementasi browser | Hasil ekspor atau layout tidak konsisten | Tentukan browser support matrix dan jalankan E2E lintas browser sebelum rilis |

### Product Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Terlalu banyak opsi membuat aplikasi tidak lagi sederhana | Pengguna baru kesulitan menyelesaikan konversi | Tampilkan default yang aman dan pindahkan pengaturan lanjutan ke panel terpisah |
| Definisi “hasil sama dengan preview” tidak jelas | Ekspektasi pengguna tidak terpenuhi | Gunakan preview berbasis halaman dan metrik kesesuaian visual yang dapat diuji |
| Tidak ada kebutuhan kuat untuk akun atau cloud | Waktu pengembangan terbuang | Pertahankan local-first hingga riset pengguna membuktikan kebutuhan sinkronisasi |

### Open Questions

- Apakah implementasi menggunakan TypeScript atau JavaScript?
- Library editor mana yang paling memenuhi target performa dan aksesibilitas?
- Mesin ekspor PDF mana yang dapat mempertahankan selectable text, link, Unicode, dan page break secara konsisten di seluruh browser?
- Apakah contoh awal harus dikembalikan setelah **Dokumen Baru**, atau editor harus benar-benar kosong?
- Di mana aplikasi akan di-deploy?
- Apakah analitik penggunaan diperlukan tanpa merekam data dokumen?

### Recommended Technical Spikes

Sebelum implementasi penuh, lakukan spike maksimal satu hari kerja untuk:

1. membandingkan minimal dua pendekatan ekspor PDF;
2. menguji selectable text, link, tabel, gambar, code block, Unicode, dan dokumen 20 halaman;
3. mengukur ukuran bundle dan waktu ekspor;
4. memilih pendekatan yang memenuhi acceptance criteria wajib;
5. mencatat batasan browser yang ditemukan.

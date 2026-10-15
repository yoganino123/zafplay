# Zafplay (Zafran Play) 🎮

Kumpulan game anak yang seru. Belajar berhitung diselipkan di dalam permainan, jadi anak merasa sedang bermain, bukan mengerjakan soal.

🌐 **Main sekarang:** https://zafplay.netlify.app/

## Game

| Game                | Deskripsi                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🧮 **Math Kilat**   | Jawab soal tambah & kurang sebanyak-banyaknya dalam waktu terbatas. Jawaban **ditulis tangan** di layar dan dibaca otomatis. Jawaban benar memberi koin.           |
| 🤖 **Garasi Robot** | Tukar koin dengan bagian robot raksasa (kepala, badan, lengan, kaki, punggung, senjata, inti energi). Tiap bagian punya 4 tingkat: Biasa, Keren, Epik, Legendaris. |

Game baru akan menyusul.

## Fitur

- Sampai 3 pemain, masing-masing punya skor, koin, dan robot sendiri.
- Pembaca tulisan tangan berjalan **di browser**, tanpa internet, server, atau AI. Memakai algoritma [$P Point-Cloud Recognizer](https://depts.washington.edu/acelab/proj/dollar/pdollar.html).
- Menu "Latih tulisanku" agar tebakan makin cocok dengan gaya tulisan anak. Jawaban yang benar juga otomatis dipelajari.
- Toleransi untuk angka yang sering tertukar pada tulisan anak-anak (misalnya 9 dengan 8 atau 0).
- Semua data tersimpan di browser (`localStorage`). Tidak ada akun dan tidak ada data yang dikirim ke server.

## Teknologi

- [React](https://react.dev/) 18
- [Vite](https://vitejs.dev/) 5
- Deploy di [Netlify](https://www.netlify.com/)

## Menjalankan di komputer sendiri

Butuh [Node.js](https://nodejs.org/) 20 atau lebih baru.

```bash
git clone https://github.com/yoganino123/zafplay.git
cd zafplay
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

Perintah lain:

```bash
npm run build     # build produksi ke folder dist
npm run preview   # coba hasil build secara lokal
```

## Struktur proyek

```
src/
  App.jsx               alur layar (home → hub → game / garasi → hasil)
  components/
    Home.jsx            pilih / buat pemain
    Hub.jsx             daftar game (tambah game baru di GAMES)
    Menu.jsx, Game.jsx, Result.jsx, Calibrate.jsx, Pad.jsx   Math Kilat
    Garage.jsx, RobotSvg.jsx                                 Garasi Robot
    Pic.jsx             gambar dari public/assets, fallback emoji
  lib/
    recognizer.js       pembaca angka tulisan tangan
    game.js             pembuat soal & level
    robot.js            bagian, tingkat, dan harga robot
    storage.js          penyimpanan di browser
public/assets/          gambar (lihat README di dalamnya)
```

## Menambah game baru

1. Buat komponen game di `src/components/`.
2. Daftarkan di array `GAMES` pada [Hub.jsx](src/components/Hub.jsx).
3. Tambahkan layarnya di [App.jsx](src/App.jsx).
4. Kalau game ingin memberi koin, ubah `coinsFor` di [robot.js](src/lib/robot.js) atau panggil logika yang sama.

## Gambar

Taruh gambar PNG di [public/assets/](public/assets/). Nama file yang dipakai dijelaskan di [README-nya](public/assets/README.md). Kalau file belum ada, aplikasi menampilkan emoji pengganti.

## Deploy

Sudah ada [netlify.toml](netlify.toml). Hubungkan repo ke Netlify (Add new site → Import from GitHub). Setiap `git push` ke `main` akan otomatis deploy ulang.

## Kontribusi

Saran dan pull request sangat diterima, terutama:

- ide game baru yang terasa seperti game, bukan soal pelajaran,
- perbaikan akurasi pembaca tulisan tangan,
- gambar atau aset baru.

Silakan buka issue dulu kalau perubahannya besar.

## Lisensi

Kode dirilis di bawah lisensi [MIT](LICENSE).

Catatan: foto dan karakter Zafran di `public/` adalah milik pribadi dan **tidak** termasuk dalam lisensi MIT. Jangan dipakai ulang tanpa izin.

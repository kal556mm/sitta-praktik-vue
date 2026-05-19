var appStok = new Vue({
  el: "#app",
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

    listBuku: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>",
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
      },

      {
        kode: "STSI4209",
        judul: "Pemrograman Berbasis Web",
        kategori: "Praktikum",
        upbjj: "Bogor",
        lokasiRak: "R4-D2",
        harga: 75000,
        qty: 45,
        safety: 15,
        catatanHTML:
          "<strong style='color: #003366;'>Modul Kurikulum Baru Vue.js</strong>",
      },
      {
        kode: "STSI4102",
        judul: "Algoritma dan Struktur Data",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A5",
        harga: 70000,
        qty: 0,
        safety: 10,
        catatanHTML:
          "<span style='color: red;'>Habis Total, Menunggu Kiriman Percetakan</span>",
      },
    ],

    // Variabel Pengikat Filter & Form Input
    cariStok: "",
    filterDaerah: "",
    filterKategori: "",
    filterReorder: false,
    sortBy: "",

    formBaru: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: "",
      qty: "",
      safety: "",
    },
  },
  // 1.4 Penggunaan Property Computed
  computed: {
    // FILTER DATA REAL-TIME (Efisien, No Recompute Berulang)
    filterStok: function () {
      var keyword = this.cariStok.toLowerCase();
      var daerah = this.filterDaerah;
      var kategori = this.filterKategori;
      var reorder = this.filterReorder;
      var sortOption = this.sortBy;

      var hasilData = this.listBuku.filter(function (buku) {
        var matchKeyword =
          buku.judul.toLowerCase().includes(keyword) ||
          buku.kode.toLowerCase().includes(keyword);
        var matchDaerah = daerah === "" || buku.upbjj === daerah;
        var matchKategori = kategori === "" || buku.kategori === kategori;

        // Logika Alert Batas Kritis: Qty < Safety ATAU Qty == 0
        var matchReorder = !reorder || buku.qty < buku.safety || buku.qty === 0;

        return matchKeyword && matchDaerah && matchKategori && matchReorder;
      });

      // Fitur Sorting (Pengurutan) Data
      if (sortOption === "judul") {
        hasilData.sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (sortOption === "qty") {
        hasilData.sort((a, b) => a.qty - b.qty);
      } else if (sortOption === "harga") {
        hasilData.sort((a, b) => a.harga - b.harga);
      }

      return hasilData;
    },
  },
  // 1.4 Implementasi Watchers
  watch: {
    // WATCHER 1: Sinkronisasi Dependent Options (Kategori otomatis reset jika daerah berubah)
    filterDaerah: function () {
      this.filterKategori = "";
    },
    // WATCHER 2: Memantau Log aktivitas kata kunci pencarian di konsol browser
    cariStok: function (newVal) {
      console.log("Aktivitas Pencarian Reaktif: " + newVal);
    },
  },
  // 1.4 Penggunaan Property Methods
  methods: {
    resetFilter: function () {
      this.cariStok = "";
      this.filterDaerah = "";
      this.filterKategori = "";
      this.filterReorder = false;
      this.sortBy = "";
    },
    tambahBuku: function () {
      var f = this.formBaru;

      // 1.5 Validasi Sederhana
      if (
        !f.kode ||
        !f.judul ||
        !f.kategori ||
        !f.upbjj ||
        !f.lokasiRak ||
        f.harga === "" ||
        f.qty === "" ||
        f.safety === ""
      ) {
        alert("Mohon lengkapi seluruh kolom formulir data buku.");
        return;
      }

      // Memasukkan data baru ke baris paling atas tabel (.unshift)
      this.listBuku.unshift({
        kode: f.kode.toUpperCase(),
        judul: f.judul,
        kategori: f.kategori,
        upbjj: f.upbjj,
        lokasiRak: f.lokasiRak.toUpperCase(),
        harga: Number(f.harga),
        qty: Number(f.qty),
        safety: Number(f.safety),
        catatanHTML: "<em>Input Manual Hasil Simulasi</em>",
      });

      alert("Sukses! Data bahan ajar baru berhasil ditambahkan.");

      // 1.5 Formulir Input Sederhana
      this.formBaru = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: "",
        qty: "",
        safety: "",
      };
    },
  },
});

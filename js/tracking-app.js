var appTracking = new Vue({
  el: "#app",
  data: {
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" },
    ],

    paket: [
      {
        kode: "PAKET-UT-001",
        nama: "PAKET IPS Dasar",
        isi: ["EKMA4116", "EKMA4115"],
        harga: 120000,
      },
      {
        kode: "PAKET-UT-002",
        nama: "PAKET IPA Dasar",
        isi: ["BIOL4201", "FISIP4001"],
        harga: 140000,
      },
    ],

    dataLacak: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "Reguler (3-5 hari)",
        tanggalKirim: "2026-05-10",
        lokasi: "DC Jakarta",
        paketKode: "PAKET-UT-001",
        totalHarga: 120000,
      },

      "DO2025-0002": {
        nim: "052088423",
        nama: "Bambang Friantoro",
        status: "Selesai",
        ekspedisi: "Ekspres (1-2 hari)",
        tanggalKirim: "2026-05-15",
        lokasi: "UPBJJ-UT Bogor (Diterima)",
        paketKode: "PAKET-UT-002",
        totalHarga: 140000,
      },
    },

    // Variabel Pengikat Model Jalur Lacak & Form DO Baru
    cariDO: "",
    infoTracking: null,
    progressWidth: 0,
    detailPaketTerpilih: null,

    formDO: {
      nim: "",
      nama: "",
      ekspedisi: "",
      paketKode: "",
      tanggalKirim: new Date().toISOString().split("T")[0],
      totalHarga: 0,
    },
  },
  // 1.4 Penggunaan Property computed
  computed: {
    // GENERATE NOMOR DO OTOMATIS: DO + Tahun Berjalan + Urutan Sequence 3 Digit
    generateNoDO: function () {
      var tahun = new Date().getFullYear();
      var keys = Object.keys(this.dataLacak);
      var urutan = keys.length + 1;
      var strUrutan = urutan.toString().padStart(3, "0");
      return "DO" + tahun + "-" + strUrutan;
    },
  },
  // 1.4 Implementasi Watchers
  watch: {
    // WATCHER 1: Mendeteksi perubahan pilihan paket untuk memunculkan detail isi buku & hitung harga otomatis
    "formDO.paketKode": function (newKode) {
      if (newKode === "") {
        this.detailPaketTerpilih = null;
        this.formDO.totalHarga = 0;
        return;
      }
      var found = this.paket.find((p) => p.kode === newKode);
      this.detailPaketTerpilih = found ? found : null;
      this.formDO.totalHarga = found ? found.harga : 0;
    },
    // WATCHER 2: Memantau pergeseran lebar progress bar kuning di konsol log
    progressWidth: function (newWidth) {
      console.log(
        "Bilah kemajuan logistik bergeser dinamis ke: " + newWidth + "%",
      );
    },
  },
  // 1.4 Penggunaan Property Methods
  methods: {
    tambahDO: function () {
      var f = this.formDO;

      // 1.5 Validasi input form sederhana
      if (
        !f.nim ||
        !f.nama ||
        !f.ekspedisi ||
        !f.paketKode ||
        !f.tanggalKirim
      ) {
        alert("Mohon lengkapi seluruh kolom data pelacakan DO baru.");
        return;
      }

      var noNewDO = this.generateNoDO;

      // Menyuntikkan transaksi baru langsung ke objek dataLacak secara reaktif
      Vue.set(this.dataLacak, noNewDO, {
        nim: f.nim,
        nama: f.nama,
        status: "Diproses",
        ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggalKirim,
        lokasi: "Gudang Pusat Tiras UT",
        paketKode: f.paketKode,
        totalHarga: f.totalHarga,
      });

      alert("Sukses! Nomor DO baru berhasil diterbitkan: " + noNewDO);

      // 1.5 Formulir Input Sederhana
      this.formDO = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: new Date().toISOString().split("T")[0],
        totalHarga: 0,
      };
      this.detailPaketTerpilih = null;
    },
    lacakPaket: function () {
      var token = this.cariDO.trim();
      if (token === "") {
        alert("Mohon, masukkan Nomor DO terlebih dahulu.");
        return;
      }

      var hasil = this.dataLacak[token];
      if (hasil) {
        this.infoTracking = hasil;

        // Aturan pembagian animasi persentase progress bar visualisasi
        if (hasil.status === "Selesai" || hasil.status === "Diterima") {
          this.progressWidth = 100;
        } else if (hasil.status === "Dalam Perjalanan") {
          this.progressWidth = 60;
        } else {
          this.progressWidth = 30; // Status awal: Diproses
        }
      } else {
        alert(
          "Nomor DO '" +
            token +
            "' tidak ditemukan. Gunakan contoh patokan: DO2025-0001 atau DO2025-0002",
        );
        this.infoTracking = null;
        this.progressWidth = 0;
      }
    },
  },
});

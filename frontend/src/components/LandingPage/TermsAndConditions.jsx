// frontend/src/components/LandingPage/TermsAndConditions.jsx

import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFCF8] min-h-screen font-sans text-[#3E362E]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-2 text-[#3E362E]">Syarat & Ketentuan</h1>
        <p className="text-[#6B5E51] mb-10">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#6B5E51]">
          {/* 1. Definisi Produk */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">1. Produk Digital</h2>
            <p>
              Produk yang dijual di LumaSticker adalah <strong>produk digital (softcopy)</strong> dalam format ZIP yang
              isinya adalah file PNG. <strong>Tidak ada produk fisik</strong> yang akan dikirim ke alamat rumah Anda.
            </p>
          </section>

          {/* 2. Pemesanan & Data Pengguna (SESUAI REQUEST: CUMA NAMA & EMAIL) */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Pemesanan & Data Pengguna</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Saat melakukan pembelian, Anda hanya diminta mengisi <strong>Nama</strong> dan{" "}
                <strong>Alamat Email</strong>.
              </li>
              <li>
                Pastikan alamat email yang Anda masukkan <strong>aktif dan benar</strong>. Kami tidak bertanggung jawab
                atas kegagalan pengiriman file jika Anda salah memasukkan alamat email.
              </li>
            </ul>
          </section>

          {/* 3. Pengiriman File (DIGITAL DELIVERY) */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Pengiriman File</h2>
            <p>
              File stiker akan dikirimkan secara otomatis ke email Anda segera setelah pembayaran berhasil diverifikasi
              oleh sistem (Midtrans). Silakan cek folder <em>Inbox</em> atau <em>Spam/Junk</em> email Anda.
            </p>
          </section>

          {/* 4. Kebijakan Refund (KHUSUS PRODUK DIGITAL - PENTING BUAT MIDTRANS) */}
          <section className="bg-[#F3F0E9] p-6 rounded-xl border border-[#E5E0D8]">
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">4. Kebijakan Pengembalian Dana (Refund)</h2>
            <p className="mb-3">Mengingat sifat produk digital yang dapat diduplikasi, maka:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Umum:</strong> Semua penjualan bersifat final. Kami <strong>tidak melayani refund</strong>
                jika file sudah berhasil dikirim ke email Anda.
              </li>
              <li>
                <strong>Pengecualian:</strong> Refund dana penuh hanya dapat diajukan jika:
                <ul className="list-circle pl-5 mt-1 text-sm">
                  <li>Terjadi pembayaran ganda (double payment).</li>
                  <li>File rusak (corrupt) dan kami gagal mengirimkan file pengganti dalam waktu 2x24 jam.</li>
                  <li>Sistem gagal mengirimkan file ke email Anda lebih dari 24 jam setelah pembayaran sukses.</li>
                </ul>
              </li>
              <li>Untuk mengajukan kendala, silakan hubungi kami dengan menyertakan bukti pembayaran.</li>
            </ul>
          </section>

          {/* 5. Kontak */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">5. Hubungi Kami</h2>
            <p>Jika file belum diterima atau ada kendala download, hubungi kami di:</p>
            <p className="font-bold mt-2 text-[#3E362E]">Email: stickerluma@gmail.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

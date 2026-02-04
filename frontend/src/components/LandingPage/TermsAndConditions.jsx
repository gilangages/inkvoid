// frontend/src/components/LandingPage/TermsAndConditions.jsx
import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

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
              Produk yang dijual di LumaSticker adalah <strong>aset digital (softcopy)</strong>.
              <strong>Tidak ada produk fisik</strong> yang dikirim ke rumah.
            </p>
          </section>

          {/* 2. Pemesanan & Pembayaran */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Pemesanan & Pembayaran</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Saat checkout, Anda <strong>wajib menyertakan alamat Email (Gmail)</strong> yang aktif.
              </li>
              <li>
                Penyelesaian pembayaran dilakukan secara manual via transfer Bank/E-Wallet dan dikonfirmasi melalui{" "}
                <strong>WhatsApp</strong>.
              </li>
            </ul>
          </section>

          {/* 3. Pengiriman File */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Pengiriman & Akses File</h2>
            <p>
              File disimpan secara aman di <strong>Google Drive</strong> dengan metode <em>Restricted Access</em>.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Setelah pembayaran terverifikasi, Admin akan memberikan akses ke email yang Anda masukkan saat checkout.
              </li>
              <li>
                Pastikan email tersebut adalah <strong>Gmail</strong> agar bisa membuka folder Google Drive.
              </li>
              <li>Anda dilarang menyebarkan link atau memberikan akses akun Anda ke pihak lain.</li>
            </ul>
          </section>

          {/* 4. Kebijakan Refund */}
          <section className="bg-[#F3F0E9] p-6 rounded-xl border border-[#E5E0D8]">
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">4. Kebijakan Pengembalian Dana (Refund)</h2>
            <p className="mb-3">Karena sifat produk digital:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Final:</strong> Tidak ada refund jika akses file sudah diberikan ke email Anda.
              </li>
              <li>
                <strong>Garansi:</strong> Jika file rusak (corrupt), hubungi kami untuk mendapatkan link pengganti.
              </li>
            </ul>
          </section>

          {/* 5. Kontak */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">5. Bantuan</h2>
            <p>Ada kendala akses Google Drive? Hubungi kami:</p>
            <p className="font-bold mt-2 text-[#3E362E]">stickerluma@gmail.com</p>
          </section>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

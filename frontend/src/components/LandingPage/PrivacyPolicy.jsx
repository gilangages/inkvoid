import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFCF8] min-h-screen font-sans text-[#3E362E]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl font-black mb-2 text-[#3E362E]">Kebijakan Privasi</h1>
        <p className="text-[#6B5E51] mb-10">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>

        <div className="space-y-8 text-sm md:text-base leading-relaxed text-[#6B5E51]">
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">1. Pengumpulan Data</h2>
            <p>Untuk memproses pesanan produk digital, kami hanya mengumpulkan informasi berikut:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                <strong>Nama:</strong> Untuk identifikasi pesanan.
              </li>
              <li>
                <strong>Alamat Email:</strong> Untuk mengirimkan file produk yang Anda beli.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Penggunaan Data</h2>
            <p>Data Anda hanya digunakan untuk:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Memproses transaksi pembayaran via Midtrans.</li>
              <li>Mengirimkan link download produk.</li>
              <li>Menghubungi Anda jika terjadi kendala pada pesanan.</li>
            </ul>
            <p className="mt-2 font-bold text-[#3E362E]">
              Kami TIDAK akan menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga manapun.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Keamanan</h2>
            <p>
              Kami menjaga keamanan data Anda dengan serius. Transaksi pembayaran diproses melalui gateway pembayaran
              terenkripsi (Midtrans), sehingga kami tidak menyimpan detail kartu kredit atau akun bank Anda.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">4. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang privasi data Anda, silakan hubungi kami di:
              <span className="font-bold text-[#3E362E]"> stickerluma@gmail.com</span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

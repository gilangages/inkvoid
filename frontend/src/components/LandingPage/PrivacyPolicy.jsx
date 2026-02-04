// frontend/src/components/LandingPage/PrivacyPolicy.jsx
import React, { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

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
          {/* BAGIAN 1: DATA YANG DIKUMPULKAN */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">1. Data yang Kami Kumpulkan</h2>
            <p>
              Untuk menjaga privasi dan keamanan Anda, LumaSticker hanya mengumpulkan data yang esensial untuk keperluan
              akses produk, yaitu:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                <strong>Alamat Email (Gmail):</strong> Wajib diisi saat checkout untuk memberikan izin akses
                (permission) ke file produk di Google Drive.
              </li>
            </ul>
          </section>

          {/* BAGIAN 2: PENGGUNAAN INFORMASI */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">2. Penggunaan Informasi</h2>
            <p>Alamat Email yang Anda berikan semata-mata digunakan untuk:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Menambahkan akun Anda ke daftar <em>"Allowed Viewers"</em> di folder Google Drive produk yang Anda beli.
              </li>
              <li>Mengirimkan notifikasi terkait akses file (jika diperlukan).</li>
            </ul>
            <p className="mt-2 font-bold italic">
              Kami menjamin tidak akan menjual atau membagikan email Anda kepada pihak ketiga manapun.
            </p>
          </section>

          {/* BAGIAN 3: TRANSAKSI (Ganti kalimat negatif jadi penjelasan alur) */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">3. Transaksi & Pembayaran</h2>
            <p>
              Seluruh proses konfirmasi pembayaran dilakukan secara langsung melalui <strong>WhatsApp</strong>. Hal ini
              dilakukan untuk memastikan keamanan transaksi dan memudahkan komunikasi Anda dengan Admin.
            </p>
          </section>

          {/* BAGIAN 4: KONTAK */}
          <section>
            <h2 className="text-xl font-bold text-[#3E362E] mb-3">4. Hubungi Kami</h2>
            <p>
              Pertanyaan seputar privasi dapat dikirim ke:
              <span className="font-bold text-[#3E362E]"> stickerluma@gmail.com</span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

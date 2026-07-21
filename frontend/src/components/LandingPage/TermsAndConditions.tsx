// frontend/src/components/LandingPage/TermsAndConditions.jsx
import { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#121214] min-h-screen font-sans text-[#E0D7D7]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-40 pb-20 relative">
        {/* Dekorasi halus di background */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#8287ac]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase">
            Syarat & <span className="text-[#8287ac] italic opacity-80">Ketentuan</span>
          </h1>
          <p className="text-[#B8B3B6] mb-16 text-xs font-mono tracking-widest opacity-60 uppercase">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>

          <div className="space-y-12 text-sm md:text-base leading-relaxed text-[#B8B3B6] font-light">
            {/* 1. Definisi Produk */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">1. Produk Digital</h2>
              <p>
                Produk yang dijual di InkVoid adalah{" "}
                <strong className="text-[#8287ac]">aset digital (softcopy)</strong>.
                <strong className="text-[#8287ac]"> Tidak ada produk fisik</strong> yang dikirim ke rumah.
              </p>
            </section>

            {/* 2. Pemesanan & Pembayaran */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">2. Pemesanan & Pembayaran</h2>
              <ul className="list-disc pl-5 space-y-3 opacity-90">
                <li>
                  Proses pembayaran dilakukan melalui platform pihak ketiga, yaitu{" "}
                  <strong className="text-[#8287ac]">Trakteer</strong>.
                </li>
                <li>
                  Anda diwajibkan memiliki akun Trakteer yang aktif (atau mendaftar terlebih dahulu) untuk dapat
                  menyelesaikan transaksi dan mendapatkan akses ke produk.
                </li>
              </ul>
            </section>

            {/* 3. Pengiriman File */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">3. Pengiriman & Akses File</h2>
              <ul className="list-disc pl-5 mt-4 space-y-3 opacity-90">
                <li>
                  Akses ke file produk digital akan diberikan secara otomatis melalui platform{" "}
                  <strong className="text-[#8287ac]">Trakteer</strong> setelah pembayaran Anda terverifikasi.
                </li>
                <li>Anda dilarang menyebarkan link unduhan atau memberikan akses akun Anda ke pihak lain.</li>
              </ul>
            </section>

            {/* 4. Kebijakan Refund */}
            <section className="bg-[#1F1F23]/50 p-8 rounded-none border border-[#8287ac]/10">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">
                4. Kebijakan Pengembalian Dana (Refund)
              </h2>
              <p className="mb-4 opacity-90">Karena sifat produk digital:</p>
              <ul className="list-disc pl-5 space-y-3 opacity-90">
                <li>
                  <strong className="text-[#8287ac]">Final:</strong> Tidak ada refund jika akses file sudah diberikan ke
                  email Anda.
                </li>
                <li>
                  <strong className="text-[#8287ac]">Garansi:</strong> Jika file rusak (corrupt), hubungi kami untuk
                  mendapatkan link pengganti.
                </li>
              </ul>
            </section>

            {/* 5. Kontak */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">5. Bantuan</h2>
              <p>Ada kendala akses Google Drive? Hubungi kami:</p>
              <a
                href="mailto:stickerluma@gmail.com"
                className="font-mono text-[#8287ac] mt-2 tracking-tight hover:underline cursor-pointer opacity-90">
                stickerluma@gmail.com
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

// frontend/src/components/LandingPage/PrivacyPolicy.jsx
import { useEffect } from "react";
import { Navbar } from "./Section/Navbar";
import { Footer } from "./Section/Footer";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

export default function PrivacyPolicy() {
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
            Kebijakan <span className="text-[#8287ac] italic opacity-80">Privasi</span>
          </h1>
          <p className="text-[#B8B3B6] mb-16 text-xs font-mono tracking-widest opacity-60 uppercase">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </p>

          <div className="space-y-12 text-sm md:text-base leading-relaxed text-[#B8B3B6] font-light">
            {/* BAGIAN 1: DATA YANG DIKUMPULKAN */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">1. Data yang Kami Kumpulkan</h2>
              <p>
                Kami mengutamakan privasi Anda. InkVoid tidak mengumpulkan data pribadi secara langsung di situs ini.
                Seluruh kebutuhan akun untuk akses produk ditangani sepenuhnya oleh platform pihak ketiga (Trakteer).
              </p>
            </section>

            {/* BAGIAN 2: TRANSAKSI & PEMBAYARAN */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">2. Transaksi & Pembayaran</h2>
              <p>
                Seluruh proses transaksi dan pembayaran dikelola secara aman oleh platform pihak ketiga, yaitu{" "}
                <strong className="text-[#8287ac]">Trakteer</strong>. Kami tidak mengumpulkan, memproses, atau menyimpan
                data pembayaran sensitif Anda (seperti informasi kartu kredit, dompet digital, atau rekening bank) di
                dalam sistem kami.
              </p>
            </section>

            {/* BAGIAN 3: KONTAK */}
            <section className="border-l border-[#8287ac]/20 pl-6 md:pl-8">
              <h2 className="text-xl font-bold text-[#E0D7D7] mb-4 tracking-tight">3. Hubungi Kami</h2>
              <p>
                Pertanyaan seputar privasi dapat dikirim ke:
                <a
                  href="mailto:stickerluma@gmail.com"
                  className="block mt-2 font-mono text-[#8287ac] hover:underline cursor-pointer">
                  {" "}
                  stickerluma@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}

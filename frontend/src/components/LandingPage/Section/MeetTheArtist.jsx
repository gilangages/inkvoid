import { Heart, Sparkles, Quote } from "lucide-react";

export const MeetTheArtist = () => {
  return (
    <section id="creator" className="py-24 px-6 max-w-6xl mx-auto relative">
      {/* Container Utama dengan efek kaca buram (Glassmorphism) yang halus */}
      <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-14 border border-[#E5E0D8] shadow-[0px_10px_40px_-10px_rgba(62,54,46,0.05)] flex flex-col md:flex-row items-center gap-12 md:gap-20 relative overflow-hidden">
        {/* Dekorasi Background Halus */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8DA399]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#D68C76]/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        {/* KOLOM KIRI: Foto (Desain Polaroid Besar) */}
        <div className="relative shrink-0 group">
          {/* Shadow/Layer belakang biar ada dimensi */}
          <div className="absolute inset-0 bg-[#3E362E] rounded-[2rem] translate-x-3 translate-y-3 opacity-10 transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5"></div>

          {/* Frame Foto */}
          <div className="relative w-72 h-[26rem] md:w-80 md:h-[28rem] bg-white p-4 rounded-[2rem] border border-[#E5E0D8] shadow-lg -rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out">
            <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-[#F3F0E9] relative">
              {/* FOTO KAMU */}
              <img
                src="./me_new.png"
                alt="Abdian"
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
            </div>

            {/* Hiasan kecil: Pin atau Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#D68C76]/30 backdrop-blur-md shadow-sm transform -rotate-1"></div>
          </div>
        </div>

        {/* KOLOM KANAN: Cerita */}
        <div className="text-center md:text-left relative z-10 flex-1">
          {/* Label Kecil */}
          <div className="inline-flex items-center gap-2 bg-[#F3F0E9] px-4 py-1.5 rounded-full mb-6 border border-[#E5E0D8]">
            <Sparkles size={14} className="text-[#8DA399] fill-[#8DA399]" />
            <span className="text-xs font-bold text-[#6B5E51] uppercase tracking-wider">Di Balik Layar</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#3E362E] mb-8 tracking-tight leading-tight">
            Hi, Aku Abdian! 👋
          </h2>

          <div className="relative">
            {/* Ikon Kutipan Besar Transparan */}
            <Quote className="absolute -top-6 -left-6 text-[#8DA399]/10 transform -scale-x-100" size={60} />

            <div className="space-y-6 text-[#6B5E51] text-lg leading-relaxed font-medium relative z-10 text-justify md:text-left">
              <p>
                Hi, aku Abdian. Di sela-sela hari-hariku, aku selalu menyempatkan diri untuk mencoba berbagai hal, salah
                satunya menggambar. Aku mulai menggambar (terutama menggambar tradisional) sejak bulan{" "}
                <span className="text-[#8DA399] font-bold">Juni 2025</span>. Tanpa sadar, aku menikmati prosesnya dan
                hasil gambarku lumayan bagus juga (menurutku).
              </p>

              <p>
                Setelah beberapa minggu, aku memutuskan untuk membagikan hasil gambarku di{" "}
                <a
                  href="https://www.instagram.com/qeynotfound?igsh=dGRueTNhanhtazI4"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#D68C76] font-bold underline decoration-wavy hover:text-[#3E362E] transition-colors cursor-pointer"
                  title="Lihat karyaku di Instagram">
                  Instagram
                </a>{" "}
                sebagai arsip pribadi. Kemudian setelah beberapa bulan, aku mencoba belajar untuk menggambar digital.
              </p>

              <p>
                Pada suatu hari, terlintas pikiran di kepalaku untuk membuat projek <i>hand-made sticker</i> ini.
                Setelah menyiapkan semua yang diperlukan—seperti mendesain website, membuat website, lalu menyiapkan
                stiker-stikernya, dll—akhirnya projekku ini jadi juga.
              </p>

              <p>Semoga stiker-stikerku ini bisa menghibur kamu dan mengisi hari-harimu menjadi lebih berwarna.</p>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="mt-10 flex flex-col md:flex-row items-center gap-5 pt-8 border-t border-[#E5E0D8]/60 border-dashed">
            <div className="flex items-center gap-2 text-[#3E362E] font-bold bg-white px-5 py-3 rounded-xl border border-[#E5E0D8] shadow-sm hover:-translate-y-1 transition-transform">
              <Heart size={20} className="text-red-400 fill-red-400" />
              <span>Terima kasih sudah mampir!</span>
            </div>

            <div className="text-right">
              <p className="text-sm text-[#8C8478] mb-1">Salam hangat,</p>
              <p className="font-handwriting text-2xl text-[#3E362E] rotate-[-4deg]">Abdian.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

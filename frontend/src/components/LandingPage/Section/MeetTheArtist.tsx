// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/MeetTheArtist.jsx



export const MeetTheArtist = () => {
  return (
    <section
      id="creator"
      className="py-24 px-4 overflow-hidden relative flex justify-center items-center border-t border-[#1F1F23]">
      {/* Container Utama */}
      <div className="relative group z-10">
        {/* Dekorasi Background (Blobs) - Diubah ke palet Muted Lavender */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-[30rem] md:h-[30rem] bg-[#8287ac]/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-[25rem] md:h-[25rem] bg-[#121214]/40 rounded-full blur-[40px] md:blur-[60px] pointer-events-none mix-blend-multiply"></div>

        {/* Shadow Berlapis: Menggunakan sudut kaku (InkVoid Style) */}
        <div className="absolute inset-0 bg-[#1F1F23] rounded-none rotate-[-4deg] opacity-40 scale-95 transition-transform duration-700 group-hover:rotate-[-6deg] group-hover:scale-100 border border-[#8287ac]/5"></div>
        <div className="absolute inset-0 bg-[#8287ac]/5 rounded-none rotate-[2deg] opacity-20 scale-95 transition-transform duration-700 group-hover:rotate-[4deg] group-hover:scale-100 border border-[#8287ac]/10"></div>

        {/* FRAME FOTO UTAMA */}
        {/* Mengubah bg-white ke bg-[#1F1F23] dan rounded-none */}
        <div className="relative bg-[#1F1F23] p-3 md:p-5 rounded-none shadow-2xl border border-[#8287ac]/20 rotate-[-1deg] transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-[1.01] group-hover:border-[#8287ac]/40">
          {/* Area Gambar: Ukuran tetap sesuai permintaan (w-[22rem], h-[30rem], dll) */}
          <div className="w-[22rem] h-[30rem] md:w-[24rem] md:h-[32rem] max-w-[90vw] rounded-none overflow-hidden bg-[#121214] relative">
            {/* Tekstur Noise halus khas Lo-Fi */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-noise z-10"></div>

            <img
              src="./me.png"
              alt="Artist"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out"
            />
          </div>

          {/* Hiasan: Selotip Atas (Diubah ke warna gelap/transparan) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#121214]/60 backdrop-blur-md rotate-1 border border-[#8287ac]/10 group-hover:bg-[#8287ac]/10 transition-colors duration-500"></div>

          {/* Hiasan: Selotip Bawah */}
          <div className="absolute -bottom-3 left-8 w-24 h-6 bg-[#121214]/60 backdrop-blur-md -rotate-2 border border-[#8287ac]/10 group-hover:bg-[#8287ac]/10 transition-colors duration-500"></div>

          {/* Icon GitHub */}
          <a
            href="https://github.com/gilangabdian"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 z-20 text-[#8287ac]/50 hover:text-[#8287ac] transition-colors duration-300 drop-shadow-md bg-[#121214]/60 p-2 rounded-sm backdrop-blur-sm border border-[#8287ac]/10"
            aria-label="GitHub Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

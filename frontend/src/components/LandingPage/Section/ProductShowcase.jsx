import { ProductCard } from "./ProductCard";
import { Sparkles } from "lucide-react";

export const ProductShowcase = ({ products, loading, onBuy }) => {
  return (
    <main id="products" className="max-w-6xl mx-auto px-6 py-16">
      {/* HEADER: RATA TENGAH */}
      <div className="text-center mb-12">
        <span className="bg-[#EAE7DF] text-[#3E362E] px-4 py-1.5 rounded-full text-xs font-bold border border-[#E5E0D8] inline-block mb-3">
          Update Terbaru
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-[#3E362E] mb-3 flex items-center justify-center gap-2">
          Koleksi Stiker ✂️
        </h2>
        <p className="text-[#6B5E51] font-medium max-w-lg mx-auto">
          Pilih paket stiker favoritmu, selesaikan pembayaran, dan file siap didownload instan.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-32 text-[#8DA399] font-medium animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E5E0D8] border-t-[#8DA399] rounded-full animate-spin mb-4"></div>
          Sedang menyiapkan stiker...
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* GRID PRODUK */}
          <div className="flex flex-wrap justify-center gap-8 w-full mb-16">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="w-full sm:w-[320px]">
                  <ProductCard product={product} onBuy={onBuy} />
                </div>
              ))
            ) : (
              <p className="w-full text-center text-[#6B5E51]">Belum ada produk yang ditampilkan.</p>
            )}
          </div>

          {/* INFO COMING SOON (REVISI) */}
          {/* Tidak pakai animasi scroll, tapi desain dibuat menarik & santai */}
          <div className="w-full max-w-2xl bg-[#FDFCF8] border-2 border-dashed border-[#E5E0D8] px-8 py-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left hover:border-[#8DA399] transition-colors shadow-sm">
            <div className="bg-[#EAE7DF] p-4 rounded-full text-[#3E362E] shrink-0">
              <Sparkles size={28} />
            </div>
            <div>
              <h4 className="font-bold text-xl text-[#3E362E] mb-1">Karya Berikutnya...</h4>
              {/* TEKS SANTAI: Tidak janji kapan, tapi memberi harapan */}
              <p className="text-[#6B5E51] leading-relaxed">
                Aku lagi nyiapin tema-tema baru yang lebih seru nih. Pantengin terus ya, siapa tau ada yang cocok sama
                seleramu nanti! ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

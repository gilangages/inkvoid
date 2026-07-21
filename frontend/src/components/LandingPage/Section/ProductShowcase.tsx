// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/ProductShowcase.jsx

import { ProductCard } from "./ProductCard";
import { Sparkles, Loader2 } from "lucide-react";

import type { components } from "../../../types/api";

interface ProductShowcaseProps {
  products: components["schemas"]["Product"][];
  loading: boolean;
  onBuy: (product: components["schemas"]["Product"]) => void;
}

export const ProductShowcase = ({ products, loading, onBuy }: ProductShowcaseProps) => {
  return (
    <main id="products" className="max-w-6xl mx-auto px-6 py-24 scroll-mt-8 md:scroll-mt-2">
      {/* HEADER: Minimalis & Langsung */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-[#E0D7D7] mb-4 tracking-tighter">Arsip Karya.</h2>
        <p className="text-[#B8B3B6] font-light max-w-md mx-auto opacity-80 italic">
          Kumpulan file digital yang bisa diambil. Pilih yang dirasa pas, selesaikan, dan simpan arsipnya.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-32 text-[#8287ac] font-mono text-xs tracking-widest flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-50" />
          MENYIAPKAN ARSIP...
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* GRID PRODUK */}
          <div className="flex flex-wrap justify-center gap-10 w-full mb-20">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="w-full sm:w-[320px]">
                  <ProductCard product={product} onBuy={onBuy} />
                </div>
              ))
            ) : (
              <p className="w-full text-center text-[#B8B3B6] font-light opacity-50 italic">
                Belum ada arsip yang tersedia untuk saat ini.
              </p>
            )}
          </div>

          {/* INFO NEXT: Lebih Jujur & Tidak Menjanjikan */}
          <div className="w-full max-w-2xl bg-[#1F1F23]/30 border border-[#8287ac]/10 px-8 py-10 rounded-none flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all hover:border-[#8287ac]/30">
            <div className="bg-[#121214] p-5 border border-[#8287ac]/10 text-[#8287ac] shrink-0 opacity-60">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[#E0D7D7] mb-2 tracking-tight">Sesuatu yang baru...</h4>
              <p className="text-[#B8B3B6] leading-relaxed text-sm font-light opacity-80">
                Akan ada coretan lain yang ditambahkan saat waktunya tepat. Tidak ada jadwal pasti, semua akan muncul
                begitu saja di sini.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

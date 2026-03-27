// gilangages/lumasticker/lumasticker-main/frontend/src/components/LandingPage/Section/ProductCard.jsx

import { ShoppingBag, ImageOff } from "lucide-react";
import { useState } from "react";

export const ProductCard = ({ product, onBuy }) => {
  const [imgError, setImgError] = useState(false);

  // Logic tetap: Mendapatkan URL gambar utama
  const getMainImage = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImg = product.images[0];
      return typeof firstImg === "object" ? firstImg.url : firstImg;
    }
    if (product.image_url) return product.image_url;
    return null;
  };

  const imageUrl = getMainImage();

  return (
    <div
      onClick={() => onBuy(product)}
      className="group bg-[#1F1F23]/40 p-4 rounded-none border border-[#8287ac]/10 hover:border-[#8287ac]/40 transition-all duration-500 cursor-pointer flex flex-col h-full shadow-2xl">
      {/* Container Gambar: Dibuat lebih gelap dan kaku */}
      <div className="aspect-square bg-[#121214] rounded-none overflow-hidden mb-4 relative border border-[#8287ac]/5 flex items-center justify-center">
        {!imgError && imageUrl ? (
          <img
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#8287ac]/40 p-4 text-center">
            <ImageOff size={32} className="mb-2" />
            <span className="text-[10px] font-mono tracking-widest uppercase">Null_Image</span>
          </div>
        )}

        {/* Label Harga: Style tag minimalis */}
        <div className="absolute top-3 right-3 bg-[#121214]/80 backdrop-blur-sm border border-[#8287ac]/30 text-[#E0D7D7] text-[10px] font-mono px-2 py-1 z-10">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#E0D7D7] leading-tight mb-2 group-hover:text-[#8287ac] transition-colors line-clamp-1 tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-[#B8B3B6] line-clamp-2 mb-6 font-light italic opacity-70">{product.description}</p>

        {/* Button: Tanpa rounded, border-only style */}
        <button className="mt-auto w-full border border-[#8287ac]/20 text-[#E0D7D7] text-xs font-bold py-3 rounded-none group-hover:bg-[#8287ac] group-hover:text-[#121214] transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest">
          <ShoppingBag size={14} />
          Detail Karya
        </button>
      </div>
    </div>
  );
};

import { ShoppingBag, ImageOff } from "lucide-react"; // Tambah icon ImageOff untuk error state
import { useState } from "react";

export const ProductCard = ({ product, onBuy }) => {
  const [imgError, setImgError] = useState(false);

  // Helper: Mendapatkan URL gambar utama dengan aman
  const getMainImage = () => {
    // 1. Cek array images
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImg = product.images[0];
      return typeof firstImg === "object" ? firstImg.url : firstImg;
    }
    // 2. Cek field legacy image_url
    if (product.image_url) return product.image_url;

    // 3. Fallback null
    return null;
  };

  const imageUrl = getMainImage();

  return (
    <div
      onClick={() => onBuy(product)}
      className="group bg-white p-3 rounded-xl border-2 border-[#E5E0D8] hover:border-[#8DA399] shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(141,163,153,0.5)] transition-all duration-300 cursor-pointer flex flex-col h-full">
      {/* Container Gambar */}
      <div className="aspect-square bg-[#F3F0E9] rounded-lg overflow-hidden mb-3 relative border border-[#E5E0D8] flex items-center justify-center">
        {/* Logic Render Gambar yang Lebih Aman */}
        {!imgError && imageUrl ? (
          <img
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)} // Set state error, jangan ubah src langsung agar React tau
          />
        ) : (
          // Tampilan Fallback Jika Gambar Error / Kosong
          <div className="flex flex-col items-center justify-center text-[#8DA399] p-4 text-center">
            <ImageOff size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">Gambar Tidak Tersedia</span>
          </div>
        )}

        {/* Label Harga */}
        <div className="absolute bottom-2 right-2 bg-[#FDFCF8] border border-[#3E362E] text-[#3E362E] text-xs font-bold px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(62,54,46,1)] z-10">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      <div className="px-1 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#3E362E] leading-tight mb-1 group-hover:text-[#8DA399] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-[#8C8478] line-clamp-2 mb-4">{product.description}</p>

        <button className="mt-auto w-full bg-[#3E362E] text-[#FDFCF8] text-sm font-bold py-2 rounded-lg group-hover:bg-[#8DA399] transition-colors flex items-center justify-center gap-2">
          <ShoppingBag size={14} />
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

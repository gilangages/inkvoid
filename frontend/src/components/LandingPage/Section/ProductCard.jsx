import { ShoppingBag } from "lucide-react";

export const ProductCard = ({ product, onBuy }) => {
  // Helper: Mendapatkan URL gambar utama dengan aman
  const getMainImage = () => {
    // 1. Jika images adalah array
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImg = product.images[0];
      // Cek apakah format baru (Object) atau lama (String URL)
      return typeof firstImg === "object" ? firstImg.url : firstImg;
    }
    // 2. Fallback ke image_url (kolom legacy)
    return product.image_url;
  };

  // Helper: Mendapatkan Label gambar utama
  const getMainLabel = () => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImg = product.images[0];
      // Hanya return label jika format object dan label tidak kosong
      if (typeof firstImg === "object" && firstImg.label) {
        return firstImg.label;
      }
    }
    return null;
  };
  return (
    <div
      onClick={() => onBuy(product)}
      className="group bg-white p-3 rounded-xl border-2 border-[#E5E0D8] hover:border-[#8DA399] shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(141,163,153,0.5)] transition-all duration-300 cursor-pointer flex flex-col h-full">
      {/* Gambar ala Polaroid */}
      <div className="aspect-square bg-[#F3F0E9] rounded-lg overflow-hidden mb-3 relative border border-[#E5E0D8]">
        <img
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          src={getMainImage()} // <-- Pakai variable hasil logic di atas
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />

        {/* --- FITUR BARU: Menampilkan Label Gambar (Jika ada) --- */}
        {getMainLabel() && (
          <div className="absolute top-2 left-2 max-w-[80%]">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full truncate block border border-white/20">
              {getMainLabel()}
            </span>
          </div>
        )}

        {/* Label Harga */}
        <div className="absolute bottom-2 right-2 bg-[#FDFCF8] border border-[#3E362E] text-[#3E362E] text-xs font-bold px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(62,54,46,1)]">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      <div className="px-1 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#3E362E] leading-tight mb-1 group-hover:text-[#8DA399] transition-colors">
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

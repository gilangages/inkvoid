import { ShoppingBag } from "lucide-react";

export const ProductCard = ({ product, onBuy }) => {
  return (
    <div
      onClick={() => onBuy(product)} // Klik Card = Buka Modal
      className="group bg-white p-3 rounded-xl border-2 border-[#E5E0D8] hover:border-[#8DA399] shadow-sm hover:shadow-[6px_6px_0px_0px_rgba(141,163,153,0.5)] transition-all duration-300 cursor-pointer flex flex-col h-full">
      {/* Gambar ala Polaroid */}
      <div className="aspect-square bg-[#F3F0E9] rounded-lg overflow-hidden mb-3 relative border border-[#E5E0D8]">
        <img
          onContextMenu={(e) => e.preventDefault()} // Mencegah klik kanan
          onDragStart={(e) => e.preventDefault()} // Mencegah gambar di-drag ke desktop
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />
        {/* Label Harga */}
        <div className="absolute bottom-2 right-2 bg-[#FDFCF8] border border-[#3E362E] text-[#3E362E] text-xs font-bold px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(62,54,46,1)]">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      <div className="px-1 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-[#3E362E] leading-tight mb-1 group-hover:text-[#8DA399] transition-colors">
          {product.name}
        </h3>
        {/* Deskripsi pendek (opsional) */}
        <p className="text-xs text-[#8C8478] line-clamp-2 mb-4">{product.description}</p>

        <button className="mt-auto w-full bg-[#3E362E] text-[#FDFCF8] text-sm font-bold py-2 rounded-lg group-hover:bg-[#8DA399] transition-colors flex items-center justify-center gap-2">
          <ShoppingBag size={14} />
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

import { ShoppingCart } from "lucide-react";

export const ProductCard = ({ product, onBuy }) => {
  return (
    <div className="group bg-white rounded-[2rem] p-4 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-2 border border-emerald-50 flex flex-col h-full">
      {/* Gambar */}
      <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-emerald-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />
        {/* Badge Harga */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-teal-800 font-extrabold px-4 py-1.5 rounded-full text-sm shadow-sm border border-white">
          Rp {parseInt(product.price).toLocaleString("id-ID")}
        </div>
      </div>

      {/* Konten */}
      <div className="px-2 flex-grow flex flex-col">
        <h3 className="text-xl font-extrabold text-teal-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-teal-600/80 text-sm font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <button
          onClick={() => onBuy(product)}
          className="w-full bg-[#38b2ac] hover:bg-[#319795] text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-teal-200">
          <ShoppingCart size={18} />
          Beli Aset
        </button>
      </div>
    </div>
  );
};

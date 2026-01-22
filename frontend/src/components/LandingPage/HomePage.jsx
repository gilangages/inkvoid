import { useEffect, useState } from "react";
import { Navbar } from "./Section/Navbar";
import { ProductCard } from "./Section/ProductCard";
import CheckoutModal from "../CheckoutModal";
import { getProducts } from "./../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Load Snap & Fetch Data (Gabungan code sebelumnya)
    const clientKey = "SB-Mid-client-XXXXXXXXXXXXXXXX"; // Ganti Client Key mu!
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    return () => document.body.removeChild(script);
  }, []);

  // 1. Trigger saat tombol "Beli" di Card diklik
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // 2. Trigger saat Form Modal disubmit
  const handleProcessPayment = async (product, customerName, customerEmail) => {
    setIsModalOpen(false); // Tutup modal dulu biar rapi

    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });
      const data = await res.json();

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => alert("✅ Pembayaran Berhasil! Cek emailmu."),
          onPending: () => alert("⏳ Menunggu pembayaran..."),
          onError: () => alert("❌ Pembayaran gagal."),
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION (Ghibli Vibes) */}
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto relative">
        {/* Hiasan background bulat (awan abstrak) */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 tracking-tight leading-tight">
          Karya Digital <br />
          <span className="text-emerald-600">Penuh Inspirasi.</span>
        </h1>
        <p className="text-xl text-teal-700/70 mb-10 max-w-2xl mx-auto font-medium">
          Temukan aset terbaik untuk projek kreatifmu. Dibuat dengan hati, dikirim instan ke emailmu.
        </p>

        <a
          href="#products"
          className="bg-teal-800 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-teal-900/20 hover:bg-teal-900 hover:-translate-y-1 transition-all">
          Jelajahi Sekarang 🌿
        </a>
      </section>

      {/* PRODUCTS GRID */}
      <main id="products" className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 border-b border-teal-100 pb-4">
          <h2 className="text-3xl font-bold text-teal-900">Koleksi Terbaru</h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-teal-500 font-medium animate-pulse">Sedang memuat keajaiban...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleOpenModal} // Sambungkan ke fungsi buka modal
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL COMPONENT */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleProcessPayment}
      />
    </div>
  );
}

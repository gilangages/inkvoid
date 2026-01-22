import { useEffect, useState } from "react";
import { getProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components (Named Exports)
import { Navbar } from "./Section/Navbar";
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "../CheckoutModal";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // 1. Setup Snap Midtrans
    const clientKey = "SB-Mid-client-XXXXXXXXXXXXXXXX"; // GANTI KEY KAMU
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    // 2. Fetch Data
    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => console.error("Gagal load produk:", err))
      .finally(() => setLoading(false));

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleProcessPayment = async (product, customerName, customerEmail) => {
    setIsModalOpen(false);
    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });
      const data = await res.json();
      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => alert("✅ Makasih ya udah beli! Cek email kamu."),
          onPending: () => alert("⏳ Menunggu pembayaran..."),
          onError: () => alert("❌ Pembayaran gagal."),
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    // FIX FOOTER: min-h-screen + flex-col
    <div className="min-h-screen flex flex-col font-sans text-[#3E362E]">
      <Navbar />

      {/* Konten Utama (flex-grow mendorong footer ke bawah) */}
      <div className="flex-grow">
        <Hero />
        <Benefits />
        <ProductShowcase products={products} loading={loading} onBuy={handleOpenModal} />
        <FAQ />
      </div>

      <Footer />

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleProcessPayment}
      />
      {/* Floating WA Button */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20kak,%20mau%20tanya..."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center justify-center border-2 border-white"
        title="Chat WhatsApp">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
};

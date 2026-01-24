import { useEffect, useState } from "react";
import { getProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components
import { Navbar } from "./Section/Navbar";
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "../CheckoutModal";
import { WhatsAppSection } from "./Section/WhatsAppSection";
import { SuccessModal } from "../SuccessModal";
import { ErrorModal } from "../ErrorModal";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- 1. PINDAHKAN FUNGSI HELPER KE ATAS (Best Practice) ---
  // Agar aman dipanggil di dalam useEffect
  const showError = (msg) => {
    setErrorMessage(msg);
    setIsErrorOpen(true);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // --- 2. PERBAIKAN ERROR "Cascading Renders" ---
    // Cek Titipan Pesan dengan setTimeout agar tidak synchronous
    const paymentStatus = localStorage.getItem("paymentSuccess");
    if (paymentStatus === "true") {
      setTimeout(() => {
        setIsSuccessOpen(true); // Buka modal dengan sedikit delay
      }, 500);
      localStorage.removeItem("paymentSuccess");
    }

    // 3. Setup Snap Midtrans
    const clientKey = "Mid-client-9k6P5r8pEQkQaEan"; // GANTI KEY KAMU
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    // 4. Fetch Data
    getProducts()
      .then((res) => res.json())
      .then((json) => setProducts(json.data || []))
      .catch((err) => {
        console.error(err);
        showError("Gagal memuat produk."); // Sekarang aman dipanggil
      })
      .finally(() => setLoading(false));

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []); // Dependency array kosong aman karena showError didefinisikan di dalam komponen

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
          onSuccess: (result) => {
            console.log("Success:", result);
            // Simpan tanda sukses
            localStorage.setItem("paymentSuccess", "true");
            // Reload halaman (opsional, tapi bagus untuk memastikan cart/state bersih)
            // Atau kalau mau manual tanpa reload:
            // setIsSuccessOpen(true);
            window.location.reload();
          },
          onPending: (result) => {
            console.log("Pending Result:", result);
            showError("Pembayaran tertunda. Cek riwayat transaksimu.");
          },
          onError: (result) => {
            console.error("Error Result:", result);
            showError("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            console.log("Popup closed");
          },
        });
      } else {
        showError("Gagal mendapatkan token: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      showError("Error Sistem: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3E362E]">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Benefits />
        <ProductShowcase products={products} loading={loading} onBuy={handleOpenModal} />
        <FAQ />
        <WhatsAppSection />
      </div>
      <Footer />

      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleProcessPayment}
      />

      {/* MODAL KOMPONEN */}
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message={errorMessage} />

      {/* Floating WA */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-16 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform flex items-center justify-center border-4 border-white">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
};

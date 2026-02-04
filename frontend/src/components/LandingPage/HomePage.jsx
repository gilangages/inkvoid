// frontend/src/components/LandingPage/HomePage.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components
import { Navbar } from "./Section/Navbar";
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { HowToOrder } from "./Section/HowToOrder";
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "./CheckoutModal";
import { WhatsAppSection } from "./Section/WhatsAppSection";
import { SuccessModal } from "./SuccessModal";
import { ErrorModal } from "./ErrorModal";
import { MeetTheArtist } from "./Section/MeetTheArtist";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg) => {
    setErrorMessage(msg);
    setIsErrorOpen(true);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setProducts(json.data);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- LOGIC BARU: PROCESS PAYMENT VIA WHATSAPP ---
  // Parameter 'product' disini sudah berisi { ...productAsli, buyerEmail: '...' } dari CheckoutModal
  const handleProcessPayment = async (product) => {
    setIsModalOpen(false);

    try {
      // 1. Panggil API Backend agar transaksi tercatat di Database Admin (Order History)
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: "Guest WhatsApp",
        customer_email: product.buyerEmail, // <--- UPDATE 1: Pakai email input user
      });

      const data = await res.json();

      if (data.success) {
        // 2. Siapkan Link WhatsApp
        const adminNumber = "6283824032460";

        // <--- UPDATE 2: Tambahkan info Email ke dalam format pesan --->
        const message = `Halo Admin LumaSticker!

Saya mau bungkus stiker ini:
Nama produk: *${product.name}*
Harga       :  Rp ${parseInt(product.price).toLocaleString("id-ID")}

Email Gmail untuk akses Drive:
*${product.buyerEmail}*

Mohon dicek bukti transfer saya (terlampir).
Terima kasih!`.trim();

        const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

        // 3. Buka WhatsApp di Tab Baru
        window.open(waUrl, "_blank");
      } else {
        showError("Gagal membuat pesanan: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      console.error("Error Sistem:", error);
      // Fallback: Jika backend error, tetap arahkan ke WA manual
      const adminNumber = "6283824032460";
      // Pastikan fallback juga membawa email jika terjadi error sistem
      const message = `Halo LumaSticker, saya mau beli ${product.name}.
Email saya: ${product.buyerEmail || "-"}
(Sistem Error, mohon bantu manual)`;

      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3E362E]">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Benefits />

        <HowToOrder />

        <ProductShowcase products={products} loading={loading} onBuy={handleOpenModal} />

        <MeetTheArtist />
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

      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message={errorMessage} />

      <FloatingWhatsAppButton />
    </div>
  );
};

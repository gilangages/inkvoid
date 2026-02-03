import { useEffect, useState } from "react";
import { getAllProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

// Import Components
import { Navbar } from "./Section/Navbar";
import { Hero } from "./Section/Hero";
import { Benefits } from "./Section/Benefits";
import { HowToOrder } from "./Section/HowToOrder"; // PASTIKAN FILE INI SUDAH DIBUAT
import { ProductShowcase } from "./Section/ProductShowcase";
import { FAQ } from "./Section/FAQ";
import { Footer } from "./Section/Footer";
import { CheckoutModal } from "./CheckoutModal";
import { WhatsAppSection } from "./Section/WhatsAppSection";
import { SuccessModal } from "./SuccessModal";
import { ErrorModal } from "./ErrorModal";
import { MeetTheArtist } from "./Section/MeetTheArtist";

export const HomePage = () => {
  // Inisialisasi dengan array kosong
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
    // 1. Fetch Data Real (Logic Midtrans dihapus karena pindah ke WA)
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
  // Parameter hanya 'product' karena input nama/email sudah dihapus dari modal
  const handleProcessPayment = async (product) => {
    setIsModalOpen(false);

    try {
      // 1. Panggil API Backend agar transaksi tercatat di Database Admin (Order History)
      // Kita kirim data dummy/placeholder karena user tidak input nama lagi
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: "Guest WhatsApp",
        customer_email: "verifikasi@whatsapp.com",
      });

      const data = await res.json();

      if (data.success) {
        // 2. Siapkan Link WhatsApp
        const adminNumber = "6283824032460"; // Nomor sesuai floating button kamu

        // FIX: Langsung pakai emoji asli di dalam string (Backtick)
        // encodeURIComponent akan otomatis mengubahnya menjadi format URL yang aman
        const message = `Halo Admin LumaSticker!

Saya mau bungkus stiker ini:
Nama produk: *${product.name}*
Harga      :  Rp ${parseInt(product.price).toLocaleString("id-ID")}

Mohon dicek bukti transfer saya (terlampir).
Terima kasih!`.trim();

        const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

        // 3. Buka WhatsApp di Tab Baru
        window.open(waUrl, "_blank");

        // Optional: Tampilkan sukses modal sebentar biar user tau proses berhasil
        // setIsSuccessOpen(true);
      } else {
        showError("Gagal membuat pesanan: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      console.error("Error Sistem:", error);
      // Fallback: Jika backend error, tetap arahkan ke WA manual agar user tidak kecewa
      const adminNumber = "6283824032460";
      const message = `Halo LumaSticker, saya mau beli ${product.name}. (Sistem Error, mohon bantu manual)`;
      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3E362E]">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <Benefits />

        {/* SECTION CARA ORDER (Timeline Vertical) DITAMBAHKAN DISINI */}
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

      {/* Floating WA */}
      <a
        href="https://wa.me/6283824032460?text=Halo%20kak,%20mau%20tanya%20soal%20stiker..."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-2 md:bottom-8 md:right-4 bg-[#25D366] text-white p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform flex items-center justify-center border-4 border-white">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
};

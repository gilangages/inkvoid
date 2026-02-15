// frontend/src/components/LandingPage/HomePage.jsx
import { useEffect, useState, useCallback } from "react";
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
// Import Loading Screen Baru
import { LoadingScreen } from "./LoadingScreen";

export const HomePage = () => {
  const [products, setProducts] = useState([]);

  // State untuk Loading Awal (Full Screen)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // State untuk Error Awal (Full Screen jika fetch gagal)
  const [showErrorScreen, setShowErrorScreen] = useState(false);

  // Loading state biasa untuk komponen showcase (jika perlu refetch nanti)
  const [componentLoading, setComponentLoading] = useState(false);

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

  // Fungsi fetch data yang dipisahkan agar bisa dipanggil ulang (Retry)
  const fetchData = useCallback(async () => {
    setIsInitialLoading(true);
    setShowErrorScreen(false);

    try {
      // HAPUS timeoutPromise dan Promise.race
      // Kita ganti dengan fetch biasa yang akan menunggu sampai browser/server merespon

      console.log("Memulai pengambilan data... Menunggu server Render bangun...");

      const response = await getAllProducts(); // <--- Frontend akan menunggu disini, berapapun lamanya

      // Jika response sudah kembali, baru kita cek statusnya
      if (!response.ok) {
        // Jika server merespon dengan error (misal 429 Too Many Requests atau 500)
        throw new Error("Gagal memuat data / Server Limit");
      }

      const json = await response.json();

      if (json.data && json.data.length > 0) {
        setProducts(json.data);
      } else {
        setProducts([]);
      }

      // SUKSES: Matikan loading
      setIsInitialLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);

      // ERROR: Matikan loading, TAMPILKAN Error Screen
      // Ini hanya akan terpanggil jika:
      // 1. Internet user mati
      // 2. Render merespon dengan error (limit habis/crash)
      // 3. Browser user timeout (biasanya sangat lama, > 2 menit)
      setIsInitialLoading(false);
      setShowErrorScreen(true);
    } finally {
      setComponentLoading(false);
    }
  }, []);

  // Panggil fetchData saat pertama kali render
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler tombol "Lanjut"
  const handleContinueAnyway = () => {
    setShowErrorScreen(false);
    // User masuk dengan kondisi produk kosong
  };

  return (
    <>
      {/* LOADING SCREEN OVERLAY */}
      {/* Akan tampil jika sedang loading awal ATAU jika ada error screen */}
      {(isInitialLoading || showErrorScreen) && (
        <LoadingScreen
          isLoading={isInitialLoading}
          isError={showErrorScreen}
          onRetry={fetchData}
          onContinue={handleContinueAnyway}
        />
      )}

      {/* KONTEN UTAMA WEBSITE */}
      {/* Kita sembunyikan konten utama jika LoadingScreen sedang aktif agar rapi */}
      <div
        className={`min-h-screen flex flex-col font-sans text-[#3E362E] ${isInitialLoading || showErrorScreen ? "hidden" : ""}`}>
        <Navbar />
        <div className="flex-grow">
          <Hero />
          <Benefits />

          <HowToOrder />

          {/* Gunakan state componentLoading disini (biasanya false setelah init load) */}
          <ProductShowcase products={products} loading={componentLoading} onBuy={handleOpenModal} />

          <MeetTheArtist />
          <FAQ />
          <WhatsAppSection />
        </div>
        <Footer />

        <CheckoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onSubmit={async (product) => {
            // ... LOGIKA PAYMENT SAMA SEPERTI SEBELUMNYA ...
            // (Copy paste logic handleProcessPayment di sini atau gunakan yang sudah ada)
            // Saya singkat disini agar fokus ke Loading Screen,
            // TAPI pastikan function handleProcessPayment kamu tetap ada seperti di file aslimu.
            await handleProcessPayment(product);
          }}
        />

        <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} />
        <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message={errorMessage} />

        <FloatingWhatsAppButton />
      </div>
    </>
  );

  // --- LOGIC LAMA KAMU ---
  // Pastikan function ini ada di dalam component HomePage sebelum return
  async function handleProcessPayment(product) {
    setIsModalOpen(false);

    try {
      const res = await purchaseProduct({
        product_id: product.id,
        customer_name: "Guest WhatsApp",
        customer_email: product.buyerEmail,
      });

      const data = await res.json();

      if (data.success) {
        const adminNumber = "6283824032460";
        const message = `Halo Admin LumaSticker!

Saya mau bungkus stiker ini:
Nama produk: *${product.name}*
Harga       :  Rp ${parseInt(product.price).toLocaleString("id-ID")}

Email Gmail untuk akses Drive:
*${product.buyerEmail}*

Mohon dicek bukti transfer saya (terlampir).
Terima kasih!`.trim();

        const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
      } else {
        showError("Gagal membuat pesanan: " + (data.message || "Unknown Error"));
      }
    } catch (error) {
      console.error("Error Sistem:", error);
      const adminNumber = "6283824032460";
      const message = `Halo Admin LumaSticker, saya mau beli ${product.name}.
Email saya: ${product.buyerEmail || "-"}
(Sistem Error, mohon bantu manual)`;

      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  }
};

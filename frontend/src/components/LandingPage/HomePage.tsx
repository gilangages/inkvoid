import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router";
import api from "../../lib/api/apiClient";
import type { components } from "../../types/api";
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
  const [products, setProducts] = useState<components["schemas"]["Product"][]>([]);

  // State untuk Loading Awal (Full Screen)
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  // State untuk Error Awal (Full Screen jika fetch gagal)
  const [showErrorScreen, setShowErrorScreen] = useState(false);

  // State untuk Fetch Selesai
  const [fetchComplete, setFetchComplete] = useState(false);

  // Loading state biasa untuk komponen showcase (jika perlu refetch nanti)
  const [componentLoading, setComponentLoading] = useState(false);

  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<components["schemas"]["Product"] | null>(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setIsErrorOpen(true);
  };

  const handleOpenModal = (product: components["schemas"]["Product"]) => {
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

      console.log("Memulai pengambilan data... Menunggu server bangun...");

      const { data, error } = await api.GET("/products");

      if (error) {
        // Jika server merespon dengan error (misal 429 Too Many Requests atau 500)
        throw new Error("Gagal memuat data / Server Limit");
      }

      if (data && (data as any).data && (data as any).data.length > 0) {
        setProducts((data as any).data);
      } else {
        setProducts([]);
      }

      // SUKSES: Jangan langsung matikan modal, tapi set fetch complete
      setFetchComplete(true);
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
      setFetchComplete(false);
    } finally {
      setComponentLoading(false);
    }
  }, []);

  // Panggil fetchData saat pertama kali render
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Fungsi untuk mencatat kunjungan
    async function recordVisit() {
      try {
        // Generate atau ambil visitor_id dari localStorage
        // Ini tetap sama meskipun IP berubah (WiFi ↔ data seluler)
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID(); // UUID v4 standar browser
          localStorage.setItem("visitor_id", visitorId);
        }

        const { response } = await api.POST("/visits", {
          body: { visitor_id: visitorId },
        });

        if (response.ok) {
          // Visit recorded/updated successfully (silent)
        }
      } catch (error) {
        // Silent fail — jangan ganggu user
        console.error(error);
      }
    }

    recordVisit();
  }, []); // Array kosong [] artinya hanya jalan 1x saat website dibuka

  // Check location state setting target after initial loading finishes
  useEffect(() => {
    if (!isInitialLoading && !showErrorScreen && location.state?.targetId) {
      // Tunggu sebentar agar komponen DOM sempat dirender (karena tadinya display 'hidden')
      const targetId = location.state.targetId;

      // Hapus targetId dari state supaya tidak double scroll kalau user refresh
      window.history.replaceState({}, document.title)

      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [isInitialLoading, showErrorScreen, location.state]);

  // Handler tombol "Lanjut"
  const handleContinueAnyway = () => {
    setShowErrorScreen(false);
    // User masuk dengan kondisi produk kosong
  };

  // Handler LoadingScreen Complete
  const handleLoadingComplete = () => {
    setIsInitialLoading(false);
  };

  return (
    <>
      {/* LOADING SCREEN OVERLAY */}
      {/* Akan tampil jika sedang loading awal ATAU jika ada error screen */}
      {(isInitialLoading || showErrorScreen) && (
        <LoadingScreen
          isLoading={isInitialLoading}
          isError={showErrorScreen}
          fetchComplete={fetchComplete}
          onComplete={handleLoadingComplete}
          onRetry={fetchData}
          onContinue={handleContinueAnyway}
        />
      )}

      {/* KONTEN UTAMA WEBSITE */}
      {/* Kita sembunyikan konten utama jika LoadingScreen sedang aktif agar rapi */}
      <div className={`min-h-screen flex flex-col font-sans ${isInitialLoading || showErrorScreen ? "hidden" : ""}`}>
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
  // --- LOGIC LAMA KAMU ---
  // Pastikan function ini ada di dalam component HomePage sebelum return
  async function handleProcessPayment(product: components["schemas"]["Product"]) {
    setIsModalOpen(false);

    try {
      const { response, error } = await api.POST("/payment/purchase", {
        body: {
          product_id: product.id || 0,
          customer_name: "Guest WhatsApp",
          customer_email: (product as any).buyerEmail || "",
        },
      });

      if (response.ok) {
        const adminNumber = "6283824032460";
        const message = `Halo, saya ingin mengambil arsip karya ini:

Karya: *${product.name}*
Email: *${(product as any).buyerEmail}*

Berikut bukti transfernya. Terima kasih.`.trim();

        const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
      } else {
        showError("Gagal membuat pesanan: " + ((error as any)?.message || "Unknown Error"));
      }
    } catch (error) {
      console.error("Error Sistem:", error);
      const adminNumber = "6283824032460";
      const message = `Halo, ada kendala sistem saat ingin mengambil arsip ${product.name}.
Email: ${(product as any).buyerEmail || "-"}
(Mohon bantu proses manual)`;

      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  }
};

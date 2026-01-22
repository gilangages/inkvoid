import { useEffect, useState } from "react";
import { getProducts } from "../../lib/api/ProductApi";
import { purchaseProduct } from "../../lib/api/PaymentApi";

export const HomePage = () => {
  // <--- Nama komponen sesuai nama file
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load Snap JS (Sama kayak sebelumnya)
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = "Mid-client-9k6P5r8pEQkQaEan"; // Ganti Client Key kamu

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 2. Fetch Data Produk (Otomatis saat dibuka)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        if (!response.ok) throw new Error("Gagal fetch data");

        const json = await response.json();
        setProducts(json.data); // Ambil array data dari backend
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data produk!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. Handle Beli (Menunggu Klik User)
  const handleBuy = async (product) => {
    const customerName = prompt("Masukkan Nama:", "User Luma");
    const customerEmail = prompt("Masukkan Email:", "user@example.com");

    if (!customerName || !customerEmail) return;

    try {
      const response = await purchaseProduct({
        product_id: product.id,
        customer_name: customerName,
        customer_email: customerEmail,
      });

      // Backend kita mereturn object langsung (setelah .json() di api wrapper)
      // atau response.token kalau pakai fetch manual yang sudah di-json-kan.
      const data = await response.json();

      console.log("Response Backend:", data); // <--- Cek ini di Console Browser!

      // --- CEK APAKAH TOKEN ADA? ---
      if (!data.token) {
        alert("Gagal: " + (data.message || "Token tidak ditemukan"));
        return; // <--- BERHENTI DI SINI, JANGAN LANJUT KE SNAP
      }

      if (window.snap) {
        window.snap.pay(data.token, {
          // Tambahkan console.log agar 'result' terpakai
          onSuccess: (result) => {
            console.log("Sukses:", result);
            alert("Bayar Sukses!");
          },
          onPending: (result) => {
            console.log("Pending:", result);
            alert("Menunggu Pembayaran");
          },
          onError: (result) => {
            console.log("Error:", result);
            alert("Bayar Gagal");
          },
          onClose: () => {
            alert("Kamu menutup popup");
          },
        });
      }
    } catch (error) {
      alert("Error Transaksi: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Test Landing Page</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4 bg-gray-200"
                />
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">Rp {parseInt(product.price).toLocaleString("id-ID")}</span>
                  <button
                    onClick={() => handleBuy(product)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

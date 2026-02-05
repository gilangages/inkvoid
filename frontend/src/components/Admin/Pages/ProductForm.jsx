import { useState } from "react";
import { Save, X, UploadCloud } from "lucide-react"; // Hapus import yang tidak terpakai
import { createProduct } from "../../../lib/api/ProductApi";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../../lib/alert";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import TextAreaAutosize from "react-textarea-autosize";

export default function ProductForm() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Preview Full Gambar (Lightbox)
  const [previewUrl, setPreviewUrl] = useState(null);

  // State Label (Key: index, Value: string)
  const [labels, setLabels] = useState({});

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  // Handle Label Change
  const handleLabelChange = (index, value) => {
    setLabels((prev) => ({ ...prev, [index]: value }));
  };

  // Handle Pindah Urutan (Reorder)
  const moveImage = (index, direction) => {
    const newFiles = [...files];
    const newLabels = { ...labels }; // Copy object labels

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Validasi batas array
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    // 1. Swap File
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];

    // 2. Swap Label (Ikuti perpindahan file)
    const labelCurrent = newLabels[index] || "";
    const labelTarget = newLabels[targetIndex] || "";

    newLabels[index] = labelTarget;
    newLabels[targetIndex] = labelCurrent;

    setFiles(newFiles);
    setLabels(newLabels);
  };

  // Handle Hapus Gambar
  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);

    // Re-index labels agar urutan tidak berantakan setelah dihapus
    const newLabels = {};
    let newIdx = 0;
    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        newLabels[newIdx] = labels[i] || "";
        newIdx++;
      }
    }

    setFiles(newFiles);
    setLabels(newLabels);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (files.length === 0) {
      alertError("Minimal pilih 1 gambar produk!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      // Append Images
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Append Labels (Urutkan sesuai index files)
      // Kita map files, bukan labels, untuk memastikan urutan sinkron
      const labelsArray = files.map((_, idx) => labels[idx] || "");
      formData.append("image_labels", JSON.stringify(labelsArray));

      const response = await createProduct(token, formData);
      const responseBody = await response.json();

      if (response.ok) {
        await alertSuccess("Produk berhasil dibuat!");
        navigate("/admin/products");
      } else {
        await alertError(responseBody.message || "Gagal upload");
      }
    } catch (error) {
      console.error(error);
      await alertError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-slide-up pb-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[#3e362e]">Upload Produk Baru</h1>
        <p className="text-[#8c8478]">Tambahkan aset stiker digital ke database.</p>
      </header>

      <div className="bg-white border-2 border-[#e5e0d8] rounded-2xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Nama Produk */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Nama Produk</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none transition-all"
                placeholder="Contoh: Stiker Kucing Lucu Pack 1"
              />
            </div>

            {/* Harga */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Harga (Rp)</label>
              <input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none transition-all"
                placeholder="15000"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-sm font-bold text-[#3e362e]">Deskripsi</label>
              <TextAreaAutosize
                minRows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none resize-none transition-all"
                placeholder="Jelaskan detail stiker..."
              />
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="text-sm font-bold text-[#3e362e] mb-3 block">Galeri Foto Produk & Label</label>

            {/* Preview List Gambar */}
            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 animate-fade-in">
                {files.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="relative bg-gray-50 rounded-xl overflow-hidden border-2 border-[#8da399] shadow-sm flex flex-col">
                      {/* Gambar */}
                      <div
                        className="relative aspect-square cursor-zoom-in overflow-hidden"
                        onClick={() => setPreviewUrl(url)}>
                        <img
                          src={url}
                          alt="preview"
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-0 right-0 bg-[#3e362e] text-white text-[10px] px-2 py-0.5 rounded-bl-lg">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* Input Label & Controls */}
                      <div className="p-2 bg-white flex flex-col gap-2">
                        <input
                          placeholder="Label (Ex: Tampak Depan)"
                          className="w-full text-xs border border-gray-300 p-1.5 rounded focus:border-[#8da399] outline-none"
                          value={labels[idx] || ""}
                          onChange={(e) => handleLabelChange(idx, e.target.value)}
                        />

                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 bg-gray-100 rounded text-[10px] hover:bg-gray-200 disabled:opacity-30">
                              ⬆️
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, "down")}
                              disabled={idx === files.length - 1}
                              className="p-1 bg-gray-100 rounded text-[10px] hover:bg-gray-200 disabled:opacity-30">
                              ⬇️
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Area Input (Upload Box) */}
            <div className="relative">
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-[#dcdcdc] rounded-xl p-8 text-center hover:border-[#8da399] hover:bg-[#f4fcf7] transition-all duration-300 group">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-[#e8f5e9] p-3 rounded-full text-[#2e7d32] group-hover:scale-110 transition-transform shadow-sm">
                    <UploadCloud size={28} />
                  </div>
                  <p className="text-sm font-bold text-[#3e362e]">Klik untuk pilih gambar</p>
                  <p className="text-xs text-gray-400">Bisa pilih banyak file sekaligus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-4">
            <button
              disabled={isLoading}
              type="submit"
              className="w-full md:w-auto justify-center bg-[#3e362e] text-white font-bold py-3 px-10 rounded-xl hover:bg-[#5a4e44] transition-all flex items-center gap-2 disabled:opacity-50 shadow-md active:scale-95">
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin text-lg">⏳</span> Menyimpan...
                </span>
              ) : (
                <>
                  <Save size={18} /> Publish Produk
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL PREVIEW IMAGE (LIGHTBOX) */}
      {previewUrl &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 cursor-zoom-out"
            onClick={() => setPreviewUrl(null)}>
            <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition">
              <X size={32} />
            </button>
            <img
              src={previewUrl}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-slide-up"
              alt="Full Preview"
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

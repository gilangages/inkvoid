import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Save, X, UploadCloud, GripVertical } from "lucide-react";
import { productUpdate } from "../../../lib/api/ProductApi";
import { alertSuccess, alertError } from "../../../lib/alert";
import { useLocalStorage } from "react-use";
import TextAreaAutosize from "react-textarea-autosize";

// --- DND KIT IMPORTS ---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- KOMPONEN ITEM (Sama seperti ProductForm) ---
function SortablePhoto({ id, item, index, onRemove, onLabelChange, onPreview }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-gray-50 rounded-xl overflow-hidden border-2 border-[#8da399] shadow-sm flex flex-col group touch-none">
      {/* Gambar */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img src={item.preview} alt="preview" className="w-full h-full object-cover select-none" />

        {/* Overlay Grip & Info */}
        <div className="absolute top-0 right-0 left-0 bg-black/50 p-1 flex justify-between items-center px-2 z-10">
          <div className="text-white text-[10px] bg-black/50 px-1.5 rounded">
            {item.isExisting ? "Lama" : "Baru"} #{index + 1}
          </div>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded text-white">
            <GripVertical size={16} />
          </div>
        </div>

        {/* Klik area gambar untuk zoom */}
        <div onClick={() => onPreview(item.preview)} className="absolute inset-0 top-8 bg-transparent cursor-zoom-in" />
      </div>

      {/* Input Label & Controls */}
      <div className="p-2 bg-white flex flex-col gap-2">
        <input
          placeholder="Label (Ex: Tampak Depan)"
          className="w-full text-xs border border-gray-300 p-1.5 rounded focus:border-[#8da399] outline-none"
          value={item.label || ""}
          onChange={(e) => onLabelChange(id, e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
        />

        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={() => onRemove(id)}
            className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors flex items-center gap-1 text-[10px] font-bold">
            <X size={14} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProductModal({ product, isOpen, onClose, onSuccess }) {
  const [token] = useLocalStorage("token", "");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- STATE DATA ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);

  // --- DND SENSORS ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // --- 1. POPULATE DATA SAAT MODAL DIBUKA (FIX UTAMA) ---
  useEffect(() => {
    if (isOpen && product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");

      // A. Ambil Label (Parse jika JSON string untuk fallback)
      let loadedLabels = [];
      if (product.image_labels) {
        if (Array.isArray(product.image_labels)) {
          loadedLabels = product.image_labels;
        } else if (typeof product.image_labels === "string") {
          try {
            loadedLabels = JSON.parse(product.image_labels);
          } catch (error) {
            console.error("Gagal parse labels:", error);
            loadedLabels = [];
          }
        }
      }

      // B. Setup Items (Gambar Lama + Labelnya)
      let initialItems = [];

      // Cek apakah images array valid
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        initialItems = product.images.map((item, idx) => {
          // [FIX LOGIC] Cek apakah item adalah Object (Format Baru) atau String (Format Lama)
          const isObject = typeof item === "object" && item !== null;

          // Ambil URL dan Label sesuai formatnya
          const url = isObject ? item.url : item;
          const labelFromImg = isObject ? item.label || "" : "";

          // Prioritaskan label dari object gambar, jika kosong baru ambil dari array labels terpisah
          const finalLabel = labelFromImg || loadedLabels[idx] || "";

          return {
            id: `existing-${idx}-${Date.now()}`,
            preview: url, // Gunakan URL yang sudah diextract (String)
            originalUrl: url, // Gunakan URL yang sudah diextract (String)
            file: null,
            isExisting: true,
            label: finalLabel, // Gunakan Label yang sudah diextract
          };
        });
      }
      // Fallback untuk struktur data legacy (single image_url)
      else if (product.image_url) {
        initialItems = [
          {
            id: `existing-single-${Date.now()}`,
            preview: product.image_url,
            originalUrl: product.image_url,
            file: null,
            isExisting: true,
            label: loadedLabels[0] || "",
          },
        ];
      }

      setItems(initialItems);
    }
  }, [isOpen, product]);

  // --- HANDLER UPLOAD GAMBAR BARU ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newItems = selectedFiles.map((file) => ({
        id: `new-${file.name}-${Date.now()}-${Math.random()}`,
        file: file,
        preview: URL.createObjectURL(file),
        isExisting: false,
        label: file.name.split(".").slice(0, -1).join("."), // Auto label
      }));

      setItems((prev) => [...prev, ...newItems]);
    }
  };

  // --- DRAG END HANDLER ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleLabelChange = (id, newLabel) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item)));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alertError("Produk wajib memiliki minimal 1 gambar!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      // [FIX] Susun Metadata untuk Backend
      const metadata = items.map((item, index) => {
        if (item.isExisting) {
          // Jika gambar lama
          return {
            type: "existing",
            url: item.originalUrl, // URL asli dari DB
            label: item.label,
            order: index,
          };
        } else {
          // Jika gambar baru
          return {
            type: "new",
            label: item.label,
            order: index,
          };
        }
      });

      // Kirim metadata sebagai JSON string
      formData.append("images_metadata", JSON.stringify(metadata));

      // [FIX] Kirim File Gambar Baru
      // PENTING: Urutan append file harus sama dengan urutan item "new" di metadata
      items.forEach((item) => {
        if (!item.isExisting && item.file) {
          formData.append("images", item.file);
        }
      });

      // Panggil API
      const response = await productUpdate(token, product.id, formData);
      const responseBody = await response.json();

      if (response.ok) {
        await alertSuccess("Produk berhasil diupdate!");
        onSuccess();
        onClose();
      } else {
        alertError(responseBody.message || "Gagal update produk");
      }
    } catch (error) {
      console.error(error);
      alertError("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e5e0d8] flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-[#f1f0eb] flex justify-between items-center bg-[#fdfcf8] rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-[#3e362e]">Edit Produk</h2>
                <p className="text-sm text-[#8c8478]">Update foto, urutan & detail produk.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="editForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#3e362e] mb-1">Nama Produk</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] outline-none transition"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#3e362e] mb-1">Harga (Rp)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 focus:border-[#8da399] outline-none transition"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#3e362e] mb-1">Deskripsi</label>
                    <TextAreaAutosize
                      minRows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 resize-none focus:border-[#8da399] outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Area Gambar DND */}
                <div>
                  <label className="block text-sm font-bold text-[#3e362e] mb-3">
                    Galeri Produk (Drag untuk atur urutan)
                  </label>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {items.map((item, index) => (
                          <SortablePhoto
                            key={item.id}
                            id={item.id}
                            item={item}
                            index={index}
                            onRemove={removeItem}
                            onLabelChange={handleLabelChange}
                            onPreview={setPreviewUrl}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* UPLOAD BOX */}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-[#fdfcf8] p-4 rounded-xl border-2 border-dashed border-[#dcdcdc] hover:border-[#8da399] hover:bg-[#f4fcf7] transition-all duration-300 text-center group cursor-pointer">
                      <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
                        <div className="bg-[#e8f5e9] p-3 rounded-full text-[#2e7d32] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <span className="font-bold text-[#3e362e] text-sm group-hover:text-[#2e7d32] transition-colors">
                            Tambah Foto Lain
                          </span>
                          <p className="text-[10px] text-gray-400">Format: JPG, PNG (Max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#f1f0eb] bg-[#fdfcf8] rounded-b-2xl grid grid-cols-2 md:flex md:justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full md:w-auto px-5 py-2.5 rounded-lg border border-[#e5e0d8] text-[#3e362e] font-bold hover:bg-gray-50 transition text-center">
                Batal
              </button>
              <button
                type="submit"
                form="editForm"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-[#3e362e] text-white font-bold hover:bg-[#5a4e44] transition flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? <span className="animate-spin text-sm">⏳</span> : <Save size={18} className="shrink-0" />}
                <span className="whitespace-nowrap text-sm md:text-base">Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* PREVIEW IMAGE MODAL */}
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
    </>
  );
}

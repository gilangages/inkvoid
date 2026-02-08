import { useState } from "react";
import { Save, X, UploadCloud, GripVertical } from "lucide-react";
import { createProduct } from "../../../lib/api/ProductApi";
import { useLocalStorage } from "react-use";
import { alertError, alertSuccess } from "../../../lib/alert";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import TextAreaAutosize from "react-textarea-autosize";

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- KOMPONEN ITEM YANG BISA DI-SORT ---
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
      <div className="relative aspect-square overflow-hidden">
        <img src={item.preview} alt="preview" className="w-full h-full object-cover select-none" />

        {/* Overlay Grip & Controls */}
        <div className="absolute top-0 right-0 left-0 bg-black/50 p-1 flex justify-between items-center px-2 z-10">
          <div className="text-white text-[10px] bg-black/50 px-1.5 rounded">#{index + 1}</div>
          {/* Handle Drag (Area khusus untuk drag) */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded text-white">
            <GripVertical size={16} />
          </div>
        </div>

        {/* Klik area gambar untuk zoom preview */}
        <div onClick={() => onPreview(item.preview)} className="absolute inset-0 top-8 bg-transparent cursor-zoom-in" />
      </div>

      {/* Input Label & Controls */}
      <div className="p-2 bg-white flex flex-col gap-2">
        <input
          placeholder="Label (Ex: Tampak Depan)"
          className="w-full text-xs border border-gray-300 p-1.5 rounded focus:border-[#8da399] outline-none"
          value={item.label}
          onChange={(e) => onLabelChange(id, e.target.value)}
          // Penting: Stop propagation agar saat ngetik tidak dianggap mau nge-drag
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

export default function ProductForm() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- REFACTOR STATE (BEST PRACTICE) ---
  // Menggabungkan File dan Label dalam satu object array.
  // Struktur: { id: string, file: File, label: string, preview: string }
  const [items, setItems] = useState([]);

  // Setup Sensor untuk Dnd-Kit (PointerSensor support Mouse & Touch)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag baru aktif jika digeser sejauh 8px (mencegah klik tidak sengaja)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      const newItems = selectedFiles.map((file) => {
        // Generate unique ID sederhana
        const uniqueId = `${file.name}-${Date.now()}-${Math.random()}`;
        const nameWithoutExt = file.name.split(".").slice(0, -1).join(".");

        return {
          id: uniqueId,
          file: file,
          label: nameWithoutExt, // Auto-fill label
          preview: URL.createObjectURL(file), // Generate preview URL langsung
        };
      });

      setItems((prev) => [...prev, ...newItems]);
    }
  };

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (items.length === 0) {
      alertError("Minimal pilih 1 gambar produk!");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);

      // Append Images & Labels
      // Kita loop items yang sudah urut sesuai tampilan
      const finalLabels = [];

      items.forEach((item) => {
        formData.append("images", item.file);
        finalLabels.push(item.label || "");
      });

      formData.append("image_labels", JSON.stringify(finalLabels));

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

            <div>
              <label className="text-sm font-bold text-[#3e362e] flex justify-between items-center">
                Deskripsi
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Support Markdown: **tebal**, - list
                </span>
              </label>
              <TextAreaAutosize
                minRows={6} // Bikin lebih tinggi biar enak ngetik panjang
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-[#e5e0d8] rounded-lg p-3 mt-1 focus:border-[#8da399] outline-none resize-none transition-all font-mono text-sm"
                placeholder={`Jelaskan detail stiker...

Tips Menulis:
- Gunakan tanda minus (-) untuk bikin list
- Gunakan bintang dua (**teks**) untuk **tebal**
- Tekan Enter 2x untuk paragraf baru`}
              />
            </div>
          </div>

          {/* AREA GAMBAR DENGAN DND-KIT */}
          <div>
            <label className="text-sm font-bold text-[#3e362e] mb-3 block">
              Galeri Foto (Drag icon Grip untuk menyusun urutan)
            </label>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 animate-fade-in">
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

              {/* DragOverlay bisa ditambahkan disini jika ingin animasi drag lebih fancy,
                  tapi default SortableContext sudah cukup bagus untuk grid */}
            </DndContext>

            {/* Upload Box */}
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

      {/* PREVIEW MODAL */}
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

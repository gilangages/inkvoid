import Swal from "sweetalert2";

export const alertSuccess = async (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,

    iconColor: "#8da399", // Warna Ikon (Hijau Sage)
    background: "#fdfcf8", // Warna Kertas (Cream)
    color: "#3e362e",

    customClass: {
      popup: "rounded-xl border-2 border-[#e5e0d8]",
      confirmButton: "rounded-lg px-6",
      cancelButton: "rounded-lg px-6",
    },
  });
};

export const alertError = async (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Ups",
    text: message,

    iconColor: "#8da399", // Warna Ikon (Hijau Sage)
    background: "#fdfcf8", // Warna Kertas (Cream)
    color: "#3e362e",

    customClass: {
      popup: "rounded-xl border-2 border-[#e5e0d8]",
      confirmButton: "rounded-lg px-6",
      cancelButton: "rounded-lg px-6",
    },
  });
};

export const alertConfirm = async (message: string) => {
  const result = await Swal.fire({
    icon: "question",
    title: "Apakah kamu yakin?",
    text: message,
    showCancelButton: true,
    // === TEMA LUMASTORE ===
    confirmButtonColor: "#3e362e", // Warna Utama (Tinta)
    cancelButtonColor: "#d68c76", // Warna Aksen (Merah Bata Pudar)
    iconColor: "#8da399", // Warna Ikon (Hijau Sage)
    background: "#fdfcf8", // Warna Kertas (Cream)
    color: "#3e362e", // Warna Teks

    confirmButtonText: "Ya, Lanjutkan",
    cancelButtonText: "Batal",

    // Opsional: Bikin tombolnya agak bulat biar sama kayak card
    customClass: {
      popup: "rounded-xl border-2 border-[#e5e0d8]",
      confirmButton: "rounded-lg px-6",
      cancelButton: "rounded-lg px-6",
    },
  });
  return result.isConfirmed;
};

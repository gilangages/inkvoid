import Swal from "sweetalert2";

export const alertSuccess = async (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
  });
};

export const alertError = async (message) => {
  Swal.fire({
    icon: "error",
    title: "Ups",
    text: message,
  });
};

export const getAllProducts = async () => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

export const getAdminProducts = async (token) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/admin/list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const toggleProductStatus = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const createProduct = async (token, formData) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const productDelete = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};

export const productUpdate = async (token, id, formData) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const bulkDeleteProducts = async (token, ids) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products/bulk-delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ids }), // Mengirim array ID [1, 2, 3]
  });
};

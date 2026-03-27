export const visitStatsAdmin = async (token) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/visits/stats`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const visitStats = async () => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

// Ambil daftar pengunjung dengan pagination
export const getVisitorList = async (token, page = 1, limit = 10) => {
  return await fetch(
    `${import.meta.env.VITE_APP_PATH}/visits/list?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Hapus satu visitor
export const deleteVisitor = async (token, id) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/visits/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Hapus semua visitor
export const deleteAllVisitors = async (token) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/visits/all`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

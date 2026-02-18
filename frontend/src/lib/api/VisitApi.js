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

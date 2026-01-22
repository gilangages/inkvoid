export const getProducts = async () => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

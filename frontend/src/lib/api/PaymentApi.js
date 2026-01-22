export const purchaseProduct = async ({ product_id, customer_name, customer_email }) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/payment/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      product_id,
      customer_name,
      customer_email,
    }),
  });
};

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

export const getAllTransactions = async (token) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/payment/admin/transactions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const changeStatusPaymentByAdmin = async (token, { orderId, newStatus }) => {
  return await fetch(`${import.meta.env.VITE_APP_PATH}/payment/admin/transaction/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: newStatus,
    }),
  });
};

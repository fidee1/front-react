import apiClient from "./apiClient";

export const add_invoice = async (data) => {
  try {
    const response = await apiClient.post("/payments", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const get_invoices = async () => {
  try {
    const response = await apiClient.get("/payments/history");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

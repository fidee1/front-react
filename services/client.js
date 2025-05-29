import apiClient from "./apiClient";

export const get_clients = async () => {
  try {
    const response = await apiClient.get("/client");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

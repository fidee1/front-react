import apiClient from "./apiClient";

export const apply_application = async (data) => {
  try {
    const response = await apiClient.post("/applications", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const update_status_application = async (id, data) => {
  try {
    console.log("data ", data)
    const response = await apiClient.put(`/applications/${id}/status`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
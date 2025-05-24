import apiClient from "./apiClient";

export const get_freelancers = async () => {
  try {
    const response = await apiClient.get("/freelancers");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
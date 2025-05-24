import apiClient from "./apiClient";

export const add_project = async (data) => {
  try {
    const response = await apiClient.post("/projects", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const get_projects_client = async () => {
  try {
    const response = await apiClient.get("/myProjects");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

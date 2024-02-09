import api from './api';

const fetchProjects = async () => {
  try {
    const response = await api.get("/project");
    return response.data; // Return the projects data directly
  } catch (error) {
    throw error;
  }
};

const createProject = async (projectData) => {
  try {
    const response = await api.post("/project", projectData);
    return response.data; // Return the created project data
  } catch (error) {
    throw error;
  }
};

export { fetchProjects, createProject };

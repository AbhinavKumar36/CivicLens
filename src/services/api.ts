import axios from "axios";

// Create Axios instance pointing to our new local Express server
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-type": "application/json",
  },
});

export const api = {
  // COMPLAINTS (REPORTS)
  getComplaints: async () => {
    const response = await apiClient.get("/complaints");
    return response.data;
  },
  getComplaint: async (id: number) => {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },
  createComplaint: async (data: any) => {
    const response = await apiClient.post("/complaints", data);
    return response.data;
  },
  updateComplaintStatus: async (id: number, status: string) => {
    const response = await apiClient.patch(`/complaints/${id}?status=${status}`);
    return response.data;
  },
  
  // SERVICES
  getServices: async () => {
    return [];
  },
  
  // WORKERS
  getWorkers: async () => {
    const response = await apiClient.get("/workers");
    return response.data;
  },
  
  // EMERGENCIES
  getEmergencies: async () => {
    const response = await apiClient.get("/emergencies");
    return response.data;
  },
  createEmergency: async (data: any) => {
    const response = await apiClient.post("/emergencies", data);
    return response.data;
  },
  
  // DEPARTMENTS
  getDepartments: async () => {
    const response = await apiClient.get("/departments");
    return response.data;
  },
  
  // USERS
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  }
};

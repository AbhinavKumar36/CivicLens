import axios from "axios";
import { MOCK_REPORTS } from "../utils/mock-data";

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
    try {
      const response = await apiClient.get("/complaints");
      return response.data;
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock reports");
      return MOCK_REPORTS;
    }
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
    try {
      const response = await apiClient.get("/workers");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  // EMERGENCIES
  getEmergencies: async () => {
    try {
      const response = await apiClient.get("/emergencies");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  createEmergency: async (data: any) => {
    const response = await apiClient.post("/emergencies", data);
    return response.data;
  },
  
  // DEPARTMENTS
  getDepartments: async () => {
    try {
      const response = await apiClient.get("/departments");
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  // USERS
  getUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

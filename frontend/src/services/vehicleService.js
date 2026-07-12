import api from './api';

export const vehicleService = {
  // Get all vehicles
  getAllVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  // Search vehicles with optional parameters
  searchVehicles: async (params) => {
    // params could be { make: 'Toyota', minPrice: 10000 }
    const response = await api.get('/vehicles/search', { params });
    return response.data;
  },

  // Purchase a vehicle (decrease stock by 1)
  purchaseVehicle: async (id) => {
    const response = await api.post(`/vehicles/${id}/purchase`);
    return response.data;
  },

  // Add a new vehicle (Admin only)
  addVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  // Update a vehicle (Admin only)
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  // Delete a vehicle (Admin only)
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  // Restock a vehicle (Admin only)
  restockVehicle: async (id, quantity) => {
    const response = await api.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  }
};

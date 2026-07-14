import api from "./api";

export const purchaseService = {
  getUserPurchases: async () => {
    const response = await api.get("/purchases");
    return response.data;
  },
};

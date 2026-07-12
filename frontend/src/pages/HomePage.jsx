import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { vehicleService } from "../services/vehicleService";
import { VehicleList } from "../components/Vehicle/VehicleList";
import { VehicleSearch } from "../components/Vehicle/VehicleSearch";
import { toast } from "react-toastify";

export const HomePage = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = async (searchParams = {}) => {
    setIsLoading(true);
    try {
      // If there are search params, use the search endpoint, otherwise getAll
      let data;
      if (Object.keys(searchParams).length > 0) {
        data = await vehicleService.searchVehicles(searchParams);
      } else {
        data = await vehicleService.getAllVehicles();
      }
      setVehicles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vehicles from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load all vehicles on initial mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleUpdateVehicle = (updatedVehicle) => {
    // Replace the old vehicle data in the list with the newly updated one (e.g., after purchase)
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.id === updatedVehicle.id ? updatedVehicle : v,
      ),
    );
  };

  return (
    <div
      className="page-container"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px 0" }}>Car Dealership Inventory</h1>
          <p style={{ margin: 0, color: "#666" }}>
            Welcome back, <strong>{user?.username}</strong>!
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main>
        <VehicleSearch onSearch={fetchVehicles} />

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading inventory...
          </div>
        ) : (
          <VehicleList
            vehicles={vehicles}
            onUpdateVehicle={handleUpdateVehicle}
          />
        )}
      </main>
    </div>
  );
};

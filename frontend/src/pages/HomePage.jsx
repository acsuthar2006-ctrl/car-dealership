import React, { useState, useEffect } from "react";
import { vehicleService } from "../services/vehicleService";
import { VehicleList } from "../components/Vehicle/VehicleList";
import { VehicleSearch } from "../components/Vehicle/VehicleSearch";
import { Spinner } from "../components/UI/Spinner";
import { EmptyState } from "../components/UI/EmptyState";
import { toast } from "react-toastify";

export const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicles({});
  }, []);

  const fetchVehicles = async (searchParams) => {
    setIsLoading(true);
    try {
      const data = await vehicleService.searchVehicles(searchParams);
      setVehicles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load vehicles from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  return (
    <div className="page-container">
      <main>
        <VehicleSearch onSearch={fetchVehicles} />

        {isLoading ? (
          <Spinner message="Fetching inventory..." />
        ) : vehicles.length === 0 ? (
          <EmptyState
            message="No vehicles found"
            subMessage="Try adjusting your search filters to find what you're looking for."
          />
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

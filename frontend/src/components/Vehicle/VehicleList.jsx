import React from "react";
import { VehicleCard } from "./VehicleCard";
import "./Vehicle.css";

export const VehicleList = ({ vehicles, onUpdateVehicle }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
        <h3>No vehicles found.</h3>
        <p>Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="vehicle-list">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onUpdate={onUpdateVehicle}
        />
      ))}
    </div>
  );
};

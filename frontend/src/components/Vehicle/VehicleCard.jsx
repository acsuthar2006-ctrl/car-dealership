import React, { useState } from "react";
import { vehicleService } from "../../services/vehicleService";
import { toast } from "react-toastify";
import "./Vehicle.css";

export const VehicleCard = ({ vehicle, onUpdate }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const isOutOfStock = vehicle.quantityInStock <= 0;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const updatedVehicle = await vehicleService.purchaseVehicle(vehicle.id);
      toast.success(`Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      // Tell the parent component to update this vehicle in the list
      onUpdate(updatedVehicle);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        toast.error("Sorry, this vehicle is out of stock!");
      } else {
        toast.error("Failed to purchase vehicle.");
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.price);

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header">
        <h3>
          {vehicle.make} {vehicle.model}
        </h3>
        <span className="badge badge-default">{vehicle.category}</span>
      </div>
      
      <div className="price">{formattedPrice}</div>
      <div className="stock">
        {isOutOfStock ? (
          <span className="badge" style={{ backgroundColor: "#f3f4f6", color: "#6b7280", textDecoration: "line-through" }}>
            Out of Stock
          </span>
        ) : (
          <span className="badge" style={{ backgroundColor: "var(--success)", color: "white" }}>
            {vehicle.quantityInStock} in stock
          </span>
        )}
      </div>

      <button
        className="btn btn-purchase purchase-btn"
        onClick={handlePurchase}
        disabled={isOutOfStock || isPurchasing}
      >
        {isPurchasing ? "Processing..." : "Purchase Vehicle"}
      </button>
    </div>
  );
};

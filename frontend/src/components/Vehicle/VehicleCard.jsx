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
      <h3>
        {vehicle.make} {vehicle.model}
      </h3>
      <span className="category">{vehicle.category}</span>
      <div className="price">{formattedPrice}</div>
      <div className={`stock ${isOutOfStock ? "out-of-stock" : ""}`}>
        {isOutOfStock ? "Out of Stock" : `${vehicle.quantityInStock} in stock`}
      </div>

      <button
        className="purchase-btn"
        onClick={handlePurchase}
        disabled={isOutOfStock || isPurchasing}
      >
        {isPurchasing ? "Processing..." : "Purchase"}
      </button>
    </div>
  );
};

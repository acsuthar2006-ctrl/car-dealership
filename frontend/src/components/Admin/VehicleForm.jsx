import React, { useState, useEffect } from "react";
import { vehicleService } from "../../services/vehicleService";
import { toast } from "react-toastify";

export const VehicleForm = ({ vehicle, onClose, onSaved }) => {
  const isEditing = !!vehicle;
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    category: "",
    price: "",
    quantityInStock: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || "",
        model: vehicle.model || "",
        category: vehicle.category || "",
        price: vehicle.price || "",
        quantityInStock: vehicle.quantityInStock || "",
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const updated = await vehicleService.updateVehicle(
          vehicle.id,
          formData,
        );
        toast.success("Vehicle updated successfully!");
        onSaved(updated);
      } else {
        const created = await vehicleService.addVehicle(formData);
        toast.success("Vehicle added successfully!");
        onSaved(created);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${isEditing ? "update" : "add"} vehicle.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Make
            </label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="SUV">SUV</option>
              <option value="SEDAN">SEDAN</option>
              <option value="TRUCK">TRUCK</option>
              <option value="EV">EV</option>
              <option value="HATCHBACK">HATCHBACK</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                name="quantityInStock"
                value={formData.quantityInStock}
                onChange={handleChange}
                required
                disabled={isEditing}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: isEditing ? "#eee" : "white",
                }}
                title={
                  isEditing ? "Use the Restock button to change stock" : ""
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#e0e0e0",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

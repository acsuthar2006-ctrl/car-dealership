import React, { useState, useEffect } from "react";
import { vehicleService } from "../../services/vehicleService";
import { toast } from "react-toastify";
import "./VehicleForm.css";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {isEditing ? "Edit Vehicle" : "Add New Vehicle"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="" disabled>Select a category</option>
              <option value="SUV">SUV</option>
              <option value="SEDAN">SEDAN</option>
              <option value="TRUCK">TRUCK</option>
              <option value="EV">EV</option>
              <option value="HATCHBACK">HATCHBACK</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input
                type="number"
                min="0"
                name="quantityInStock"
                value={formData.quantityInStock}
                onChange={handleChange}
                required
                disabled={isEditing}
                className="input-field"
                style={{ backgroundColor: isEditing ? "var(--accent-light)" : "var(--surface-color)" }}
                title={isEditing ? "Use the Restock button to change stock" : ""}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

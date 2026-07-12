import React, { useState, useEffect } from "react";
import { vehicleService } from "../services/vehicleService";
import { VehicleForm } from "../components/Admin/VehicleForm";
import { Spinner } from "../components/UI/Spinner";
import { EmptyState } from "../components/UI/EmptyState";
import { toast } from "react-toastify";
import "./AdminPage.css";

export const AdminPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;

    try {
      await vehicleService.deleteVehicle(id);
      toast.success("Vehicle deleted successfully.");
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vehicle.");
    }
  };

  const handleRestockClick = async (id) => {
    const qtyStr = window.prompt("Enter quantity to add to stock:");
    if (!qtyStr) return;

    const quantity = parseInt(qtyStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid positive number.");
      return;
    }

    try {
      const updatedVehicle = await vehicleService.restockVehicle(id, quantity);
      toast.success("Restocked successfully!");
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? updatedVehicle : v)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to restock vehicle.");
    }
  };

  const handleFormSaved = (savedVehicle) => {
    setIsFormOpen(false);
    // If we were editing, replace the existing vehicle in the list.
    // If we were adding, append the new vehicle to the list.
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === savedVehicle.id ? savedVehicle : v)),
      );
    } else {
      setVehicles((prev) => [...prev, savedVehicle]);
    }
  };

  return (
    <div className="page-container">
      <main>
        <div className="admin-header">
          <h2 className="page-title">Inventory Management</h2>
          <button onClick={handleAddClick} className="btn btn-primary">
            + Add New Vehicle
          </button>
        </div>

        {isLoading ? (
          <Spinner message="Loading inventory data..." />
        ) : vehicles.length === 0 ? (
          <EmptyState
            message="Your inventory is empty"
            subMessage="Click the '+ Add New Vehicle' button above to start stocking your dealership."
          />
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th style={{ textAlign: "center" }}>Stock</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>
                      <span className="badge badge-default">
                        {vehicle.category}
                      </span>
                    </td>
                    <td>${vehicle.price.toFixed(2)}</td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontWeight: "600",
                          color: vehicle.quantityInStock > 0 ? "var(--success)" : "var(--danger)",
                        }}
                      >
                        {vehicle.quantityInStock}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestockClick(vehicle.id)}
                          className="btn btn-success"
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isFormOpen && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => setIsFormOpen(false)}
          onSaved={handleFormSaved}
        />
      )}
    </div>
  );
};

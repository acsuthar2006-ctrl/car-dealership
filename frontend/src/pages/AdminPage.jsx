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

  // Inline filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

  // Client-side filtering for instant feedback
  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q);
    const matchesCategory =
      !categoryFilter || v.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

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
          <div>
            <h1 className="page-title">ADMIN PANEL</h1>
            <p className="page-subtitle">{vehicles.length} vehicles in inventory</p>
          </div>
          <button onClick={handleAddClick} className="btn btn-primary">
            + Add Vehicle
          </button>
        </div>

        {/* ── Sleek Inline Filter Bar ── */}
        <div className="admin-filter-bar">
          <div className="filter-bar-search">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-bar-input"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-bar-select"
          >
            <option value="">All Categories</option>
            <option value="SUV">SUV</option>
            <option value="SEDAN">Sedan</option>
            <option value="TRUCK">Truck</option>
            <option value="EV">EV</option>
            <option value="HATCHBACK">Hatchback</option>
          </select>
        </div>

        {isLoading ? (
          <Spinner message="Loading inventory data..." />
        ) : filteredVehicles.length === 0 ? (
          <EmptyState
            message={vehicles.length === 0 ? "Your inventory is empty" : "No matching vehicles"}
            subMessage={vehicles.length === 0
              ? "Click '+ Add Vehicle' to start stocking your dealership."
              : "Try adjusting your search or category filter."
            }
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
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="td-bold">{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>
                      <span className="badge badge-default">
                        {vehicle.category}
                      </span>
                    </td>
                    <td>${vehicle.price.toFixed(2)}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`stock-badge ${vehicle.quantityInStock > 0 ? "stock-in" : "stock-out"}`}>
                        {vehicle.quantityInStock}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="btn btn-admin"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestockClick(vehicle.id)}
                          className="btn btn-admin"
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

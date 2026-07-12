import React, { useState, useEffect } from "react";
import { vehicleService } from "../services/vehicleService";
import { VehicleList } from "../components/Vehicle/VehicleList";
import { Spinner } from "../components/UI/Spinner";
import { EmptyState } from "../components/UI/EmptyState";
import { toast } from "react-toastify";
import "./HomePage.css";

export const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inline filter state for the sidebar
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanParams = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key].toString().trim() !== "") {
        cleanParams[key] = filters[key];
      }
    });
    fetchVehicles(cleanParams);
  };

  const handleClear = () => {
    setFilters({ make: "", model: "", category: "", minPrice: "", maxPrice: "" });
    fetchVehicles({});
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Dream Car</h1>
          <p className="hero-subtitle">Luxury Vehicles at Unbeatable Prices</p>
        </div>
      </div>
      <div className="page-container">
        <div className="storefront-layout">
          {/* ── Left Sidebar ── */}
          <aside className="filter-sidebar">
            <h3 className="filter-sidebar-title">Filters</h3>
            <form onSubmit={handleSearch}>
              <div className="filter-group">
                <label className="filter-label">Make</label>
                <input
                  type="text"
                  name="make"
                  value={filters.make}
                  onChange={handleFilterChange}
                  placeholder="e.g. Toyota"
                  className="input-field"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Model</label>
                <input
                  type="text"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                  placeholder="e.g. Camry"
                  className="input-field"
                />
              </div>

              <hr className="filter-divider" />

              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  <option value="SUV">SUV</option>
                  <option value="SEDAN">Sedan</option>
                  <option value="TRUCK">Truck</option>
                  <option value="EV">EV</option>
                  <option value="HATCHBACK">Hatchback</option>
                </select>
              </div>

              <hr className="filter-divider" />

              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <div className="price-range-row">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                    className="input-field"
                  />
                  <span className="price-range-sep">–</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button type="submit" className="btn btn-primary">
                  Apply Filters
                </button>
                <button type="button" onClick={handleClear} className="btn btn-secondary">
                  Clear All
                </button>
              </div>
            </form>
          </aside>

          {/* ── Right Content ── */}
          <section className="vehicle-grid-area">
            <div className="vehicle-grid-header">
              <p className="vehicle-count">
                {isLoading ? "Loading..." : `${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {isLoading ? (
              <Spinner message="Fetching inventory..." />
            ) : vehicles.length === 0 ? (
              <EmptyState
                message="No vehicles found"
                subMessage="Try adjusting your filters to find what you're looking for."
              />
            ) : (
              <VehicleList
                vehicles={vehicles}
                onUpdateVehicle={handleUpdateVehicle}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
};

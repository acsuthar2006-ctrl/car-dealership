import React, { useState } from "react";
import "./Vehicle.css";

export const VehicleSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean up empty strings so we don't send "?make=&model="
    const cleanParams = {};
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key].trim() !== "") {
        cleanParams[key] = searchParams[key];
      }
    });

    onSearch(cleanParams);
  };

  const handleClear = () => {
    setSearchParams({
      make: "",
      model: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    onSearch({}); // trigger search with no filters
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-group">
          <label className="search-label">Make</label>
          <input
            type="text"
            name="make"
            value={searchParams.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            className="input-field"
          />
        </div>

        <div className="search-group">
          <label className="search-label">Model</label>
          <input
            type="text"
            name="model"
            value={searchParams.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            className="input-field"
          />
        </div>

        <div className="search-group">
          <label className="search-label">Category</label>
          <input
            type="text"
            name="category"
            value={searchParams.category}
            onChange={handleChange}
            placeholder="e.g. Sedan"
            className="input-field"
          />
        </div>

        <div className="search-group">
          <label className="search-label">Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={searchParams.minPrice}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className="input-field"
          />
        </div>

        <div className="search-group">
          <label className="search-label">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={handleChange}
            placeholder="50000"
            min="0"
            className="input-field"
          />
        </div>

        <div className="search-actions">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={handleClear} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

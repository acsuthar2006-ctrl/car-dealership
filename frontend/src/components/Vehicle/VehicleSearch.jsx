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
    <div
      className="search-container"
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #ddd",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 150px",
          }}
        >
          <label
            style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
          >
            Make
          </label>
          <input
            type="text"
            name="make"
            value={searchParams.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 150px",
          }}
        >
          <label
            style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
          >
            Model
          </label>
          <input
            type="text"
            name="model"
            value={searchParams.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 150px",
          }}
        >
          <label
            style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            value={searchParams.category}
            onChange={handleChange}
            placeholder="e.g. Sedan"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 100px",
          }}
        >
          <label
            style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
          >
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={searchParams.minPrice}
            onChange={handleChange}
            placeholder="0"
            min="0"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 100px",
          }}
        >
          <label
            style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}
          >
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={searchParams.maxPrice}
            onChange={handleChange}
            placeholder="50000"
            min="0"
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", flex: "1 1 200px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
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
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

import React from "react";

export const EmptyState = ({ message, subMessage }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px dashed #ccc",
        textAlign: "center",
        marginTop: "20px"
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px", color: "#ccc" }}>
        🚗
      </div>
      <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{message}</h3>
      {subMessage && <p style={{ margin: 0, color: "#666" }}>{subMessage}</p>}
    </div>
  );
};

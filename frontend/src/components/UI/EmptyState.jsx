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
        backgroundColor: "var(--surface-color)",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-color)",
        textAlign: "center",
        marginTop: "20px"
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px", color: "var(--text-muted)" }}>
        🚗
      </div>
      <h3 style={{ margin: "0 0 8px 0", color: "var(--text-primary)" }}>{message}</h3>
      {subMessage && <p style={{ margin: 0, color: "var(--text-secondary)" }}>{subMessage}</p>}
    </div>
  );
};

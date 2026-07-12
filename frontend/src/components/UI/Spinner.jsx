import React from "react";
import "./Spinner.css";

export const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="spinner-container">
      <div className="spinner-circle"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

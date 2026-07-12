import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const Layout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

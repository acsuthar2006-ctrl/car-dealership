import React, { useState, useEffect } from "react";
import { purchaseService } from "../services/purchaseService";
import { Spinner } from "../components/UI/Spinner";
import { EmptyState } from "../components/UI/EmptyState";
import { toast } from "react-toastify";
import "./PurchasesPage.css";

export const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const data = await purchaseService.getUserPurchases();
      setPurchases(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your purchase history.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="purchases-page-container">
      <div className="purchases-hero">
        <h1 className="purchases-title">My Garage</h1>
        <p className="purchases-subtitle">A collection of your premium vehicles</p>
      </div>

      <div className="purchases-content">
        {isLoading ? (
          <Spinner message="Loading your garage..." />
        ) : purchases.length === 0 ? (
          <EmptyState
            message="Your garage is empty"
            subMessage="Head over to the storefront to find your dream car!"
          />
        ) : (
          <div className="purchases-grid">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-card-header">
                  <h3>{purchase.vehicleMake} {purchase.vehicleModel}</h3>
                  <span className="badge badge-default">{purchase.vehicleCategory}</span>
                </div>
                
                <div className="purchase-details">
                  <div className="purchase-price">{formatPrice(purchase.vehiclePrice)}</div>
                  <div className="purchase-status">
                    <span className={`status-badge status-${purchase.status.toLowerCase()}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>

                <div className="purchase-footer">
                  <span className="purchase-date">Purchased on {formatDate(purchase.purchaseDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

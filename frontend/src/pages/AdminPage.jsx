import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import { VehicleForm } from '../components/Admin/VehicleForm';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AdminPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

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
      toast.error('Failed to load inventory.');
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
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      await vehicleService.deleteVehicle(id);
      toast.success('Vehicle deleted successfully.');
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete vehicle.');
    }
  };

  const handleRestockClick = async (id) => {
    const qtyStr = window.prompt('Enter quantity to add to stock:');
    if (!qtyStr) return;
    
    const quantity = parseInt(qtyStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid positive number.');
      return;
    }

    try {
      const updatedVehicle = await vehicleService.restockVehicle(id, quantity);
      toast.success('Restocked successfully!');
      setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
    } catch (err) {
      console.error(err);
      toast.error('Failed to restock vehicle.');
    }
  };

  const handleFormSaved = (savedVehicle) => {
    setIsFormOpen(false);
    // If we were editing, replace the existing vehicle in the list.
    // If we were adding, append the new vehicle to the list.
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === savedVehicle.id ? savedVehicle : v));
    } else {
      setVehicles(prev => [...prev, savedVehicle]);
    }
  };

  return (
    <div className="page-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Admin Dashboard</h1>
          <p style={{ margin: 0, color: '#666' }}>Manage your dealership inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Storefront
          </button>
          <button 
            onClick={logout}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </header>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Inventory Management</h2>
          <button 
            onClick={handleAddClick}
            style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add New Vehicle
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading inventory...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Make</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Model</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{vehicle.make}</td>
                    <td style={{ padding: '12px' }}>{vehicle.model}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ backgroundColor: '#e3f2fd', color: '#1565c0', padding: '4px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {vehicle.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>${vehicle.price.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: vehicle.quantityInStock > 0 ? '#2e7d32' : '#d32f2f' }}>
                        {vehicle.quantityInStock}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button onClick={() => handleEditClick(vehicle)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleRestockClick(vehicle.id)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '4px', cursor: 'pointer' }}>Restock</button>
                      <button onClick={() => handleDeleteClick(vehicle.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No vehicles in inventory.</td>
                  </tr>
                )}
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

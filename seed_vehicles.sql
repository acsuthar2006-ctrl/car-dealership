INSERT INTO vehicles (id, make, model, category, price, quantity_in_stock) VALUES
('23bd210a-f744-48e5-927f-05725e0b7120', 'BMW', '330i', 'SEDAN', 44500.0, 3),
('c9043752-f54c-467e-a3b1-245b4ee7571a', 'Toyota', 'Camry', 'SEDAN', 25000.0, 5),
('9a9c0f61-c5a9-4419-ae65-9f117ea962c5', 'Honda', 'Civic', 'SEDAN', 23000.0, 8),
('29907970-20b0-482c-9aca-dc808021ff42', 'Ford', 'F-150', 'TRUCK', 35000.0, 3),
('2e478207-773f-4a90-863b-f794b1563882', 'BMW', 'X5', 'SUV', 55000.0, 2),
('8d9c04c0-04b5-4361-b11b-3f226b8cc103', 'Volkswagen', 'Golf', 'SEDAN', 22000.0, 9),
('0c98bf4f-8a93-4d62-a0c6-4e87fd1bcdc5', 'Mazda', 'CX-5', 'SUV', 28000.0, 7),
('d524350d-4f3f-4caa-95b9-50b244c37342', 'Jeep', 'Wrangler', 'SUV', 38000.0, 5),
('ad5d1e47-aadf-4881-b60d-1a275547ae2e', 'Audi', 'A4', 'SEDAN', 40000.0, 3),
('651d0935-9738-4486-9432-b28494f4c894', 'Chevrolet', 'Silverado', 'TRUCK', 32000.0, 6),
('ab7434e1-519e-439f-b10d-78adb739eb7f', 'Chevrolet', 'Silverado', 'TRUCK', 32000.0, 6)
ON CONFLICT (id) DO NOTHING;

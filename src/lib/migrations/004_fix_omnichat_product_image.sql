-- Replace the stale Omnichat upload URL with the matching repository asset.

UPDATE Products
SET ImageUrl = '/uploads/36b29f70-0efa-4b1b-a464-2c848e78197e.jpg'
WHERE Name = N'Omnichat AI'
  AND ImageUrl = '/api/uploads/20387b3e-cd20-4396-938d-67abfdf73c9d.jpg';

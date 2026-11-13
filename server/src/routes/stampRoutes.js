const express = require('express');
const router = express.Router();
const { stamps } = require('../data/mockData');

// GET /api/stamps - Retrieve all postage stamps
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: stamps.length,
    data: stamps,
  });
});

// GET /api/stamps/:id - Retrieve a single stamp by ID
router.get('/:id', (req, res) => {
  const stamp = stamps.find((item) => item.id === req.params.id);

  if (!stamp) {
    return res.status(404).json({
      success: false,
      message: `Stamp with ID '${req.params.id}' not found.`,
    });
  }

  res.status(200).json({
    success: true,
    data: stamp,
  });
});

// POST /api/stamps - Add a new postage stamp
router.post('/', (req, res) => {
  const { name, year, country, category, description, image } = req.body;

  // Validate required fields
  if (!name || !year || !country || !category || !description) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, year, country, category, and description.',
    });
  }

  const newStamp = {
    id: String(Date.now()),
    name: String(name).trim(),
    year: Number(year),
    country: String(country).trim(),
    category: String(category).trim(),
    description: String(description).trim(),
    image: image ? String(image).trim() : 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
  };

  stamps.push(newStamp);

  res.status(201).json({
    success: true,
    message: 'New stamp added successfully.',
    data: newStamp,
  });
});

// DELETE /api/stamps/:id - Delete a stamp by ID
router.delete('/:id', (req, res) => {
  const index = stamps.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Stamp with ID '${req.params.id}' not found.`,
    });
  }

  const [deletedStamp] = stamps.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'Stamp removed successfully.',
    data: deletedStamp,
  });
});

module.exports = router;

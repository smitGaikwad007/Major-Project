const express = require('express');
const router = express.Router();
const { collection, stamps } = require('../data/mockData');

// GET /api/collection - Retrieve all items in the user's collection
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: collection.length,
    data: collection,
  });
});

// POST /api/collection - Add a stamp item to the collection
router.post('/', (req, res) => {
  const { stampId, quantity, condition } = req.body;

  // Validate required fields
  if (!stampId || quantity === undefined || !condition) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: stampId, quantity, and condition.',
    });
  }

  // Verify that the referenced stamp exists in the catalog
  const stampExists = stamps.some((s) => s.id === String(stampId));
  if (!stampExists) {
    return res.status(404).json({
      success: false,
      message: `Referenced stamp with ID '${stampId}' does not exist in the stamps catalogue.`,
    });
  }

  const newItem = {
    id: `col_${Date.now()}`,
    stampId: String(stampId),
    quantity: Number(quantity) || 1,
    condition: String(condition).trim(),
  };

  collection.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Item added to collection successfully.',
    data: newItem,
  });
});

// DELETE /api/collection/:id - Remove an item from the collection
router.delete('/:id', (req, res) => {
  const index = collection.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Collection item with ID '${req.params.id}' not found.`,
    });
  }

  const [removedItem] = collection.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'Item removed from collection successfully.',
    data: removedItem,
  });
});

module.exports = router;

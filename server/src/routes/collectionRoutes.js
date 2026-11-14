const express = require('express');
const router = express.Router();
const prisma = require('../db/config');

router.get('/', async (req, res, next) => {
  try {
    const collection = await prisma.collectionItem.findMany({
      include: {
        stamp: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      count: collection.length,
      data: collection,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { stampId, quantity, condition } = req.body;

    if (!stampId || quantity === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: stampId, quantity, and condition.',
      });
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer.',
      });
    }

    const stamp = await prisma.stamp.findUnique({
      where: { id: String(stampId) },
    });

    if (!stamp) {
      return res.status(404).json({
        success: false,
        message: `Referenced stamp with ID '${stampId}' does not exist in the stamps catalogue.`,
      });
    }

    const newItem = await prisma.collectionItem.create({
      data: {
        stampId: String(stampId),
        quantity: parsedQuantity,
        condition: String(condition).trim(),
      },
      include: {
        stamp: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Item added to collection successfully.',
      data: newItem,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existingItem = await prisma.collectionItem.findUnique({
      where: { id: req.params.id },
    });

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: `Collection item with ID '${req.params.id}' not found.`,
      });
    }

    const removedItem = await prisma.collectionItem.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Item removed from collection successfully.',
      data: removedItem,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

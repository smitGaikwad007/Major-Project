const express = require('express');
const router = express.Router();
const prisma = require('../db/config');

router.get('/', async (req, res, next) => {
  try {
    const stamps = await prisma.stamp.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return res.status(200).json({
      success: true,
      count: stamps.length,
      data: stamps,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const stamp = await prisma.stamp.findUnique({
      where: { id: req.params.id },
    });

    if (!stamp) {
      return res.status(404).json({
        success: false,
        message: `Stamp with ID '${req.params.id}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: stamp,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, year, country, category, description, image } = req.body;

    if (!name || !year || !country || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, year, country, category, and description.',
      });
    }

    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid number.',
      });
    }

    const newStamp = await prisma.stamp.create({
      data: {
        name: String(name).trim(),
        year: parsedYear,
        country: String(country).trim(),
        category: String(category).trim(),
        description: String(description).trim(),
        image: image ? String(image).trim() : 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'New stamp added successfully.',
      data: newStamp,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const existingStamp = await prisma.stamp.findUnique({
      where: { id: req.params.id },
    });

    if (!existingStamp) {
      return res.status(404).json({
        success: false,
        message: `Stamp with ID '${req.params.id}' not found.`,
      });
    }

    const deletedStamp = await prisma.stamp.delete({
      where: { id: req.params.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Stamp removed successfully.',
      data: deletedStamp,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

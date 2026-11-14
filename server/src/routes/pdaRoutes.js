const express = require('express');
const router = express.Router();
const prisma = require('../db/config');

const WEIGHTS = [8, 6, 4, 2, 3, 5, 9, 7];

function calculateChecksum(digitsString) {
  const digits = String(digitsString).replace(/\D/g, '').slice(0, 8).padStart(8, '0');
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += Number(digits[i]) * WEIGHTS[i];
  }
  const remainder = sum % 11;
  let check = 11 - remainder;
  if (check === 10) check = 0;
  if (check === 11) check = 5;
  return check;
}

function verifyChecksum(fullNumber) {
  const clean = String(fullNumber).replace(/\D/g, '');
  if (clean.length < 9) return false;
  const base = clean.slice(0, 8);
  const givenCheck = Number(clean.slice(8, 9));
  return calculateChecksum(base) === givenCheck;
}

function formatPdaAccount(acc) {
  return {
    id: acc.id,
    accountNumber: acc.accountNumber,
    holderName: acc.holderName,
    postalCircle: acc.postalCircle,
    balance: parseFloat(Number(acc.balance).toFixed(2)),
    standingOrders: {
      mintStamps: acc.mintStamps,
      firstDayCovers: acc.firstDayCovers,
      miniatureSheets: acc.miniatureSheets,
    },
    createdAt: acc.createdAt,
  };
}

router.get('/accounts', async (req, res, next) => {
  try {
    let accounts = await prisma.pdaApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (accounts.length === 0) {
      await prisma.seedDatabase();
      accounts = await prisma.pdaApplication.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.status(200).json({
      success: true,
      totalAccounts: accounts.length,
      data: accounts.map(formatPdaAccount),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/open', async (req, res, next) => {
  try {
    const { holderName, postalCircle, initialDeposit, standingOrders } = req.body;

    if (!holderName) {
      return res.status(400).json({
        success: false,
        message: 'Collector name is required.',
      });
    }

    const baseSeq = String(Math.floor(10000000 + Math.random() * 89999999));
    const check = calculateChecksum(baseSeq);
    const circleCode = (postalCircle || 'MH').slice(0, 2).toUpperCase();
    const accountNumber = `PDA-${circleCode}-${baseSeq}-${check}`;
    const standing = standingOrders || {};
    const deposit = Math.max(0, parseFloat(initialDeposit) || 1000).toFixed(2);

    const newAccount = await prisma.pdaApplication.create({
      data: {
        accountNumber,
        holderName: String(holderName).trim(),
        postalCircle: postalCircle || 'Maharashtra Circle',
        balance: deposit,
        mintStamps: standing.mintStamps !== undefined ? Boolean(standing.mintStamps) : true,
        firstDayCovers: standing.firstDayCovers !== undefined ? Boolean(standing.firstDayCovers) : true,
        miniatureSheets: standing.miniatureSheets !== undefined ? Boolean(standing.miniatureSheets) : false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Deposit account created successfully with Modulo-11 checksum.',
      data: formatPdaAccount(newAccount),
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/verify', (req, res) => {
  const { serialNumber } = req.body;
  if (!serialNumber) {
    return res.status(400).json({ success: false, message: 'Serial number is required.' });
  }

  const isValid = verifyChecksum(serialNumber);

  return res.status(200).json({
    success: true,
    serialNumber,
    isValid,
    algorithm: 'India Post Weighted Modulo-11',
  });
});

module.exports = router;

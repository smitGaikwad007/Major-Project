const express = require('express');
const router = express.Router();

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

let pdaAccounts = [
  {
    accountNumber: 'PDA-MH-12345678-5',
    holderName: 'Dr. Anandita Sen',
    postalCircle: 'Maharashtra Circle (Mumbai GPO)',
    balance: 8450,
    standingOrders: {
      mintStamps: true,
      firstDayCovers: true,
      miniatureSheets: true
    }
  },
  {
    accountNumber: 'PDA-WB-87654321-4',
    holderName: 'Prof. Debabrata Roy',
    postalCircle: 'West Bengal Circle (Kolkata GPO)',
    balance: 14200,
    standingOrders: {
      mintStamps: true,
      firstDayCovers: true,
      miniatureSheets: false
    }
  }
];

router.get('/accounts', (req, res) => {
  res.status(200).json({
    success: true,
    totalAccounts: pdaAccounts.length,
    data: pdaAccounts
  });
});

router.post('/open', (req, res) => {
  const { holderName, postalCircle, initialDeposit, standingOrders } = req.body;

  if (!holderName) {
    return res.status(400).json({
      success: false,
      message: 'Collector name is required.'
    });
  }

  const baseSeq = String(Math.floor(10000000 + Math.random() * 89999999));
  const check = calculateChecksum(baseSeq);
  const circleCode = (postalCircle || 'MH').slice(0, 2).toUpperCase();
  const accountNumber = `PDA-${circleCode}-${baseSeq}-${check}`;

  const newAccount = {
    accountNumber,
    holderName: String(holderName).trim(),
    postalCircle: postalCircle || 'Maharashtra Circle',
    balance: Number(initialDeposit) || 1000,
    standingOrders: standingOrders || {
      mintStamps: true,
      firstDayCovers: true,
      miniatureSheets: false
    }
  };

  pdaAccounts.unshift(newAccount);

  res.status(201).json({
    success: true,
    message: 'Deposit account created successfully with Modulo-11 checksum.',
    data: newAccount
  });
});

router.post('/verify', (req, res) => {
  const { serialNumber } = req.body;
  if (!serialNumber) {
    return res.status(400).json({ success: false, message: 'Serial number is required.' });
  }

  const isValid = verifyChecksum(serialNumber);

  res.status(200).json({
    success: true,
    serialNumber,
    isValid,
    algorithm: 'India Post Weighted Modulo-11'
  });
});

module.exports = router;

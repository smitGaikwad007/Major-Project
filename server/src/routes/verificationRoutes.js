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

function fairAllotment(totalApplicants, totalStamps, seed = 7) {
  const n = Math.max(1, Math.floor(Number(totalApplicants) || 1));
  const k = Math.min(n, Math.max(1, Math.floor(Number(totalStamps) || 1)));
  const prime = 17;
  const winners = [];
  const seen = new Set();
  let step = 0;
  while (winners.length < k && step < n * 10) {
    const winnerId = ((Number(seed) + step * prime) % n) + 1;
    if (!seen.has(winnerId)) {
      seen.add(winnerId);
      winners.push(winnerId);
    }
    step++;
  }
  return winners;
}

router.post('/check-stamp', (req, res) => {
  const { serial } = req.body;
  if (!serial) {
    return res.status(400).json({ success: false, message: 'Stamp serial is required.' });
  }

  const isValid = verifyChecksum(serial);
  res.status(200).json({
    success: true,
    serial,
    isValid,
    formula: 'Sum(digit_i * weight_i) mod 11'
  });
});

router.post('/fair-drop', (req, res) => {
  const { applicants, stamps, seed } = req.body;
  const winners = fairAllotment(applicants, stamps, seed);

  res.status(200).json({
    success: true,
    totalApplicants: Number(applicants) || 1,
    totalStamps: Number(stamps) || 1,
    winners
  });
});

module.exports = router;

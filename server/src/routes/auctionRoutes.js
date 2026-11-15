const express = require('express');
const router = express.Router();
const prisma = require('../db/config');

// In-Memory fallback store with realistic archival seed auctions
const inMemoryAuctions = [
  {
    id: "auc-1",
    title: "1854 Inverted Head Four Annas (Lithographic Error Rarity)",
    description: "Monumental world philatelic rarity printed at Surveyor General's Office in Calcutta. Showing Queen Victoria's head inverted inside the octagonal frame. Full margins, Cooper Diamond 1 postmark.",
    sellerId: "user-1",
    sellerName: "Sardar Jasjit Singh",
    sellerEmail: "jasjit@philatelysociety.in",
    startingPrice: 250000,
    minIncrement: 5000,
    currentBid: 310000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // ~26 hours left (LIVE)
    status: "ACTIVE",
    category: "Classic British India",
    condition: "Good Used, Octagonal Cut",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Ferrary Collection, Royal Philatelic Society London Cert #9842.",
    certificate: "RPSL Certificate #9842 (Grade AAA)",
    bids: [
      {
        id: "bid-1",
        auctionId: "auc-1",
        bidderId: "user-101",
        bidderName: "Dr. Anandita Sen",
        bidderEmail: "anandita@mumbai.pda",
        amount: 260000,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-2",
        auctionId: "auc-1",
        bidderId: "user-102",
        bidderName: "Collector #4891",
        bidderEmail: "collector4891@guild.in",
        amount: 275000,
        createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-3",
        auctionId: "auc-1",
        bidderId: "user-103",
        bidderName: "Vikramaditya Singhal",
        bidderEmail: "vikram@singhaltrust.org",
        amount: 295000,
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-4",
        auctionId: "auc-1",
        bidderId: "user-104",
        bidderName: "Prof. Debabrata Roy",
        bidderEmail: "roy@bengal.pda",
        amount: 310000,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "auc-2",
    title: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE' Overprint",
    description: "Seminal post-independence memorial gem. One of only 200 copies overprinted 'SERVICE' for the Secretariat of C. Rajagopalachari, first Indian Governor-General. Original gum, very fine light hinge.",
    sellerId: "user-2",
    sellerName: "Dr. Arvind Swaminathan",
    sellerEmail: "arvind@kolkataguild.in",
    startingPrice: 120000,
    minIncrement: 2500,
    currentBid: 135000,
    startTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 52 * 60 * 60 * 1000).toISOString(), // ~52 hours left (LIVE)
    status: "ACTIVE",
    category: "Republic of India",
    condition: "Very Fine Mint Light Hinge",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    provenance: "Governor General Archives (Rashtrapati Bhavan 1948).",
    certificate: "BPA Certificate #14802",
    bids: [
      {
        id: "bid-5",
        auctionId: "auc-2",
        bidderId: "user-201",
        bidderName: "Meera Krishnan",
        bidderEmail: "meera@southindia.in",
        amount: 125000,
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-6",
        auctionId: "auc-2",
        bidderId: "user-202",
        bidderName: "Rajeshwar Rao",
        bidderEmail: "rao@hyderabad.pda",
        amount: 135000,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "auc-3",
    title: "1852 Scinde Dawk Scarlet Wafer (Embossed Red Sealing Wax)",
    description: "Asia's first adhesive postage stamp. Circular red wafer embossed with the East India Company Merchants' Mark, issued under Sir Bartle Frere in the province of Sindh.",
    sellerId: "user-3",
    sellerName: "Heritage Philatelic Trust",
    sellerEmail: "heritage@dakbhavan.in",
    startingPrice: 450000,
    minIncrement: 10000,
    currentBid: null,
    startTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // Starts in ~18 hours (UPCOMING)
    endTime: new Date(Date.now() + 90 * 60 * 60 * 1000).toISOString(),
    status: "ACTIVE",
    category: "Pre-Imperial India",
    condition: "Fine Embossed Seal",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Bartle Frere Estate, private vault London & New Delhi.",
    certificate: "National Philatelic Bureau Certificate #NB-1852-S",
    bids: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "auc-4",
    title: "1911 First Aerial Post Allahabad to Naini Confluence Flown Cover",
    description: "Historic postal envelope carried by French aviator Henri Pequet aboard a Humber-Sommer biplane on 18 February 1911. Complete with magenta aerial cancel over Yamuna confluence.",
    sellerId: "user-4",
    sellerName: "Captain Devashish Bose",
    sellerEmail: "devashish@bose.org",
    startingPrice: 75000,
    minIncrement: 2000,
    currentBid: 98000,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Ended 4 hours ago (ENDED)
    status: "ENDED",
    category: "Aerophilately",
    condition: "Historical Postal Cover",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Bose Family Trust, auctioned at Stanley Gibbons (1984).",
    certificate: "BPA Certificate #4891",
    winnerId: "user-104",
    winnerName: "Prof. Debabrata Roy",
    bids: [
      {
        id: "bid-7",
        auctionId: "auc-4",
        bidderId: "user-301",
        bidderName: "Virendra Malviya",
        bidderEmail: "malviya@jaipur.in",
        amount: 80000,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-8",
        auctionId: "auc-4",
        bidderId: "user-302",
        bidderName: "Ananya Deshmukh",
        bidderEmail: "ananya@pune.in",
        amount: 88000,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-9",
        auctionId: "auc-4",
        bidderId: "user-104",
        bidderName: "Prof. Debabrata Roy",
        bidderEmail: "roy@bengal.pda",
        amount: 98000,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "auc-5",
    title: "1866 Travancore State ½ Chuckram 'Shankha' Sheet Margin Strip",
    description: "Rare indigenous Anchel post classic from Trivandrum mint. Printed on native unwatermarked handmade laid paper depicting sacred Conch Shell.",
    sellerId: "user-5",
    sellerName: "Prof. K. R. Namboodiri",
    sellerEmail: "namboodiri@kerala.in",
    startingPrice: 180000,
    minIncrement: 5000,
    currentBid: null,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ended yesterday with 0 bids (ENDED / UNSOLD)
    status: "ENDED",
    category: "Princely States",
    condition: "MNH Sheet Margin Strip",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    provenance: "Travancore Royal Anchel Archives.",
    certificate: "South India Philatelic Circle #SIPC-1866",
    winnerId: null,
    winnerName: null,
    bids: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper: Calculate auction lifecycle status & metadata strictly server-side
function formatAuctionResponse(rawAuction, now = new Date()) {
  const start = new Date(rawAuction.startTime);
  const end = new Date(rawAuction.endTime);
  const bids = rawAuction.bids || [];

  // Sort bids chronologically desc
  const sortedBids = [...bids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const highestBid = sortedBids.length > 0 ? sortedBids[0] : null;

  const currentHighestBid = highestBid ? Number(highestBid.amount) : null;
  const startingPrice = Number(rawAuction.startingPrice);
  const minIncrement = Number(rawAuction.minIncrement) || 500;

  // Next required bid
  const minNextBid = currentHighestBid !== null
    ? currentHighestBid + minIncrement
    : startingPrice;

  // Determine server-side lifecycle status
  let lifecycleStatus = 'LIVE';
  let isUpcoming = false;
  let isLive = false;
  let isEnded = false;

  if (now < start) {
    lifecycleStatus = 'UPCOMING';
    isUpcoming = true;
  } else if (now >= end) {
    lifecycleStatus = 'ENDED';
    isEnded = true;
  } else {
    lifecycleStatus = 'LIVE';
    isLive = true;
  }

  // Determine winner when ended
  let winner = null;
  if (isEnded) {
    if (highestBid) {
      winner = {
        bidderId: highestBid.bidderId,
        bidderName: highestBid.bidderName,
        amount: Number(highestBid.amount),
        wonAt: highestBid.createdAt,
      };
    }
  }

  const timeRemainingMs = Math.max(0, end.getTime() - now.getTime());
  const timeUntilStartMs = Math.max(0, start.getTime() - now.getTime());

  return {
    ...rawAuction,
    startingPrice,
    minIncrement,
    currentBid: currentHighestBid,
    minNextBid,
    bidCount: sortedBids.length,
    highestBidder: highestBid ? highestBid.bidderName : null,
    lifecycleStatus,
    isUpcoming,
    isLive,
    isEnded,
    timeRemainingMs,
    timeUntilStartMs,
    winner,
    bids: sortedBids,
  };
}

// GET /api/auctions
router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const { status, category, search } = req.query;

    let auctions = [];

    // Attempt PostgreSQL Prisma read if available
    try {
      if (prisma && prisma.auction) {
        const dbAuctions = await prisma.auction.findMany({
          include: {
            bids: {
              orderBy: { amount: 'desc' },
            },
            stamp: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbAuctions && dbAuctions.length > 0) {
          auctions = dbAuctions;
        }
      }
    } catch (dbErr) {
      // Fallback seamlessly to in-memory store
    }

    if (auctions.length === 0) {
      auctions = inMemoryAuctions;
    }

    // Format all auctions with server-side time evaluations
    let formatted = auctions.map((a) => formatAuctionResponse(a, now));

    // Filter by status if specified ('live', 'upcoming', 'ended')
    if (status && status !== 'all') {
      const targetStatus = String(status).toUpperCase();
      formatted = formatted.filter((a) => a.lifecycleStatus === targetStatus);
    }

    // Filter by category
    if (category && category !== 'all') {
      formatted = formatted.filter((a) => (a.category || '').toLowerCase() === category.toLowerCase());
    }

    // Filter by search query
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      formatted = formatted.filter((a) =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.sellerName || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      serverTime: now.toISOString(),
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/auctions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const now = new Date();
    const { id } = req.params;

    let auction = null;

    // Attempt Prisma fetch
    try {
      if (prisma && prisma.auction) {
        const dbAuction = await prisma.auction.findUnique({
          where: { id },
          include: {
            bids: {
              orderBy: { createdAt: 'desc' },
            },
            stamp: true,
          },
        });
        if (dbAuction) auction = dbAuction;
      }
    } catch (dbErr) {
      // Fallback to in-memory
    }

    if (!auction) {
      auction = inMemoryAuctions.find((a) => a.id === id);
    }

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: `Auction listing with ID '${id}' not found.`,
      });
    }

    const formatted = formatAuctionResponse(auction, now);

    return res.status(200).json({
      success: true,
      serverTime: now.toISOString(),
      data: formatted,
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/auctions - Create a new auction listing
router.post('/', async (req, res, next) => {
  try {
    const now = new Date();
    const {
      title,
      description,
      stampId,
      startingPrice,
      minIncrement,
      startTime,
      endTime,
      sellerName,
      sellerEmail,
      category,
      condition,
      image,
      provenance,
      certificate,
    } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Auction title is required.',
      });
    }

    if (!sellerName || !sellerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Seller name / identity is required.',
      });
    }

    const parsedStartingPrice = Number(startingPrice);
    if (isNaN(parsedStartingPrice) || parsedStartingPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Starting price must be a positive number greater than 0.',
      });
    }

    const parsedMinIncrement = minIncrement !== undefined ? Number(minIncrement) : 500;
    if (isNaN(parsedMinIncrement) || parsedMinIncrement <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimum bid increment must be a positive number greater than 0.',
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Both auction start time and end time are required.',
      });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided for auction start or end time.',
      });
    }

    if (endDate.getTime() <= startDate.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'Auction end time must be after auction start time.',
      });
    }

    const auctionData = {
      id: `auc-${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : null,
      stampId: stampId ? String(stampId) : null,
      sellerName: sellerName.trim(),
      sellerEmail: sellerEmail ? sellerEmail.trim() : null,
      startingPrice: parsedStartingPrice,
      minIncrement: parsedMinIncrement,
      currentBid: null,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status: 'ACTIVE',
      category: category ? category.trim() : 'Commemorative Issue',
      condition: condition ? condition.trim() : 'Mint Never Hinged',
      image: image ? image.trim() : 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
      provenance: provenance ? provenance.trim() : 'Private Collector Archive',
      certificate: certificate ? certificate.trim() : 'PCI Guild Verified Genuine',
      bids: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // Attempt Prisma insert
    let savedAuction = null;
    try {
      if (prisma && prisma.auction) {
        savedAuction = await prisma.auction.create({
          data: {
            ...auctionData,
            startingPrice: parsedStartingPrice,
            minIncrement: parsedMinIncrement,
            startTime: startDate,
            endTime: endDate,
          },
          include: { bids: true },
        });
      }
    } catch (dbErr) {
      // In-memory fallback
    }

    if (!savedAuction) {
      inMemoryAuctions.unshift(auctionData);
      savedAuction = auctionData;
    }

    const formatted = formatAuctionResponse(savedAuction, now);

    return res.status(201).json({
      success: true,
      message: 'Auction listing successfully created and cataloged.',
      data: formatted,
    });
  } catch (error) {
    return next(error);
  }
});

// POST /api/auctions/:id/bids - Place a bid on an active auction
router.post('/:id/bids', async (req, res, next) => {
  try {
    const now = new Date();
    const { id } = req.params;
    const { amount, bidderName, bidderEmail, bidderId } = req.body;

    // Input Validation
    if (!bidderName || !bidderName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Bidder name / member identity is required to place an official bid.',
      });
    }

    const bidAmount = Number(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be a positive number.',
      });
    }

    // Retrieve target auction
    let targetAuction = null;
    let isPrisma = false;

    try {
      if (prisma && prisma.auction) {
        const dbAuction = await prisma.auction.findUnique({
          where: { id },
          include: {
            bids: { orderBy: { amount: 'desc' } },
          },
        });
        if (dbAuction) {
          targetAuction = dbAuction;
          isPrisma = true;
        }
      }
    } catch (err) {
      // In-memory fallback
    }

    if (!targetAuction) {
      targetAuction = inMemoryAuctions.find((a) => a.id === id);
    }

    if (!targetAuction) {
      return res.status(404).json({
        success: false,
        message: `Auction with ID '${id}' does not exist.`,
      });
    }

    const startTime = new Date(targetAuction.startTime);
    const endTime = new Date(targetAuction.endTime);

    // 1. Check if auction has started (Server-side time check)
    if (now < startTime) {
      return res.status(400).json({
        success: false,
        message: `This auction has not started yet. Bidding opens on ${startTime.toLocaleString('en-IN')}.`,
      });
    }

    // 2. Check if auction has concluded (Server-side time check)
    if (now >= endTime) {
      return res.status(400).json({
        success: false,
        message: `This auction has ended on ${endTime.toLocaleString('en-IN')}. No further bids are accepted.`,
      });
    }

    // 3. Prevent bidding on one's own listing (Anti-shill bidding policy)
    const normalizedBidderName = bidderName.trim().toLowerCase();
    const normalizedSellerName = (targetAuction.sellerName || '').trim().toLowerCase();
    if (normalizedBidderName === normalizedSellerName) {
      return res.status(403).json({
        success: false,
        message: 'Auction sellers are strictly prohibited from bidding on their own listings.',
      });
    }

    if (bidderEmail && targetAuction.sellerEmail) {
      if (bidderEmail.trim().toLowerCase() === targetAuction.sellerEmail.trim().toLowerCase()) {
        return res.status(403).json({
          success: false,
          message: 'Auction sellers are strictly prohibited from bidding on their own listings.',
        });
      }
    }

    if (bidderId && targetAuction.sellerId && String(bidderId) === String(targetAuction.sellerId)) {
      return res.status(403).json({
        success: false,
        message: 'Auction sellers are strictly prohibited from bidding on their own listings.',
      });
    }

    // 4. Validate bid amount against starting price and required increment
    const bids = targetAuction.bids || [];
    const currentHighestAmount = bids.length > 0
      ? Math.max(...bids.map((b) => Number(b.amount)))
      : (targetAuction.currentBid ? Number(targetAuction.currentBid) : null);

    const startingPrice = Number(targetAuction.startingPrice);
    const minIncrement = Number(targetAuction.minIncrement) || 500;

    let requiredMinBid = startingPrice;
    if (currentHighestAmount !== null) {
      requiredMinBid = currentHighestAmount + minIncrement;
    }

    if (bidAmount < requiredMinBid) {
      return res.status(400).json({
        success: false,
        message: `Your bid of ₹${bidAmount.toLocaleString('en-IN')} is lower than the minimum required bid of ₹${requiredMinBid.toLocaleString('en-IN')} (Current highest: ₹${(currentHighestAmount || startingPrice).toLocaleString('en-IN')} + Increment: ₹${minIncrement.toLocaleString('en-IN')}).`,
        currentBid: currentHighestAmount,
        minNextBid: requiredMinBid,
      });
    }

    // 5. Concurrency Safe Execution
    const newBidData = {
      id: `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      auctionId: id,
      bidderId: bidderId ? String(bidderId) : null,
      bidderName: bidderName.trim(),
      bidderEmail: bidderEmail ? bidderEmail.trim() : null,
      amount: bidAmount,
      createdAt: now.toISOString(),
    };

    if (isPrisma) {
      try {
        await prisma.$transaction(async (tx) => {
          // Re-verify highest bid inside transaction to prevent race conditions
          const latestHighest = await tx.bid.findFirst({
            where: { auctionId: id },
            orderBy: { amount: 'desc' },
          });

          const currentAmt = latestHighest ? Number(latestHighest.amount) : null;
          const freshMin = currentAmt !== null ? currentAmt + minIncrement : startingPrice;

          if (bidAmount < freshMin) {
            throw new Error(`Another bid of ₹${currentAmt.toLocaleString('en-IN')} was placed concurrently. New minimum bid is ₹${freshMin.toLocaleString('en-IN')}.`);
          }

          // Create bid
          await tx.bid.create({
            data: {
              id: newBidData.id,
              auctionId: id,
              bidderId: newBidData.bidderId,
              bidderName: newBidData.bidderName,
              bidderEmail: newBidData.bidderEmail,
              amount: bidAmount,
              createdAt: now,
            },
          });

          // Update auction current bid
          await tx.auction.update({
            where: { id },
            data: {
              currentBid: bidAmount,
              updatedAt: now,
            },
          });
        });
      } catch (txErr) {
        return res.status(400).json({
          success: false,
          message: txErr.message || 'Concurrent bid conflict occurred. Please retry your bid.',
        });
      }
    } else {
      // In-Memory atomic update
      const currentAmt = targetAuction.bids.length > 0
        ? Math.max(...targetAuction.bids.map((b) => Number(b.amount)))
        : (targetAuction.currentBid ? Number(targetAuction.currentBid) : null);
      const freshMin = currentAmt !== null ? currentAmt + minIncrement : startingPrice;

      if (bidAmount < freshMin) {
        return res.status(400).json({
          success: false,
          message: `Another bid of ₹${currentAmt.toLocaleString('en-IN')} was placed concurrently. New minimum bid is ₹${freshMin.toLocaleString('en-IN')}.`,
        });
      }

      targetAuction.bids.unshift(newBidData);
      targetAuction.currentBid = bidAmount;
      targetAuction.updatedAt = now.toISOString();
    }

    // Reload formatted auction
    const updatedFormatted = formatAuctionResponse(targetAuction, now);

    return res.status(201).json({
      success: true,
      message: `Congratulations! Your bid of ₹${bidAmount.toLocaleString('en-IN')} has been officially accepted as the highest active bid.`,
      data: {
        bid: newBidData,
        auction: updatedFormatted,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

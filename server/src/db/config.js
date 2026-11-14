const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

const initialStamps = [
  {
    id: '1',
    name: '1852 Scinde Dawk Scarlet Wafer',
    year: 1852,
    country: 'India (Sindh Province)',
    category: 'Pre-Imperial India',
    description: "Asia's first adhesive postage stamp, embossed into brittle red sealing wafers under Sir Bartle Frere.",
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: '1854 Inverted Head Four Annas',
    year: 1854,
    country: 'British India',
    category: 'Classic British India',
    description: "Famous lithographic error printed at Calcutta showing Queen Victoria's head inverted inside an octagonal frame.",
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: '1947 Jai Hind 3½ Annas Tiranga Flag',
    year: 1947,
    country: 'Republic of India',
    category: 'Independence Issue',
    description: 'Post-independence inaugural commemorative stamp depicting the Indian National Tricolour with Jai Hind inscription.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE'",
    year: 1948,
    country: 'Republic of India',
    category: 'Memorial Series',
    description: "Rare memorial issue overprinted 'SERVICE' for the Governor-General of India, world renowned rarity.",
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: '1975 Royal Bengal Tiger Wildlife Series',
    year: 1975,
    country: 'Republic of India',
    category: 'Wildlife Conservation',
    description: 'Conservation commemorative celebrating Project Tiger and indigenous wildlife preservation in India.',
    image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
  },
];

const initialPdaAccounts = [
  {
    accountNumber: 'PDA-MH-12345678-5',
    holderName: 'Dr. Anandita Sen',
    postalCircle: 'Maharashtra Circle (Mumbai GPO)',
    balance: '8450.00',
    mintStamps: true,
    firstDayCovers: true,
    miniatureSheets: true,
  },
  {
    accountNumber: 'PDA-WB-87654321-4',
    holderName: 'Prof. Debabrata Roy',
    postalCircle: 'West Bengal Circle (Kolkata GPO)',
    balance: '14200.00',
    mintStamps: true,
    firstDayCovers: true,
    miniatureSheets: false,
  },
];

async function seedDatabase() {
  for (const stamp of initialStamps) {
    await prisma.stamp.upsert({
      where: { id: stamp.id },
      update: {},
      create: stamp,
    });
  }

  const collectionCount = await prisma.collectionItem.count();
  if (collectionCount === 0) {
    await prisma.collectionItem.create({
      data: {
        stampId: '1',
        quantity: 1,
        condition: 'Fine Used',
      },
    });
    await prisma.collectionItem.create({
      data: {
        stampId: '3',
        quantity: 2,
        condition: 'Mint Never Hinged',
      },
    });
  }

  for (const acc of initialPdaAccounts) {
    await prisma.pdaApplication.upsert({
      where: { accountNumber: acc.accountNumber },
      update: {},
      create: acc,
    });
  }
}

prisma.seedDatabase = seedDatabase;
prisma.prisma = prisma;

module.exports = prisma;

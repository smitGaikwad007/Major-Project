const app = require('./src/app');
const prisma = require('./src/db/config');

async function runTests() {
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`Test server running at ${baseUrl}`);

  try {
    await prisma.seedDatabase();

    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    if (healthJson.status !== 'ok') throw new Error('Health check failed');
    console.log('PASS: Health check');

    const stampsRes = await fetch(`${baseUrl}/api/stamps`);
    const stampsJson = await stampsRes.json();
    if (!stampsJson.success || !Array.isArray(stampsJson.data) || stampsJson.count < 5) {
      throw new Error('GET /api/stamps failed');
    }
    console.log(`PASS: GET /api/stamps (found ${stampsJson.count} stamps)`);

    const stampId = stampsJson.data[0].id;
    const singleStampRes = await fetch(`${baseUrl}/api/stamps/${stampId}`);
    const singleStampJson = await singleStampRes.json();
    if (!singleStampJson.success || singleStampJson.data.id !== stampId) {
      throw new Error('GET /api/stamps/:id failed');
    }
    console.log(`PASS: GET /api/stamps/:id for ID ${stampId}`);

    const newStampRes = await fetch(`${baseUrl}/api/stamps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '1911 First Aerial Post Allahabad',
        year: 1911,
        country: 'British India',
        category: 'Aviation History',
        description: 'World first official airmail flight from Allahabad to Naini.',
      }),
    });
    const newStampJson = await newStampRes.json();
    if (!newStampJson.success || !newStampJson.data.id) {
      throw new Error('POST /api/stamps failed');
    }
    const createdStampId = newStampJson.data.id;
    console.log(`PASS: POST /api/stamps created stamp ${createdStampId}`);

    const deleteStampRes = await fetch(`${baseUrl}/api/stamps/${createdStampId}`, {
      method: 'DELETE',
    });
    const deleteStampJson = await deleteStampRes.json();
    if (!deleteStampJson.success) {
      throw new Error('DELETE /api/stamps/:id failed');
    }
    console.log(`PASS: DELETE /api/stamps/:id deleted stamp ${createdStampId}`);

    const collectionRes = await fetch(`${baseUrl}/api/collection`);
    const collectionJson = await collectionRes.json();
    if (!collectionJson.success || !Array.isArray(collectionJson.data)) {
      throw new Error('GET /api/collection failed');
    }
    console.log(`PASS: GET /api/collection (found ${collectionJson.count} items)`);

    const newColRes = await fetch(`${baseUrl}/api/collection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stampId: '2',
        quantity: 1,
        condition: 'Very Fine Used',
      }),
    });
    const newColJson = await newColRes.json();
    if (!newColJson.success || !newColJson.data.id) {
      throw new Error('POST /api/collection failed');
    }
    const createdColId = newColJson.data.id;
    console.log(`PASS: POST /api/collection created item ${createdColId}`);

    const deleteColRes = await fetch(`${baseUrl}/api/collection/${createdColId}`, {
      method: 'DELETE',
    });
    const deleteColJson = await deleteColRes.json();
    if (!deleteColJson.success) {
      throw new Error('DELETE /api/collection/:id failed');
    }
    console.log(`PASS: DELETE /api/collection/:id removed item ${createdColId}`);

    const pdaAccountsRes = await fetch(`${baseUrl}/api/pda/accounts`);
    const pdaAccountsJson = await pdaAccountsRes.json();
    if (!pdaAccountsJson.success || pdaAccountsJson.totalAccounts < 2) {
      throw new Error('GET /api/pda/accounts failed');
    }
    console.log(`PASS: GET /api/pda/accounts (found ${pdaAccountsJson.totalAccounts} accounts)`);

    const openPdaRes = await fetch(`${baseUrl}/api/pda/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        holderName: 'Kavita Nair',
        postalCircle: 'Tamil Nadu Circle (Chennai GPO)',
        initialDeposit: 5000,
        standingOrders: {
          mintStamps: true,
          firstDayCovers: true,
          miniatureSheets: true,
        },
      }),
    });
    const openPdaJson = await openPdaRes.json();
    if (!openPdaJson.success || !openPdaJson.data.accountNumber) {
      throw new Error('POST /api/pda/open failed');
    }
    const createdPdaAccount = openPdaJson.data.accountNumber;
    console.log(`PASS: POST /api/pda/open created account ${createdPdaAccount}`);

    const verifyPdaRes = await fetch(`${baseUrl}/api/pda/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber: createdPdaAccount,
      }),
    });
    const verifyPdaJson = await verifyPdaRes.json();
    if (!verifyPdaJson.success || !verifyPdaJson.isValid) {
      throw new Error('POST /api/pda/verify failed');
    }
    console.log(`PASS: POST /api/pda/verify checksum validated for ${createdPdaAccount}`);

    const checkStampRes = await fetch(`${baseUrl}/api/verification/check-stamp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serial: '123456785',
      }),
    });
    const checkStampJson = await checkStampRes.json();
    if (!checkStampJson.success || !checkStampJson.isValid) {
      throw new Error('POST /api/verification/check-stamp failed');
    }
    console.log('PASS: POST /api/verification/check-stamp validated Modulo-11 checksum');

    const fairDropRes = await fetch(`${baseUrl}/api/verification/fair-drop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicants: 10,
        stamps: 3,
        seed: 7,
      }),
    });
    const fairDropJson = await fairDropRes.json();
    if (!fairDropJson.success || fairDropJson.winners.length !== 3) {
      throw new Error('POST /api/verification/fair-drop failed');
    }
    console.log(`PASS: POST /api/verification/fair-drop allotted to winners: ${fairDropJson.winners.join(', ')}`);

    const allocationsRes = await fetch(`${baseUrl}/api/verification/allocations`);
    const allocationsJson = await allocationsRes.json();
    if (!allocationsJson.success || allocationsJson.count < 3) {
      throw new Error('GET /api/verification/allocations failed');
    }
    console.log(`PASS: GET /api/verification/allocations retrieved ${allocationsJson.count} persistent records`);

    console.log('\nAll tests passed successfully!');
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

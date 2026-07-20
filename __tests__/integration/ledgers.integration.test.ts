import { ObjectId } from 'mongodb';
import { connect, disconnect, collection, mockRes } from './helpers/testDb';
import * as ledgersController from '../../controllers/ledgers';

// Hits the real StoreTest MongoDB Atlas database (MONGODB_URI_TEST). Exercises
// the stock-decrement / over-quantity-rejection / SoldBy logic that was fixed
// in controllers/ledgers.ts against an actual persisted product, not a mock.
describe('ledgers controller (integration)', () => {
  let productId: ObjectId;
  const createdLedgerIds: any[] = [];
  const STARTING_STOCK = 10;

  beforeAll(async () => {
    await connect();
    const { insertedId } = await collection('Products').insertOne({
      ProductName: 'Integration Ledger Product',
      Description: 'd',
      Category: 'Test',
      Price: 5,
      Stock: STARTING_STOCK,
    });
    productId = insertedId;
  });

  beforeEach(async () => {
    // Reset the product to a known stock level before every test so each one is independent.
    await collection('Products').updateOne({ _id: productId }, { $set: { Stock: STARTING_STOCK } });
  });

  afterEach(async () => {
    if (createdLedgerIds.length) {
      await collection('Ledgers').deleteMany({ _id: { $in: createdLedgerIds.splice(0) } });
    }
  });

  afterAll(async () => {
    await collection('Products').deleteOne({ _id: productId });
    await disconnect();
  });

  function baseLedgerBody(overrides: Record<string, any> = {}) {
    return {
      ProductID: productId.toString(),
      ProductName: 'Integration Ledger Product',
      Description: 'd',
      Category: 'Test',
      CoGS: 1,
      Quantity: 3,
      Price: 5,
      TotalPrice: 15,
      DateOfPurchase: '2026-07-15',
      ...overrides,
    };
  }

  test('createLedger decrements the real product stock and records SoldBy', async () => {
    const userId = new ObjectId().toString();
    const req: any = { user: { id: userId }, body: baseLedgerBody() };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(201);
    createdLedgerIds.push(res.body.insertedId);

    const product = await collection('Products').findOne({ _id: productId });
    expect(product!.Stock).toBe(STARTING_STOCK - 3);

    const ledger = await collection('Ledgers').findOne({ _id: res.body.insertedId });
    expect(ledger!.SoldBy).toBe(userId);
  });

  test('createLedger rejects a sale that exceeds real available stock', async () => {
    const req: any = { user: { id: new ObjectId().toString() }, body: baseLedgerBody({ Quantity: STARTING_STOCK + 1 }) };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(400);
    const product = await collection('Products').findOne({ _id: productId });
    expect(product!.Stock).toBe(STARTING_STOCK);
  });

  test('updateLedger adjusts real stock by the quantity delta', async () => {
    const userId = new ObjectId().toString();
    const createReq: any = { user: { id: userId }, body: baseLedgerBody({ Quantity: 4 }) };
    const createRes = mockRes();
    await ledgersController.createLedger(createReq, createRes);
    createdLedgerIds.push(createRes.body.insertedId);

    const updateReq: any = {
      params: { id: String(createRes.body.insertedId) },
      body: baseLedgerBody({ Quantity: 6 }), // +2 more than the original sale
    };
    const updateRes = mockRes();
    await ledgersController.updateLedger(updateReq, updateRes);

    expect(updateRes.statusCode).toBe(200);
    const product = await collection('Products').findOne({ _id: productId });
    expect(product!.Stock).toBe(STARTING_STOCK - 6);
  });
});

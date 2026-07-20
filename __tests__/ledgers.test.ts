import { ObjectId } from 'mongodb';
import { installMockDb, mockRes } from './helpers/mockDb';

describe('ledgers controller', () => {
  let db: ReturnType<typeof installMockDb>;
  let ledgersController: typeof import('../controllers/ledgers');
  let userId: string;

  beforeEach(() => {
    jest.resetModules();
    db = installMockDb();
    ledgersController = require('../controllers/ledgers');
    userId = new ObjectId().toString();
  });

  function baseLedgerBody(overrides: Record<string, any> = {}) {
    return {
      ProductName: 'Widget',
      Description: 'd',
      Category: 'c',
      CoGS: 1,
      Quantity: 4,
      Price: 5,
      TotalPrice: 20,
      DateOfPurchase: '2026-07-15',
      ...overrides,
    };
  }

  test('createLedger decrements product stock and records SoldBy', async () => {
    const { insertedId: productId } = await db.getCollection('Products').insertOne({ ProductName: 'Widget', Stock: 10 });
    const req: any = { user: { id: userId }, body: baseLedgerBody({ ProductID: productId.toString() }) };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(201);
    const product = await db.getCollection('Products').findOne({ _id: productId });
    expect(product.Stock).toBe(6);
    const [ledger] = [...db.collections.Ledgers.store.values()];
    expect(ledger.SoldBy).toBe(userId);
  });

  test('createLedger rejects a sale that exceeds available stock', async () => {
    const { insertedId: productId } = await db.getCollection('Products').insertOne({ ProductName: 'Widget', Stock: 2 });
    const req: any = { user: { id: userId }, body: baseLedgerBody({ ProductID: productId.toString(), Quantity: 999 }) };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(400);
    const product = await db.getCollection('Products').findOne({ _id: productId });
    expect(product.Stock).toBe(2);
  });

  test('createLedger 404s when the referenced product does not exist', async () => {
    const req: any = { user: { id: userId }, body: baseLedgerBody({ ProductID: new ObjectId().toString() }) };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(404);
  });

  test('createLedger rejects missing required fields', async () => {
    const req: any = { user: { id: userId }, body: { ProductName: 'Widget' } };
    const res = mockRes();

    await ledgersController.createLedger(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('updateLedger adjusts stock by the quantity delta (increase)', async () => {
    const { insertedId: productId } = await db.getCollection('Products').insertOne({ ProductName: 'Widget', Stock: 10 });
    const { insertedId: ledgerId } = await db.getCollection('Ledgers').insertOne(
      { ...baseLedgerBody({ ProductID: productId.toString() }), SoldBy: userId }
    );
    await db.getCollection('Products').updateOne({ _id: productId }, { $inc: { Stock: -4 } }); // simulate the original sale

    const req: any = {
      params: { id: String(ledgerId) },
      body: baseLedgerBody({ ProductID: productId.toString(), Quantity: 6 }), // +2 more than before
    };
    const res = mockRes();

    await ledgersController.updateLedger(req, res);

    expect(res.statusCode).toBe(200);
    const product = await db.getCollection('Products').findOne({ _id: productId });
    expect(product.Stock).toBe(4); // 6 - 2
  });

  test('updateLedger restocks the product when quantity decreases', async () => {
    const { insertedId: productId } = await db.getCollection('Products').insertOne({ ProductName: 'Widget', Stock: 4 });
    const { insertedId: ledgerId } = await db.getCollection('Ledgers').insertOne(
      { ...baseLedgerBody({ ProductID: productId.toString(), Quantity: 6 }), SoldBy: userId }
    );

    const req: any = {
      params: { id: String(ledgerId) },
      body: baseLedgerBody({ ProductID: productId.toString(), Quantity: 1 }), // restock 5
    };
    const res = mockRes();

    await ledgersController.updateLedger(req, res);

    expect(res.statusCode).toBe(200);
    const product = await db.getCollection('Products').findOne({ _id: productId });
    expect(product.Stock).toBe(9); // 4 + 5

    const updatedLedger = await db.getCollection('Ledgers').findOne({ _id: ledgerId });
    expect(updatedLedger.SoldBy).toBe(userId); // preserved, not overwritten by the update payload
  });

  test('updateLedger moving a sale to a different product restocks the old one and decrements the new one', async () => {
    const { insertedId: oldProductId } = await db.getCollection('Products').insertOne({ ProductName: 'Old', Stock: 0 });
    const { insertedId: newProductId } = await db.getCollection('Products').insertOne({ ProductName: 'New', Stock: 10 });
    const { insertedId: ledgerId } = await db.getCollection('Ledgers').insertOne(
      { ...baseLedgerBody({ ProductID: oldProductId.toString(), Quantity: 4 }), SoldBy: userId }
    );

    const req: any = {
      params: { id: String(ledgerId) },
      body: baseLedgerBody({ ProductID: newProductId.toString(), Quantity: 3 }),
    };
    const res = mockRes();

    await ledgersController.updateLedger(req, res);

    expect(res.statusCode).toBe(200);
    const oldProduct = await db.getCollection('Products').findOne({ _id: oldProductId });
    const newProduct = await db.getCollection('Products').findOne({ _id: newProductId });
    expect(oldProduct.Stock).toBe(4); // fully restocked
    expect(newProduct.Stock).toBe(7); // 10 - 3
  });

  test('updateLedger 404s for a non-existent ledger entry', async () => {
    const req: any = {
      params: { id: String(new ObjectId()) },
      body: baseLedgerBody({ ProductID: String(new ObjectId()) }),
    };
    const res = mockRes();

    await ledgersController.updateLedger(req, res);

    expect(res.statusCode).toBe(404);
  });

  test('deleteLedger removes an existing ledger entry', async () => {
    const { insertedId: ledgerId } = await db.getCollection('Ledgers').insertOne(baseLedgerBody({ ProductID: 'x' }));
    const res = mockRes();

    await ledgersController.deleteLedger({ params: { id: String(ledgerId) } } as any, res);

    expect(res.statusCode).toBe(200);
    expect(db.collections.Ledgers.store.has(String(ledgerId))).toBe(false);
  });
});

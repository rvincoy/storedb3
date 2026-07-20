import { installMockDb, mockRes } from './helpers/mockDb';

// NOTE: as of this writing controllers/returns.ts still uses a Product-shaped
// schema (ProductName/Description/Category/Price/Stock) rather than the
// planned Returns schema (LedgerID/QuantityReturned/Reason/RefundAmount/...).
// These tests cover the CRUD behavior as currently implemented; they'll need
// updating once the real Returns schema/restock/profit-reversal logic lands.
describe('returns controller', () => {
  let db: ReturnType<typeof installMockDb>;
  let returnsController: typeof import('../controllers/returns');

  beforeEach(() => {
    jest.resetModules();
    db = installMockDb();
    returnsController = require('../controllers/returns');
  });

  test('createReturn rejects missing required fields', async () => {
    const req: any = { body: { ProductName: 'Widget' } };
    const res = mockRes();

    await returnsController.createReturn(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('createReturn rejects non-numeric Price/Stock', async () => {
    const req: any = {
      body: { ProductName: 'Widget', Description: 'd', Category: 'c', Price: '5', Stock: 1 },
    };
    const res = mockRes();

    await returnsController.createReturn(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('createReturn stores a valid entry', async () => {
    const req: any = {
      body: { ProductName: 'Widget', Description: 'd', Category: 'c', Price: 5, Stock: 1 },
    };
    const res = mockRes();

    await returnsController.createReturn(req, res);

    expect(res.statusCode).toBe(201);
    expect(db.collections.Returns.store.size).toBe(1);
  });

  test('getAll returns every stored entry', async () => {
    await db.getCollection('Returns').insertOne({ ProductName: 'A', Price: 1, Stock: 1 });
    const res = mockRes();

    await returnsController.getAll({} as any, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test('updateReturn replaces an existing entry', async () => {
    const { insertedId } = await db.getCollection('Returns').insertOne({ ProductName: 'A', Description: 'd', Category: 'c', Price: 1, Stock: 1 });
    const req: any = {
      params: { id: String(insertedId) },
      body: { ProductName: 'A-updated', Description: 'd', Category: 'c', Price: 2, Stock: 5 },
    };
    const res = mockRes();

    await returnsController.updateReturn(req, res);

    expect(res.statusCode).toBe(200);
    const stored = db.collections.Returns.store.get(String(insertedId));
    expect(stored.ProductName).toBe('A-updated');
  });

  test('deleteReturn removes an existing entry', async () => {
    const { insertedId } = await db.getCollection('Returns').insertOne({ ProductName: 'A', Price: 1, Stock: 1 });
    const res = mockRes();

    await returnsController.deleteReturn({ params: { id: String(insertedId) } } as any, res);

    expect(res.statusCode).toBe(200);
    expect(db.collections.Returns.store.has(String(insertedId))).toBe(false);
  });
});

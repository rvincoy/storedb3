import { connect, disconnect, collection, mockRes } from './helpers/testDb';
import * as returnsController from '../../controllers/returns';

// Hits the real StoreTest MongoDB Atlas database (MONGODB_URI_TEST).
// NOTE: controllers/returns.ts still uses a Product-shaped schema rather than
// the planned Returns schema (LedgerID/QuantityReturned/RefundAmount/...) -
// these tests cover the CRUD behavior as currently implemented.
describe('returns controller (integration)', () => {
  const createdIds: any[] = [];

  beforeAll(() => connect());

  afterEach(async () => {
    if (createdIds.length) {
      await collection('Returns').deleteMany({ _id: { $in: createdIds.splice(0) } });
    }
  });

  afterAll(() => disconnect());

  test('createReturn persists a real document', async () => {
    const req: any = {
      body: {
        ProductName: 'Integration Return',
        Description: 'd',
        Category: 'Test',
        Price: 5,
        Stock: 1,
      },
    };
    const res = mockRes();

    await returnsController.createReturn(req, res);

    expect(res.statusCode).toBe(201);
    createdIds.push(res.body.insertedId);

    const stored = await collection('Returns').findOne({ _id: res.body.insertedId });
    expect(stored!.ProductName).toBe('Integration Return');
  });

  test('deleteReturn removes a real document', async () => {
    const { insertedId } = await collection('Returns').insertOne({
      ProductName: 'Delete Me',
      Description: 'd',
      Category: 'Test',
      Price: 1,
      Stock: 1,
    });

    const res = mockRes();
    await returnsController.deleteReturn({ params: { id: String(insertedId) } } as any, res);

    expect(res.statusCode).toBe(200);
    const stored = await collection('Returns').findOne({ _id: insertedId });
    expect(stored).toBeNull();
  });
});

import { connect, disconnect, collection, mockRes } from './helpers/testDb';
import * as productsController from '../../controllers/products';

// Hits the real StoreTest MongoDB Atlas database (MONGODB_URI_TEST). Every
// document created here is tracked and deleted afterward so the shared test
// database is left clean for the rest of the team.
describe('products controller (integration)', () => {
  const createdIds: any[] = [];

  beforeAll(() => connect());

  afterEach(async () => {
    if (createdIds.length) {
      await collection('Products').deleteMany({ _id: { $in: createdIds.splice(0) } });
    }
  });

  afterAll(() => disconnect());

  test('createProduct persists a real document', async () => {
    const req: any = {
      body: {
        ProductName: 'Integration Test Widget',
        Description: 'Created by the integration suite',
        Category: 'Test',
        Price: 9.99,
        Stock: 5,
      },
    };
    const res = mockRes();

    await productsController.createProduct(req, res);

    expect(res.statusCode).toBe(201);
    createdIds.push(res.body.insertedId);

    const stored = await collection('Products').findOne({ _id: res.body.insertedId });
    expect(stored!.ProductName).toBe('Integration Test Widget');
    expect(stored!.Stock).toBe(5);
  });

  test('getSingle retrieves a real document by id', async () => {
    const { insertedId } = await collection('Products').insertOne({
      ProductName: 'Fetch Me',
      Description: 'd',
      Category: 'Test',
      Price: 1,
      Stock: 1,
    });
    createdIds.push(insertedId);

    const res = mockRes();
    await productsController.getSingle({ params: { id: String(insertedId) } } as any, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.ProductName).toBe('Fetch Me');
  });

  test('updateProduct replaces a real document', async () => {
    const { insertedId } = await collection('Products').insertOne({
      ProductName: 'Before',
      Description: 'd',
      Category: 'Test',
      Price: 1,
      Stock: 1,
    });
    createdIds.push(insertedId);

    const req: any = {
      params: { id: String(insertedId) },
      body: { ProductName: 'After', Description: 'd', Category: 'Test', Price: 2, Stock: 9 },
    };
    const res = mockRes();

    await productsController.updateProduct(req, res);

    expect(res.statusCode).toBe(200);
    const stored = await collection('Products').findOne({ _id: insertedId });
    expect(stored!.ProductName).toBe('After');
    expect(stored!.Stock).toBe(9);
  });

  test('deleteProduct removes a real document', async () => {
    const { insertedId } = await collection('Products').insertOne({
      ProductName: 'Delete Me',
      Description: 'd',
      Category: 'Test',
      Price: 1,
      Stock: 1,
    });

    const res = mockRes();
    await productsController.deleteProduct({ params: { id: String(insertedId) } } as any, res);

    expect(res.statusCode).toBe(200);
    const stored = await collection('Products').findOne({ _id: insertedId });
    expect(stored).toBeNull();
  });
});

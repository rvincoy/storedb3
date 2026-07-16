const { installMockDb, mockRes } = require('./helpers/mockDb');

describe('products controller', () => {
  let db;
  let productsController;

  beforeEach(() => {
    jest.resetModules();
    db = installMockDb();
    productsController = require('../controllers/products');
  });

  test('createProduct rejects when required fields are missing', async () => {
    const req = { body: { ProductName: 'Widget' } };
    const res = mockRes();

    await productsController.createProduct(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('createProduct rejects non-numeric Price/Stock', async () => {
    const req = {
      body: {
        ProductName: 'Widget',
        Description: 'd',
        Category: 'c',
        Price: '9.99',
        Stock: 10,
      },
    };
    const res = mockRes();

    await productsController.createProduct(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('createProduct stores a valid product', async () => {
    const req = {
      body: {
        ProductName: 'Widget',
        Description: 'd',
        Category: 'c',
        Price: 9.99,
        Stock: 10,
      },
    };
    const res = mockRes();

    await productsController.createProduct(req, res);

    expect(res.statusCode).toBe(201);
    expect(db.collections.Products.store.size).toBe(1);
  });

  test('getAll returns every stored product', async () => {
    await db.getCollection('Products').insertOne({ ProductName: 'A', Price: 1, Stock: 1 });
    await db.getCollection('Products').insertOne({ ProductName: 'B', Price: 2, Stock: 2 });
    const res = mockRes();

    await productsController.getAll({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('getSingle returns the matching product', async () => {
    const { insertedId } = await db.getCollection('Products').insertOne({ ProductName: 'A', Price: 1, Stock: 1 });
    const res = mockRes();

    await productsController.getSingle({ params: { id: String(insertedId) } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.ProductName).toBe('A');
  });

  test('updateProduct replaces an existing product', async () => {
    const { insertedId } = await db.getCollection('Products').insertOne({ ProductName: 'A', Description: 'd', Category: 'c', Price: 1, Stock: 1 });
    const req = {
      params: { id: String(insertedId) },
      body: { ProductName: 'A-updated', Description: 'd', Category: 'c', Price: 5, Stock: 20 },
    };
    const res = mockRes();

    await productsController.updateProduct(req, res);

    expect(res.statusCode).toBe(200);
    const stored = db.collections.Products.store.get(String(insertedId));
    expect(stored.ProductName).toBe('A-updated');
    expect(stored.Stock).toBe(20);
  });

  test('deleteProduct removes an existing product', async () => {
    const { insertedId } = await db.getCollection('Products').insertOne({ ProductName: 'A', Price: 1, Stock: 1 });
    const res = mockRes();

    await productsController.deleteProduct({ params: { id: String(insertedId) } }, res);

    expect(res.statusCode).toBe(200);
    expect(db.collections.Products.store.has(String(insertedId))).toBe(false);
  });
});

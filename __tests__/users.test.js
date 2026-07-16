const { ObjectId } = require('mongodb');
const { installMockDb, mockRes } = require('./helpers/mockDb');

describe('users controller', () => {
  let db;
  let usersController;

  beforeEach(() => {
    jest.resetModules();
    db = installMockDb();
    usersController = require('../controllers/users');
  });

  test('createUser rejects missing required fields', async () => {
    const req = { body: { UserName: 'jdoe' } };
    const res = mockRes();

    await usersController.createUser(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('createUser stores a valid user', async () => {
    const req = {
      body: { UserName: 'jdoe', DisplayName: 'John Doe', email: 'j@example.com', Role: 'staff' },
    };
    const res = mockRes();

    await usersController.createUser(req, res);

    expect(res.statusCode).toBe(201);
    expect(db.collections.Users.store.size).toBe(1);
  });

  test('getAll returns every stored user', async () => {
    await db.getCollection('Users').insertOne({ UserName: 'a', Role: 'staff' });
    await db.getCollection('Users').insertOne({ UserName: 'b', Role: 'admin' });
    const res = mockRes();

    await usersController.getAll({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('getSingle 404s for a non-existent user', async () => {
    const res = mockRes();

    await usersController.getSingle({ params: { id: String(new ObjectId()) } }, res);

    expect(res.statusCode).toBe(404);
  });

  test('updateUserRole rejects an invalid role', async () => {
    const { insertedId } = await db.getCollection('Users').insertOne({ UserName: 'a', Role: 'staff' });
    const req = { params: { id: String(insertedId) }, body: { Role: 'owner' } };
    const res = mockRes();

    await usersController.updateUserRole(req, res);

    expect(res.statusCode).toBe(400);
  });

  test('updateUserRole promotes a user to admin', async () => {
    const { insertedId } = await db.getCollection('Users').insertOne({ UserName: 'a', Role: 'staff' });
    const req = { params: { id: String(insertedId) }, body: { Role: 'admin' } };
    const res = mockRes();

    await usersController.updateUserRole(req, res);

    expect(res.statusCode).toBe(200);
    const updated = db.collections.Users.store.get(String(insertedId));
    expect(updated.Role).toBe('admin');
  });

  test('updateUserRole 404s for a non-existent user', async () => {
    const req = { params: { id: String(new ObjectId()) }, body: { Role: 'admin' } };
    const res = mockRes();

    await usersController.updateUserRole(req, res);

    expect(res.statusCode).toBe(404);
  });

  test('deleteUser removes an existing user', async () => {
    const { insertedId } = await db.getCollection('Users').insertOne({ UserName: 'a', Role: 'staff' });
    const res = mockRes();

    await usersController.deleteUser({ params: { id: String(insertedId) } }, res);

    expect(res.statusCode).toBe(200);
    expect(db.collections.Users.store.has(String(insertedId))).toBe(false);
  });

  test('deleteUser 404s for a non-existent user', async () => {
    const res = mockRes();

    await usersController.deleteUser({ params: { id: String(new ObjectId()) } }, res);

    expect(res.statusCode).toBe(404);
  });
});

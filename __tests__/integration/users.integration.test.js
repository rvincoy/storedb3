const { connect, disconnect, collection, mockRes } = require('./helpers/testDb');
const usersController = require('../../controllers/users');

// Hits the real StoreTest MongoDB Atlas database (MONGODB_URI_TEST).
describe('users controller (integration)', () => {
  const createdIds = [];

  beforeAll(() => connect());

  afterEach(async () => {
    if (createdIds.length) {
      await collection('Users').deleteMany({ _id: { $in: createdIds.splice(0) } });
    }
  });

  afterAll(() => disconnect());

  test('createUser persists a real document', async () => {
    const req = {
      body: {
        UserName: 'integration.tester',
        DisplayName: 'Integration Tester',
        email: 'integration.tester@example.com',
        Role: 'staff',
      },
    };
    const res = mockRes();

    await usersController.createUser(req, res);

    expect(res.statusCode).toBe(201);
    createdIds.push(res.body.insertedId);

    const stored = await collection('Users').findOne({ _id: res.body.insertedId });
    expect(stored.Role).toBe('staff');
  });

  test('updateUserRole promotes a real user to admin', async () => {
    const { insertedId } = await collection('Users').insertOne({
      UserName: 'promote.me',
      DisplayName: 'Promote Me',
      email: 'promote.me@example.com',
      Role: 'staff',
    });
    createdIds.push(insertedId);

    const req = { params: { id: String(insertedId) }, body: { Role: 'admin' } };
    const res = mockRes();

    await usersController.updateUserRole(req, res);

    expect(res.statusCode).toBe(200);
    const stored = await collection('Users').findOne({ _id: insertedId });
    expect(stored.Role).toBe('admin');
  });
});

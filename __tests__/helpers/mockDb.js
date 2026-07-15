const { ObjectId } = require('mongodb');

function createMockCollection() {
  const store = new Map();
  return {
    store,
    find: (query = {}) => ({
      toArray: async () => {
        const all = [...store.values()];
        if (query && query._id) return all.filter((d) => String(d._id) === String(query._id));
        return all;
      },
    }),
    findOne: async (query = {}) => {
      for (const doc of store.values()) {
        if (query._id && String(doc._id) === String(query._id)) return doc;
      }
      return null;
    },
    insertOne: async (doc) => {
      const _id = doc._id || new ObjectId();
      store.set(String(_id), { ...doc, _id });
      return { acknowledged: true, insertedId: _id };
    },
    updateOne: async (query, update) => {
      for (const doc of store.values()) {
        if (String(doc._id) === String(query._id)) {
          if (update.$set) Object.assign(doc, update.$set);
          if (update.$inc) {
            for (const [k, v] of Object.entries(update.$inc)) doc[k] = (doc[k] || 0) + v;
          }
          return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        }
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },
    replaceOne: async (query, doc) => {
      for (const existing of store.values()) {
        if (String(existing._id) === String(query._id)) {
          store.set(String(existing._id), { _id: existing._id, ...doc });
          return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        }
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (query) => {
      for (const doc of store.values()) {
        if (String(doc._id) === String(query._id)) {
          store.delete(String(doc._id));
          return { acknowledged: true, deletedCount: 1 };
        }
      }
      return { acknowledged: true, deletedCount: 0 };
    },
  };
}

// Patches the module cache entry for db/connect.js so controllers that
// `require('../db/connect')` transparently get an in-memory fake instead of
// opening a real MongoDB connection. Call after jest.resetModules() in a
// beforeEach so each test gets a clean set of collections.
function installMockDb() {
  const collections = {};
  const getCollection = (name) => {
    if (!collections[name]) collections[name] = createMockCollection();
    return collections[name];
  };

  // jest.doMock (unlike jest.mock) is not hoisted and runs exactly where it's
  // called, so it's safe to invoke from inside this helper rather than at the
  // top of each test file.
  jest.doMock('../../db/connect', () => ({
    getDb: () => ({ db: () => ({ collection: getCollection }) }),
    initDb: (cb) => cb(null, {}),
  }));

  return { collections, getCollection };
}

function mockRes() {
  return {
    statusCode: null,
    body: null,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

module.exports = { createMockCollection, installMockDb, mockRes };

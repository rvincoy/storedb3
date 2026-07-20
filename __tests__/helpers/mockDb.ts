import { ObjectId } from 'mongodb';
import { Response } from 'express';

function createMockCollection() {
  const store = new Map<string, any>();
  return {
    store,
    find: (query: any = {}) => ({
      toArray: async () => {
        const all = [...store.values()];
        if (query && query._id) return all.filter((d) => String(d._id) === String(query._id));
        return all;
      },
    }),
    findOne: async (query: any = {}) => {
      for (const doc of store.values()) {
        if (query._id && String(doc._id) === String(query._id)) return doc;
      }
      return null;
    },
    insertOne: async (doc: any) => {
      const _id = doc._id || new ObjectId();
      store.set(String(_id), { ...doc, _id });
      return { acknowledged: true, insertedId: _id };
    },
    updateOne: async (query: any, update: any) => {
      for (const doc of store.values()) {
        if (String(doc._id) === String(query._id)) {
          if (update.$set) Object.assign(doc, update.$set);
          if (update.$inc) {
            for (const [k, v] of Object.entries(update.$inc) as [string, number][]) doc[k] = (doc[k] || 0) + v;
          }
          return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        }
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },
    replaceOne: async (query: any, doc: any) => {
      for (const existing of store.values()) {
        if (String(existing._id) === String(query._id)) {
          store.set(String(existing._id), { _id: existing._id, ...doc });
          return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
        }
      }
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (query: any) => {
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

// Patches the module cache entry for db/connect.ts so controllers that
// `import * as mongodb from '../../db/connect'` transparently get an in-memory fake instead of
// opening a real MongoDB connection. Call after jest.resetModules() in a
// beforeEach so each test gets a clean set of collections.
function installMockDb() {
  const collections: Record<string, ReturnType<typeof createMockCollection>> = {};
  const getCollection = (name: string) => {
    if (!collections[name]) collections[name] = createMockCollection();
    return collections[name];
  };

  // jest.doMock (unlike jest.mock) is not hoisted and runs exactly where it's
  // called, so it's safe to invoke from inside this helper rather than at the
  // top of each test file.
  jest.doMock('../../db/connect', () => ({
    getDb: () => ({ db: () => ({ collection: getCollection }) }),
    initDb: (cb: (err: null, db: {}) => void) => cb(null, {}),
  }));

  return { collections, getCollection };
}

interface MockResponse {
  statusCode: number | null;
  body: any;
  setHeader(): void;
  status(code: number): MockResponse;
  json(body: any): MockResponse;
}

function mockRes(): Response & MockResponse {
  const res: MockResponse = {
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
  return res as unknown as Response & MockResponse;
}

export { createMockCollection, installMockDb, mockRes };

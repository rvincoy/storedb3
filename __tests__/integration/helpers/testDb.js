const mongodb = require('../../../db/connect');

function connect() {
  if (!process.env.MONGODB_URI_TEST) {
    return Promise.reject(new Error(
      'MONGODB_URI_TEST is not set. Add it to your local .env (see .env.example) to run integration tests against the real StoreTest database.'
    ));
  }
  return new Promise((resolve, reject) => {
    mongodb.initDb((err) => (err ? reject(err) : resolve()));
  });
}

async function disconnect() {
  await mongodb.getDb().close();
}

function collection(name) {
  return mongodb.getDb().db().collection(name);
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

module.exports = { connect, disconnect, collection, mockRes };

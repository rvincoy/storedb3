import { Response } from 'express';
import * as mongodb from '../../../db/connect';

function connect(): Promise<void> {
  if (!process.env.MONGODB_URI_TEST) {
    return Promise.reject(new Error(
      'MONGODB_URI_TEST is not set. Add it to your local .env (see .env.example) to run integration tests against the real StoreTest database.'
    ));
  }
  return new Promise((resolve, reject) => {
    mongodb.initDb((err) => (err ? reject(err) : resolve()));
  });
}

async function disconnect(): Promise<void> {
  await mongodb.getDb().close();
}

function collection(name: string) {
  return mongodb.getDb().db().collection(name);
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

export { connect, disconnect, collection, mockRes };

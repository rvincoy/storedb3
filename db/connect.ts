import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from 'mongodb';

let _db: MongoClient | undefined;

const initDb = (callback: (err: Error | null, db?: MongoClient) => void): void => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  const uri = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;
  MongoClient.connect(uri as string)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = (): MongoClient => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

export { initDb, getDb };

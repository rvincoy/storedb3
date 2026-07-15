import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

let _db: MongoClient | undefined;

export const initDb = (callback: (err: Error | null, db?: MongoClient) => void): void => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(process.env.MONGODB_URI as string)
    .then((client: MongoClient) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err: Error) => {
      callback(err);
    });
};

export const getDb = (): MongoClient => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};
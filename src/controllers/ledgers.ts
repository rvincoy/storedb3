import { Request, Response, NextFunction } from 'express';
import * as mongodb from '../db/connect';
import { ObjectId } from 'mongodb';

interface Ledger {
  ProductID: string;
  ProductName: string;
  Description: string;
  Category: string;
  CoGS: number;
  Quantity: number;
  Price: number;
  TotalPrice: number;
  DateOfPurchase: string;
}

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await mongodb.getDb().db().collection<Ledger>('Ledgers').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the ledgers.' });
  }
};

export const getSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ledgerId = new ObjectId(req.params.id as string);
    const result = await mongodb.getDb().db().collection<Ledger>('Ledgers').find({ _id: ledgerId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the ledger.' });
  }
};

export const createLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ledger: Ledger = {
      ProductID: req.body.ProductID,
      ProductName: req.body.ProductName,
      Description: req.body.Description,
      Category: req.body.Category,
      CoGS: req.body.CoGS,
      Quantity: req.body.Quantity,
      Price: req.body.Price,
      TotalPrice: req.body.TotalPrice,
      DateOfPurchase: req.body.DateOfPurchase,
    };
    if (
      !ledger.ProductID || !ledger.ProductName || !ledger.Description || !ledger.Category ||
      !ledger.CoGS || !ledger.Quantity || !ledger.Price || !ledger.TotalPrice || !ledger.DateOfPurchase
    ) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (
      typeof ledger.CoGS !== 'number' || typeof ledger.Quantity !== 'number' ||
      typeof ledger.Price !== 'number' || typeof ledger.TotalPrice !== 'number'
    ) {
      res.status(400).json({ error: 'CoGS, Quantity, Price, and TotalPrice must be numbers.' });
      return;
    }
    if (isNaN(Date.parse(ledger.DateOfPurchase))) {
      res.status(400).json({ error: 'DateOfPurchase must be a valid date.' });
      return;
    }
    const result = await mongodb.getDb().db().collection<Ledger>('Ledgers').insertOne(ledger);
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ error: 'Failed to create the ledger.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the ledger.' });
  }
};

export const updateLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ledgerId = new ObjectId(req.params.id as string);
    const ledger: Ledger = {
      ProductID: req.body.ProductID,
      ProductName: req.body.ProductName,
      Description: req.body.Description,
      Category: req.body.Category,
      CoGS: req.body.CoGS,
      Quantity: req.body.Quantity,
      Price: req.body.Price,
      TotalPrice: req.body.TotalPrice,
      DateOfPurchase: req.body.DateOfPurchase,
    };
    if (
      !ledger.ProductID || !ledger.ProductName || !ledger.Description || !ledger.Category ||
      !ledger.CoGS || !ledger.Quantity || !ledger.Price || !ledger.TotalPrice || !ledger.DateOfPurchase
    ) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (
      typeof ledger.CoGS !== 'number' || typeof ledger.Quantity !== 'number' ||
      typeof ledger.Price !== 'number' || typeof ledger.TotalPrice !== 'number'
    ) {
      res.status(400).json({ error: 'CoGS, Quantity, Price, and TotalPrice must be numbers.' });
      return;
    }
    if (isNaN(Date.parse(ledger.DateOfPurchase))) {
      res.status(400).json({ error: 'DateOfPurchase must be a valid date.' });
      return;
    }
    const result = await mongodb.getDb().db().collection<Ledger>('Ledgers').replaceOne({ _id: ledgerId }, ledger);
    if (result.acknowledged) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: 'Failed to update the ledger.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the ledger.' });
  }
};

export const deleteLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ledgerId = new ObjectId(req.params.id as string);
    const result = await mongodb.getDb().db().collection('Ledgers').deleteOne({ _id: ledgerId });
    if (result.acknowledged) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: 'Failed to delete the ledger.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the ledger.' });
  }
};
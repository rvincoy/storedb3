import { Request, Response, NextFunction } from 'express';
import * as mongodb from '../db/connect';
import { ObjectId } from 'mongodb';

interface Product {
  ProductName: string;
  Description: string;
  Category: string;
  Price: number;
  Stock: number;
}

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await mongodb.getDb().db().collection<Product>('Products').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the products.' });
  }
};

export const getSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = new ObjectId(req.params.id as string);
    const result = await mongodb.getDb().db().collection<Product>('Products').find({ _id: productId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: Product = {
      ProductName: req.body.ProductName,
      Description: req.body.Description,
      Category: req.body.Category,
      Price: req.body.Price,
      Stock: req.body.Stock
    };
    if (!product.ProductName || !product.Description || !product.Category || !product.Price || !product.Stock) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (typeof product.Price !== 'number' || typeof product.Stock !== 'number') {
      res.status(400).json({ error: 'Price and Stock must be numbers.' });
      return;
    }
    const result = await mongodb.getDb().db().collection<Product>('Products').insertOne(product);
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ error: 'Failed to create the product.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = new ObjectId(req.params.id as string);;
    const product: Product = {
      ProductName: req.body.ProductName,
      Description: req.body.Description,
      Category: req.body.Category,
      Price: req.body.Price,
      Stock: req.body.Stock
    };
    if (!product.ProductName || !product.Description || !product.Category || !product.Price || !product.Stock) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    if (typeof product.Price !== 'number' || typeof product.Stock !== 'number') {
      res.status(400).json({ error: 'Price and Stock must be numbers.' });
      return;
    }
    const result = await mongodb.getDb().db().collection<Product>('Products').replaceOne({ _id: productId }, product);
    if (result.acknowledged) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: 'Failed to update the product.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = new ObjectId(req.params.id as string);;
    const result = await mongodb.getDb().db().collection('Products').deleteOne({ _id: productId });
    if (result.acknowledged) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: 'Failed to delete the product.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};
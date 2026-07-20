import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import * as mongodb from '../db/connect';
import { ReturnItem } from '../types/models';

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = mongodb.getDb().db().collection<ReturnItem>('Returns').find();
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};

const getSingle = async (req: Request, res: Response): Promise<void> => {
    try {
        const returnId = new ObjectId(req.params.id as string);
        const result = mongodb.getDb().db().collection<ReturnItem>('Returns').find({ _id: returnId });
        const lists = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};

const createReturn = async (req: Request, res: Response): Promise<void> => {
    try {
        const returnItem: ReturnItem = {
            ProductName: req.body.ProductName,
            Description: req.body.Description,
            Category: req.body.Category,
            Price: req.body.Price,
            Stock: req.body.Stock
        };
        if (!returnItem.ProductName || !returnItem.Description || !returnItem.Category || !returnItem.Price || !returnItem.Stock) {
            res.status(400).json({ error: 'All fields are required.' });
            return;
        }
        if (typeof returnItem.Price !== 'number' || typeof returnItem.Stock !== 'number') {
            res.status(400).json({ error: 'Price and Stock must be numbers.' });
            return;
        }
        const result = await mongodb.getDb().db().collection<ReturnItem>('Returns').insertOne(returnItem);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json((result as any).error || 'Failed to create the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the return.' });
    }
};

const updateReturn = async (req: Request, res: Response): Promise<void> => {
    try {
        const returnId = new ObjectId(req.params.id as string);
        const returnItem: ReturnItem = {
            ProductName: req.body.ProductName,
            Description: req.body.Description,
            Category: req.body.Category,
            Price: req.body.Price,
            Stock: req.body.Stock
        };
        if (!returnItem.ProductName || !returnItem.Description || !returnItem.Category || !returnItem.Price || !returnItem.Stock) {
            res.status(400).json({ error: 'All fields are required.' });
            return;
        }
        if (typeof returnItem.Price !== 'number' || typeof returnItem.Stock !== 'number') {
            res.status(400).json({ error: 'Price and Stock must be numbers.' });
            return;
        }
        const result = await mongodb.getDb().db().collection<ReturnItem>('Returns').replaceOne({ _id: returnId }, returnItem);
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(500).json((result as any).error || 'Failed to update the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the return.' });
    }
};

const deleteReturn = async (req: Request, res: Response): Promise<void> => {
    try {
        const returnId = new ObjectId(req.params.id as string);
        const result = await mongodb.getDb().db().collection<ReturnItem>('Returns').deleteOne({ _id: returnId });
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(500).json((result as any).error || 'Failed to delete the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the return.' });
    }
};

export {
    getAll,
    getSingle,
    createReturn,
    updateReturn,
    deleteReturn
};

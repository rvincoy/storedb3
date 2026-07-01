const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection('Returns').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};

const getSingle = async (req, res, next) => {
    try {
        const returnId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Returns').find({ _id: returnId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};

const createReturn = async (req, res, next) => {
    try {
        const returnItem = {
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
        const result = await mongodb.getDb().db().collection('Returns').insertOne(returnItem);
        if (result.acknowledged) {
            res.status(201).json(result);
        } else {
            res.status(500).json(result.error || 'Failed to create the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the return.' });
    }
};

const updateReturn = async (req, res, next) => {
    try {
        const returnId = new ObjectId(req.params.id);
        const returnItem = {
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
        const result = await mongodb.getDb().db().collection('Returns').replaceOne({ _id: returnId }, returnItem);
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result.error || 'Failed to update the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the return.' });
    }
};

const deleteReturn = async (req, res, next) => {
    try {
        const returnId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Returns').deleteOne({ _id: returnId });
        if (result.acknowledged) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result.error || 'Failed to delete the return.');
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the return.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createReturn,
    updateReturn,
    deleteReturn
};
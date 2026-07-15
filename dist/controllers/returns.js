"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReturn = exports.updateReturn = exports.createReturn = exports.getSingle = exports.getAll = void 0;
const mongodb = __importStar(require("../db/connect"));
const mongodb_1 = require("mongodb");
const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection('Returns').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const returnId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Returns').find({ _id: returnId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the returns.' });
    }
};
exports.getSingle = getSingle;
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
        }
        else {
            res.status(500).json({ error: 'Failed to create the return.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the return.' });
    }
};
exports.createReturn = createReturn;
const updateReturn = async (req, res, next) => {
    try {
        const returnId = new mongodb_1.ObjectId(req.params.id);
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
        }
        else {
            res.status(500).json({ error: 'Failed to update the return.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the return.' });
    }
};
exports.updateReturn = updateReturn;
const deleteReturn = async (req, res, next) => {
    try {
        const returnId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Returns').deleteOne({ _id: returnId });
        if (result.acknowledged) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to delete the return.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the return.' });
    }
};
exports.deleteReturn = deleteReturn;

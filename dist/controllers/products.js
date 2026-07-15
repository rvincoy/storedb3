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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingle = exports.getAll = void 0;
const mongodb = __importStar(require("../db/connect"));
const mongodb_1 = require("mongodb");
const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection('Products').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the products.' });
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const productId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Products').find({ _id: productId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
};
exports.getSingle = getSingle;
const createProduct = async (req, res, next) => {
    try {
        const product = {
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
        const result = await mongodb.getDb().db().collection('Products').insertOne(product);
        if (result.acknowledged) {
            res.status(201).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to create the product.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the product.' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const productId = new mongodb_1.ObjectId(req.params.id);
        ;
        const product = {
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
        const result = await mongodb.getDb().db().collection('Products').replaceOne({ _id: productId }, product);
        if (result.acknowledged) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to update the product.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const productId = new mongodb_1.ObjectId(req.params.id);
        ;
        const result = await mongodb.getDb().db().collection('Products').deleteOne({ _id: productId });
        if (result.acknowledged) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to delete the product.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the product.' });
    }
};
exports.deleteProduct = deleteProduct;

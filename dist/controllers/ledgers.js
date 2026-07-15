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
exports.deleteLedger = exports.updateLedger = exports.createLedger = exports.getSingle = exports.getAll = void 0;
const mongodb = __importStar(require("../db/connect"));
const mongodb_1 = require("mongodb");
const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection('Ledgers').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ledgers.' });
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const ledgerId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Ledgers').find({ _id: ledgerId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the ledger.' });
    }
};
exports.getSingle = getSingle;
const createLedger = async (req, res, next) => {
    try {
        const ledger = {
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
        if (!ledger.ProductID || !ledger.ProductName || !ledger.Description || !ledger.Category ||
            !ledger.CoGS || !ledger.Quantity || !ledger.Price || !ledger.TotalPrice || !ledger.DateOfPurchase) {
            res.status(400).json({ error: 'All fields are required.' });
            return;
        }
        if (typeof ledger.CoGS !== 'number' || typeof ledger.Quantity !== 'number' ||
            typeof ledger.Price !== 'number' || typeof ledger.TotalPrice !== 'number') {
            res.status(400).json({ error: 'CoGS, Quantity, Price, and TotalPrice must be numbers.' });
            return;
        }
        if (isNaN(Date.parse(ledger.DateOfPurchase))) {
            res.status(400).json({ error: 'DateOfPurchase must be a valid date.' });
            return;
        }
        const result = await mongodb.getDb().db().collection('Ledgers').insertOne(ledger);
        if (result.acknowledged) {
            res.status(201).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to create the ledger.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the ledger.' });
    }
};
exports.createLedger = createLedger;
const updateLedger = async (req, res, next) => {
    try {
        const ledgerId = new mongodb_1.ObjectId(req.params.id);
        const ledger = {
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
        if (!ledger.ProductID || !ledger.ProductName || !ledger.Description || !ledger.Category ||
            !ledger.CoGS || !ledger.Quantity || !ledger.Price || !ledger.TotalPrice || !ledger.DateOfPurchase) {
            res.status(400).json({ error: 'All fields are required.' });
            return;
        }
        if (typeof ledger.CoGS !== 'number' || typeof ledger.Quantity !== 'number' ||
            typeof ledger.Price !== 'number' || typeof ledger.TotalPrice !== 'number') {
            res.status(400).json({ error: 'CoGS, Quantity, Price, and TotalPrice must be numbers.' });
            return;
        }
        if (isNaN(Date.parse(ledger.DateOfPurchase))) {
            res.status(400).json({ error: 'DateOfPurchase must be a valid date.' });
            return;
        }
        const result = await mongodb.getDb().db().collection('Ledgers').replaceOne({ _id: ledgerId }, ledger);
        if (result.acknowledged) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to update the ledger.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the ledger.' });
    }
};
exports.updateLedger = updateLedger;
const deleteLedger = async (req, res, next) => {
    try {
        const ledgerId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Ledgers').deleteOne({ _id: ledgerId });
        if (result.acknowledged) {
            res.status(200).json(result);
        }
        else {
            res.status(500).json({ error: 'Failed to delete the ledger.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the ledger.' });
    }
};
exports.deleteLedger = deleteLedger;

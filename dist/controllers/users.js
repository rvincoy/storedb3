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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getSingle = exports.getAll = void 0;
const mongodb = __importStar(require("../db/connect"));
const mongodb_1 = require("mongodb");
const getAll = async (req, res, next) => {
    try {
        const result = await mongodb.getDb().db().collection('Users').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};
exports.getAll = getAll;
const getSingle = async (req, res, next) => {
    try {
        const userId = new mongodb_1.ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('Users').find({ _id: userId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists[0]);
            }
            else {
                res.status(404).json({ error: 'User not found.' });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
};
exports.getSingle = getSingle;
const createUser = async (req, res, next) => {
    try {
        const user = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const response = await mongodb.getDb().db().collection('Users').insertOne(user);
        res.status(201).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res, next) => {
    try {
        const userId = new mongodb_1.ObjectId(req.params.id);
        const user = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const response = await mongodb.getDb().db().collection('Users').updateOne({ _id: userId }, { $set: user });
        if (response.modifiedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        const userId = new mongodb_1.ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection('Users').deleteOne({ _id: userId });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};
exports.deleteUser = deleteUser;

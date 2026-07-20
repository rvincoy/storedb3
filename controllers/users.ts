import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import * as mongodb from '../db/connect';
import { User } from '../types/models';

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = mongodb.getDb().db().collection<User>('Users').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};

const getSingle = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.params.id as string);
        const result = mongodb.getDb().db().collection<User>('Users').find({ _id: userId });
        const lists = await result.toArray();
        if (lists.length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            res.status(400).json({ error: 'Missing required fields.' });
            return;
        }
        const response = await mongodb.getDb().db().collection<User>('Users').insertOne(user);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.params.id as string);
        const user: User = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            res.status(400).json({ error: 'Missing required fields.' });
            return;
        }
        const response = await mongodb.getDb().db().collection<User>('Users').updateOne({ _id: userId }, { $set: user });
        if (response.modifiedCount === 0) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.params.id as string);
        const response = await mongodb.getDb().db().collection<User>('Users').deleteOne({ _id: userId });
        if (response.deletedCount === 0) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
};

const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = new ObjectId(req.params.id as string);
        const { Role } = req.body;
        if (!['admin', 'staff'].includes(Role)) {
            res.status(400).json({ error: "Role must be 'admin' or 'staff'." });
            return;
        }
        const response = await mongodb.getDb().db().collection<User>('Users').updateOne({ _id: userId }, { $set: { Role } });
        if (response.matchedCount === 0) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while updating the user's role." });
    }
};

export { getAll, getSingle, createUser, updateUser, deleteUser, updateUserRole };

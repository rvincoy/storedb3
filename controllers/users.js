const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("Users").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching users." });
    }
};

const getSingle = async (req, res, next) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection("Users").find({ _id: userId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(lists[0]);
            } else {
                res.status(404).json({ error: "User not found." });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching the user." });
    }
};

const createUser = async (req, res, next) => {
    try {
        const user = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        const response = await mongodb.getDb().db().collection("Users").insertOne(user);
        res.status(201).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while creating the user." });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            UserName: req.body.UserName,
            DisplayName: req.body.DisplayName,
            email: req.body.email,
            Role: req.body.Role,
        };
        if (!user.UserName || !user.DisplayName || !user.email || !user.Role) {
            return res.status(400).json({ error: "Missing required fields." });
        }
        const response = await mongodb.getDb().db().collection("Users").updateOne({ _id: userId }, { $set: user });
        if (response.modifiedCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().db().collection("Users").deleteOne({ _id: userId });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting the user." });
    }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };
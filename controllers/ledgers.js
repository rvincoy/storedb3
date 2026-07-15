const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("Ledgers").find();
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the ledgers." });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const ledgerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection("Ledgers").find({ _id: ledgerId });
    result.toArray().then((lists) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists[0]);
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the ledger." });
  }
};

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
      SoldBy: req.user.id,
    };
    if (
      !ledger.ProductID ||
      !ledger.ProductName ||
      !ledger.Description ||
      !ledger.Category ||
      !ledger.CoGS ||
      !ledger.Quantity ||
      !ledger.Price ||
      !ledger.TotalPrice ||
      !ledger.DateOfPurchase
    ) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }
    if (
      typeof ledger.CoGS !== "number" ||
      typeof ledger.Quantity !== "number" ||
      typeof ledger.Price !== "number" ||
      typeof ledger.TotalPrice !== "number"
    ) {
      res.status(400).json({
        error: "CoGS, Quantity, Price, and TotalPrice must be numbers.",
      });
      return;
    }
    if (isNaN(Date.parse(ledger.DateOfPurchase))) {
      res.status(400).json({ error: "DateOfPurchase must be a valid date." });
      return;
    }

    const products = mongodb.getDb().db().collection("Products");
    const productId = new ObjectId(ledger.ProductID);
    const product = await products.findOne({ _id: productId });
    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }
    if (ledger.Quantity > product.Stock) {
      res.status(400).json({ error: "Not enough stock available." });
      return;
    }

    const result = await mongodb.getDb().db().collection("Ledgers").insertOne(ledger);
    if (!result.acknowledged) {
      res.status(500).json(result.error || "Failed to create the ledger.");
      return;
    }
    await products.updateOne({ _id: productId }, { $inc: { Stock: -ledger.Quantity } });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the ledger." });
  }
};

const updateLedger = async (req, res, next) => {
  try {
    const ledgerId = new ObjectId(req.params.id);
    const ledgers = mongodb.getDb().db().collection("Ledgers");
    const existingLedger = await ledgers.findOne({ _id: ledgerId });
    if (!existingLedger) {
      res.status(404).json({ error: "Ledger entry not found." });
      return;
    }

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
      SoldBy: existingLedger.SoldBy,
    };
    if (
      !ledger.ProductID ||
      !ledger.ProductName ||
      !ledger.Description ||
      !ledger.Category ||
      !ledger.CoGS ||
      !ledger.Quantity ||
      !ledger.Price ||
      !ledger.TotalPrice ||
      !ledger.DateOfPurchase
    ) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }
    if (
      typeof ledger.CoGS !== "number" ||
      typeof ledger.Quantity !== "number" ||
      typeof ledger.Price !== "number" ||
      typeof ledger.TotalPrice !== "number"
    ) {
      res.status(400).json({
        error: "CoGS, Quantity, Price, and TotalPrice must be numbers.",
      });
      return;
    }
    if (isNaN(Date.parse(ledger.DateOfPurchase))) {
      res.status(400).json({ error: "DateOfPurchase must be a valid date." });
      return;
    }

    const products = mongodb.getDb().db().collection("Products");
    const newProductId = new ObjectId(ledger.ProductID);
    const newProduct = await products.findOne({ _id: newProductId });
    if (!newProduct) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    const sameProduct = existingLedger.ProductID === ledger.ProductID;
    const availableStock = sameProduct
      ? newProduct.Stock + existingLedger.Quantity
      : newProduct.Stock;
    if (ledger.Quantity > availableStock) {
      res.status(400).json({ error: "Not enough stock available." });
      return;
    }

    const result = await ledgers.replaceOne({ _id: ledgerId }, ledger);
    if (!result.acknowledged) {
      res.status(500).json(result.error || "Failed to update the ledger.");
      return;
    }

    if (sameProduct) {
      const delta = ledger.Quantity - existingLedger.Quantity;
      await products.updateOne({ _id: newProductId }, { $inc: { Stock: -delta } });
    } else {
      const oldProductId = new ObjectId(existingLedger.ProductID);
      await products.updateOne({ _id: oldProductId }, { $inc: { Stock: existingLedger.Quantity } });
      await products.updateOne({ _id: newProductId }, { $inc: { Stock: -ledger.Quantity } });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the ledger." });
  }
};

const deleteLedger = async (req, res, next) => {
  try {
    const ledgerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection("Ledgers").deleteOne({ _id: ledgerId });
    if (result.acknowledged) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result.error || "Failed to delete the ledger.");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the ledger." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createLedger,
  updateLedger,
  deleteLedger,
};


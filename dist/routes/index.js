"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.use('/', require('./swagger'));
router.use('/products', require('./products'));
router.use('/returns', require('./returns'));
router.use('/ledgers', require('./ledgers'));
router.use('/users', require('./users'));
module.exports = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});
router.get('/api-docs', auth_1.ensureAuth, (req, res) => {
    console.log(req.user);
    res.render('api-docs', {
        name: req.user?.DisplayName,
    });
});
module.exports = router;

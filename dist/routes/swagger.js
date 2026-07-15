"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const router = express_1.default.Router();
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Unauthorized');
}
router.use('/api-docs', requireAuth, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
module.exports = router;

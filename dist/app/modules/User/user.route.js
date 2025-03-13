"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validtion_1 = require("./user.validtion");
const router = express_1.default.Router();
router.post('/create-user', (0, validateRequest_1.default)(user_validtion_1.UserValiditons.createuserSchema), user_controller_1.UserControllers.createCustomer);
router.post('/singleUser', (0, validateRequest_1.default)(user_validtion_1.UserValiditons.SingleUserSchema), user_controller_1.UserControllers.getsingleuser);
exports.UserRoutes = router;

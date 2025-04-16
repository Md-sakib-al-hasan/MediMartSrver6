"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const message_validitons_1 = require("./message.validitons");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(message_validitons_1.MessageZodSchema), message_controller_1.MessageController.createMessage);
router.get('/:userId', (0, auth_1.default)(user_interface_1.UserRole.USER, user_interface_1.UserRole.ADMIN), message_controller_1.MessageController.getAllMesage);
exports.CouponRoutes = router;

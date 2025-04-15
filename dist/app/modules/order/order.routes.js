"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
// Define routes
router.get('/my-orders', (0, auth_1.default)(user_interface_1.UserRole.USER), order_controller_1.OrderController.getMyOrders);
router.get('/:orderId', (0, auth_1.default)(user_interface_1.UserRole.USER), order_controller_1.OrderController.getOrderDetails);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.USER), order_controller_1.OrderController.createOrder);
router.patch('/:orderId/status', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), order_controller_1.OrderController.changeOrderStatus);
exports.OrderRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const product_controller_1 = require("./product.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.ProductController.getAllProduct);
router.get('/:productId', product_controller_1.ProductController.getSingleProduct);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.default)(product_validation_1.productValidation.createProductValidationSchema), product_controller_1.ProductController.createProduct);
router.patch('/:productId', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), product_controller_1.ProductController.updateProduct);
router.delete('/:productId', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), category_controller_1.CategoryController.getAllCategory);
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), (0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategoryValidationSchema), category_controller_1.CategoryController.createCategory);
exports.CategoryRoutes = router;

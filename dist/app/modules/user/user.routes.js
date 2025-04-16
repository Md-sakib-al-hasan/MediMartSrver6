"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.UserController.getAllUser);
router.get('/me', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), user_controller_1.UserController.myProfile);
router.post('/', (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.UserController.registerUser);
router.patch('/update-profile', (0, auth_1.default)(user_interface_1.UserRole.USER), (0, validateRequest_1.default)(user_validation_1.UserValidation.customerInfoValidationSchema), user_controller_1.UserController.updateProfile);
exports.UserRoutes = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_interface_1 = require("../user/user.interface");
const coupon_controller_1 = require("./coupon.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const coupon_validation_1 = require("./coupon.validation");
const router = (0, express_1.Router)();
// Define routes
router.post('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), coupon_controller_1.couponController.createCoupon);
router.get('/', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), coupon_controller_1.couponController.getAllCoupon);
router.patch('/:couponCode/update-coupon', (0, validateRequest_1.default)(coupon_validation_1.updateCouponValidationSchema), (0, auth_1.default)(user_interface_1.UserRole.ADMIN), coupon_controller_1.couponController.updateCoupon);
router.post('/:couponCode', (0, auth_1.default)(user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.USER), // Ensure only authorized users can fetch the coupon
coupon_controller_1.couponController.getCouponByCode);
router.delete('/:couponId', (0, auth_1.default)(user_interface_1.UserRole.ADMIN), coupon_controller_1.couponController.deleteCoupon);
exports.CouponRoutes = router;

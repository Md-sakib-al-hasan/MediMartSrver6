"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const coupon_model_1 = require("./coupon.model");
const coupon_utils_1 = require("./coupon.utils");
const user_model_1 = __importDefault(require("../user/user.model"));
const createCoupon = (couponData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(authUser.userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const coupon = new coupon_model_1.Coupon(Object.assign(Object.assign({}, couponData), { UserId: authUser.userId }));
    return yield coupon.save();
});
const getAllCoupon = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = new QueryBuilder_1.default(coupon_model_1.Coupon.find(), query)
        .search(['code'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield brandQuery.modelQuery;
    const meta = yield brandQuery.countTotal();
    return {
        meta,
        result,
    };
});
const updateCoupon = (payload, couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const coupon = yield coupon_model_1.Coupon.findOne({ code: couponCode });
    if (!coupon) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coupon not found.');
    }
    if (coupon.endDate < currentDate) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Coupon has expired.');
    }
    const updatedCoupon = yield coupon_model_1.Coupon.findByIdAndUpdate(coupon._id, { $set: payload }, { new: true, runValidators: true });
    return updatedCoupon;
});
const getCouponByCode = (orderAmount, couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const coupon = yield coupon_model_1.Coupon.findOne({ code: couponCode });
    if (!coupon) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coupon not found.');
    }
    if (!coupon.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Coupon is inactive.');
    }
    if (coupon.endDate < currentDate) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Coupon has expired.');
    }
    if (coupon.startDate > currentDate) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Coupon has not started.');
    }
    if (orderAmount < coupon.minOrderAmount) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Below Minimum order amount');
    }
    const discountAmount = (0, coupon_utils_1.calculateDiscount)(coupon, orderAmount);
    const discountedPrice = orderAmount - discountAmount;
    return { coupon, discountedPrice, discountAmount };
});
const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findById(couponId);
    if (!coupon) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Coupon not found.');
    }
    yield coupon_model_1.Coupon.updateOne({ _id: coupon._id }, { isDeleted: true });
    return { message: 'Coupon deleted successfully.' };
});
exports.CouponService = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    getCouponByCode,
    deleteCoupon,
};

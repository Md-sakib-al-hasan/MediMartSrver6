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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const product_model_1 = require("../product/product.model");
const coupon_model_1 = require("../coupon/coupon.model");
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    OrderId: {
        type: String,
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            unitPrice: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
        },
    ],
    coupon: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    finalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'Online',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});
// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Use 'this' directly instead of aliasing to a variable
        let totalAmount = 0;
        let finalDiscount = 0;
        // Step 1: Calculate total product price
        for (const item of this.products) {
            const product = yield product_model_1.Product.findById(item.product);
            if (!product) {
                return next(new Error('Product not found!'));
            }
            const productPrice = product.price;
            item.unitPrice = productPrice;
            totalAmount += productPrice * item.quantity;
        }
        // Step 2: Handle coupon
        if (this.coupon) {
            const couponDetails = yield coupon_model_1.Coupon.findById(this.coupon);
            if (couponDetails && couponDetails.isActive) {
                if (totalAmount >= couponDetails.minOrderAmount) {
                    if (couponDetails.discountType === 'Percentage') {
                        finalDiscount = Math.min((couponDetails.discountValue / 100) * totalAmount, (_a = couponDetails.maxDiscountAmount) !== null && _a !== void 0 ? _a : Infinity);
                    }
                    else if (couponDetails.discountType === 'Flat') {
                        finalDiscount = Math.min(couponDetails.discountValue, totalAmount);
                    }
                }
            }
        }
        const isDhaka = (_b = this.shippingAddress) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('dhaka');
        const deliveryCharge = isDhaka ? 60 : 120;
        // Final calculation
        this.totalAmount = totalAmount;
        this.discount = finalDiscount;
        this.deliveryCharge = deliveryCharge;
        this.finalAmount = totalAmount - finalDiscount + deliveryCharge;
        next();
    });
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);

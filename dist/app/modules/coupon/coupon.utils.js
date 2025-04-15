"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiscount = void 0;
const calculateDiscount = (coupon, orderAmount) => {
    let discountAmount = 0;
    if (coupon.discountType === 'Percentage') {
        discountAmount = (coupon.discountValue / 100) * orderAmount;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
        }
    }
    else if (coupon.discountType === 'Flat') {
        discountAmount = coupon.discountValue;
    }
    return discountAmount;
};
exports.calculateDiscount = calculateDiscount;

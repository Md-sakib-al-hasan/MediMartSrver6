"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponValidationSchema = exports.couponValidation = void 0;
const zod_1 = require("zod");
exports.couponValidation = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
    }),
    update: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid ID format'),
        name: zod_1.z.string().optional(),
    }),
};
exports.updateCouponValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        code: zod_1.z.string().trim().toUpperCase().optional(),
        discountType: zod_1.z.enum(['Flat', 'Percentage']).optional(),
        discountValue: zod_1.z.number().min(0).optional(),
        minOrderAmount: zod_1.z.number().min(0).optional(),
        maxDiscountAmount: zod_1.z.number().nullable().optional(),
        startDate: zod_1.z.date().optional(),
        endDate: zod_1.z.date().optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .strict(),
});

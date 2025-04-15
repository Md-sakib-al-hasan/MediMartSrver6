"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Product name is required',
        })
            .min(1, 'Product name cannot be empty'),
        description: zod_1.z
            .string({
            required_error: 'Product description is required',
        })
            .min(1, 'Product description cannot be empty'),
        price: zod_1.z
            .number({
            required_error: 'Product price is required',
        })
            .min(0, 'Product price cannot be less than 0'),
        stock: zod_1.z
            .number({
            required_error: 'Product stock is required',
        })
            .min(0, 'Product stock cannot be less than 0'),
        offerPrice: zod_1.z
            .number()
            .min(0, 'Offer price cannot be less than 0')
            .nullable()
            .optional(),
        category: zod_1.z
            .string({
            required_error: 'Category ID is required',
        })
            .min(1, 'Category ID cannot be empty'),
        imageUrls: zod_1.z.string({
            required_error: 'Image URLs are required',
        }),
        prescriptionRequired: zod_1.z.boolean({
            required_error: 'Prescription requirement must be specified',
        }),
        prescriptionimage: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional().default(true),
        brand: zod_1.z.string({
            required_error: 'Brand ID is required',
        }),
        ratingCount: zod_1.z.number().optional().default(0),
        availableColors: zod_1.z.array(zod_1.z.string()).optional(),
        keyFeatures: zod_1.z.array(zod_1.z.string()).optional(),
        manufacturer: zod_1.z.any().optional().default([]),
        expiredDate: zod_1.z.coerce.date({
            required_error: 'Expired date is required',
        }),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Product name cannot be empty').optional(),
        description: zod_1.z
            .string()
            .min(1, 'Product description cannot be empty')
            .optional(),
        price: zod_1.z.number().min(0, 'Product price cannot be less than 0').optional(),
        stock: zod_1.z.number().min(0, 'Product stock cannot be less than 0').optional(),
        offerPrice: zod_1.z
            .number()
            .min(0, 'Offer price cannot be less than 0')
            .nullable()
            .optional(),
        offer: zod_1.z.number().min(0, 'Offer cannot be less than 0').optional(),
        category: zod_1.z.string().min(1, 'Category ID cannot be empty').optional(),
        imageUrls: zod_1.z.string({
            required_error: 'Image URLs are required',
        }),
    }),
});
exports.productValidation = {
    createProductValidationSchema,
    updateProductValidationSchema,
};

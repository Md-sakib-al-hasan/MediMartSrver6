"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .nonempty('Category name is required')
            .max(100, 'Category name should not exceed 100 characters'),
        logo: (0, zod_1.string)(),
    }),
});
exports.categoryValidation = {
    createCategoryValidationSchema,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
exports.orderValidation = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
    }),
    update: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid ID format'),
        name: zod_1.z.string().optional(),
    }),
};

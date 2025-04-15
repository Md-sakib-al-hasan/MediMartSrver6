"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
const user_constant_1 = require("./user.constant");
exports.userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
        name: zod_1.z.string().min(1, 'Name is required'),
        role: zod_1.z.enum([user_interface_1.UserRole.USER, user_interface_1.UserRole.ADMIN]).optional(),
        status: zod_1.z.string().min(1, 'Status is required'),
        profilePicture: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        gender: zod_1.z.enum(user_constant_1.UserGender).optional(),
        address: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.coerce.date().optional(),
        lastLogin: zod_1.z.coerce.date().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const customerInfoValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z.string().email('Invalid email address').optional(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .optional(),
        name: zod_1.z.string().min(1, 'Name is required').optional(),
        status: zod_1.z.string().min(1, 'Status is required').optional(),
        profilePicture: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        gender: zod_1.z.enum(user_constant_1.UserGender).optional(),
        address: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.coerce.date().optional(),
        lastLogin: zod_1.z.coerce.date().optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .strict(),
});
exports.UserValidation = {
    userValidationSchema: exports.userValidationSchema,
    customerInfoValidationSchema,
};

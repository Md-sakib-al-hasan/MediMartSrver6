"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValiditons = exports.SingleUserSchema = exports.createuserSchema = void 0;
const zod_1 = require("zod");
exports.createuserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters long'),
    }),
});
exports.SingleUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Must be Enter Eamil'),
    }),
});
exports.UserValiditons = {
    createuserSchema: exports.createuserSchema,
    SingleUserSchema: exports.SingleUserSchema,
};

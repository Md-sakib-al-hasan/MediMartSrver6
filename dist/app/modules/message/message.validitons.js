"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageZodSchema = void 0;
const zod_1 = require("zod");
exports.MessageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string().min(1, { message: 'Message content is required' }),
    }),
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isFromAdmin: { type: Boolean, default: false },
});
exports.Message = (0, mongoose_1.model)('messge', MessageSchema);

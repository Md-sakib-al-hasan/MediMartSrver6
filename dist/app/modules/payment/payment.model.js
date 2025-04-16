"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    method: {
        type: String,
        enum: ['COD', 'Online'],
        required: true,
        default: 'Online',
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        required: true,
        default: 'Pending',
    },
    transactionId: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    gatewayResponse: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);

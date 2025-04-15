"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    medicineId: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        default: null,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    imageUrls: {
        type: String,
        required: true,
    },
    prescriptionRequired: {
        type: Boolean,
        required: true,
    },
    prescriptionimage: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    availableColors: [
        {
            type: String,
        },
    ],
    keyFeatures: [
        {
            type: String,
        },
    ],
    manufacturer: {
        type: mongoose_1.Schema.Types.Mixed,
        default: [],
    },
    expiredDate: { type: Date, required: true },
}, {
    timestamps: true,
});
// Middleware to auto-generate the slug before saving
productSchema.pre('validate', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    next();
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);

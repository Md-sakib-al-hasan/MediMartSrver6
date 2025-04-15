import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
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
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.Mixed,
      default: [],
    },
    expiredDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

// Middleware to auto-generate the slug before saving
productSchema.pre<IProduct>('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema);

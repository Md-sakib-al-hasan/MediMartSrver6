import { Schema, model, Document } from 'mongoose';
import { ICategory } from './category.interface';

// Extend Mongoose Document with ICategory
interface ICategoryDocument extends Document, ICategory {}

// Define the schema
const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<ICategoryDocument>('Category', categorySchema);

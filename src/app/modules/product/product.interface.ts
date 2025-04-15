import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  medicineId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  offerPrice?: number | null;
  category: Types.ObjectId;
  imageUrls: string;
  prescriptionRequired: boolean;
  prescriptionimage?: string;
  isActive: boolean;
  brand: Types.ObjectId;
  ratingCount?: number;
  availableColors: string[];
  keyFeatures: string[];
  manufacturer: Record<string, unknown> | [];
  expiredDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

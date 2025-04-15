import { Types } from 'mongoose';

export interface IPayment {
  userId: Types.ObjectId;
  order: Types.ObjectId;
  method: 'COD' | 'Online';
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  transactionId?: string;
  amount: number;
  gatewayResponse?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

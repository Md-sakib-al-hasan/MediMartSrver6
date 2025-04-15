import { Types } from 'mongoose';

export interface Message {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  timestamp: Date;
  isFromAdmin: boolean;
}

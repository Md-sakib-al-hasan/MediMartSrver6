import { model, Schema } from 'mongoose';
import { Message as TMessage } from './message.interface';

const MessageSchema = new Schema<TMessage>({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isFromAdmin: { type: Boolean, default: false },
});

export const Message = model<TMessage>('messge', MessageSchema);

import QueryBuilder from '../../builder/QueryBuilder';
import { Message as TMessage } from './message.interface';
import { Message } from './message.module';

const createMessage = async (message: TMessage) => {
  const newMwssage = await Message.create(message);
  return newMwssage;
};

const getMyAllmessge = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const allMessage = new QueryBuilder(
    Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] }),
    query,
  )
    .sort()
    .paginate()
    .fields();

  const result = await allMessage.modelQuery;
  const meta = await allMessage.countTotal();

  return {
    result,
    meta,
  };
};

export const MessageSerivce = {
  createMessage,
  getMyAllmessge,
};

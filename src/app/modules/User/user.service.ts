/* eslint-disable no-unused-vars */

import status from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Tuser } from './user.interface';
import { User } from './user.model';
import { StatusCodes } from 'http-status-codes';

const createUserDB = async (payload: Tuser) => {
  const existsUser = await User.isUserExistsByEmail(payload.email);
  if (existsUser) {
    throw new AppError(StatusCodes.CONFLICT, 'The account already exists');
  }
  const user = await User.create(payload);
  return user;
};

const getAlluserDB = async (query: Record<string, unknown>) => {
  const userQeuery = new QueryBuilder(User.find(), query)
    .search(['name', 'price', 'company', 'size'])
    .filter()
    .sort()
    .paginate();

  const result = await userQeuery.modelQuery;
  const meta = await userQeuery.countTotal();
  return { result, meta };
};

const singleUserBD = async (email: string) => {
  const reuslt = await User.findOne({ email });
  if (!reuslt) {
    throw new AppError(status.NOT_FOUND, 'This user Not found');
  }
  return reuslt;
};

export const UserServices = {
  createUserDB,
  getAlluserDB,
  singleUserBD,
};

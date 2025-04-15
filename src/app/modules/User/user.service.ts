import { IUser } from './user.interface';
import User from './user.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { UserSearchableFields } from './user.constant';

import { AuthService } from '../auth/auth.service';
import { IJwtPayload } from '../auth/auth.interface';
import { generateId } from './user.utils';

const registerUser = async (userData: IUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(
      StatusCodes.NOT_ACCEPTABLE,
      'Email is already registered',
    );
  }

  userData.userid = generateId();
  //  console.log(userData);
  const user = new User(userData);
  const createdUser = await user.save();

  return AuthService.loginUser({
    email: createdUser.email,
    password: userData.password,
  });
};

const getAllUser = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await UserQuery.modelQuery;
  const meta = await UserQuery.countTotal();
  return {
    result,
    meta,
  };
};

const updateProfile = async (
  payload: Partial<IUser>,
  authUser: IJwtPayload,
) => {
  const isUserExists = await User.findById(authUser.userId);

  console.log(authUser.userId);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  console.log(isUserExists);
  const result = await User.findByIdAndUpdate(authUser.userId, payload, {
    new: true,
  });
  console.log(result);
  return result;
};

const myProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser.userId);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }

  const profile = await User.findOne({ user: isUserExists._id });

  return {
    ...isUserExists.toObject(),
    profile: profile || null,
  };
};

export const UserServices = {
  registerUser,
  getAllUser,
  updateProfile,
  myProfile,
};

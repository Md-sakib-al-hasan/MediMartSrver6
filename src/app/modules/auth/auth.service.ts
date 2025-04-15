import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import User from '../user/user.model';
import { IAuth, IJwtPayload, TExpiresIn } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import mongoose from 'mongoose';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: IAuth) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findOne({ email: payload.email }).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found!');
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Password does not match');
    }

    const jwtPayload: IJwtPayload = {
      userId: user._id as string,
      name: user.name as string,
      email: user.email as string,
      isActive: user.isActive,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as TExpiresIn,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as TExpiresIn,
    );

    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch (err) {
    console.error(err);
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User does not exist');
  }

  if (!isUserExist.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active');
  }

  const jwtPayload: IJwtPayload = {
    userId: isUserExist._id as string,
    name: isUserExist.name as string,
    email: isUserExist.email as string,
    isActive: isUserExist.isActive,
    role: isUserExist.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as TExpiresIn,
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};

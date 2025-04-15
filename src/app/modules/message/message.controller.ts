import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtPayload } from '../auth/auth.interface';
import { MessageSerivce } from './message.services';

const getAllMesage = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IJwtPayload).userId;
  const result = await MessageSerivce.getMyAllmessge(userId, req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Coupon fetched successfully',
    data: result,
  });
});

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await MessageSerivce.createMessage(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

export const MessageController = {
  getAllMesage,
  createMessage,
};

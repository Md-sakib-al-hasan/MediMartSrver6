import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { CategoryService } from './category.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { IJwtPayload } from '../auth/auth.interface';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(
    req.body,
    req.user as IJwtPayload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category created succesfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategory(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
};

import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import { IBrand } from './brand.interface';
import { Brand } from './brand.model';

const createBrand = async (
  brandData: Partial<IBrand>,
  authUser: IJwtPayload,
) => {
  const oldBrand = await Brand.findOne({ name: brandData.name });
  if (oldBrand) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Brand already exist');
  }

  const brand = new Brand({
    ...brandData,
    createdBy: authUser.userId,
  });

  const result = await brand.save();

  return result;
};

const getAllBrand = async (query: Record<string, unknown>) => {
  const brandQuery = new QueryBuilder(Brand.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await brandQuery.modelQuery;
  const meta = await brandQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const BrandService = {
  createBrand,
  getAllBrand,
};

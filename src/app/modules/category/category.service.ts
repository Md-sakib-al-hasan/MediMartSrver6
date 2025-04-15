import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategory = async (
  categoryData: Partial<ICategory>,
  authUser: IJwtPayload,
) => {
  const oldcategory = await Category.findOne({ name: categoryData.name });
  if (oldcategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category already exist');
  }

  const category = new Category({
    ...categoryData,
    createdBy: authUser.userId,
  });

  const result = await category.save();

  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(['name', 'slug'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const CategoryService = {
  createCategory,
  getAllCategory,
};

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IProduct } from './product.interface';
import { Category } from '../category/category.model';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';

import { generateId } from './product.utils';

const createProduct = async (productData: Partial<IProduct>) => {
  const isCategoryExists = await Category.findById(productData.category);
  if (!isCategoryExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category does not exist!');
  }

  if (!isCategoryExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Category is not active!');
  }

  const newProduct = new Product({
    ...productData,
    medicineId: generateId(),
  });

  const result = await newProduct.save();
  return result;
};

const getAllProduct = async (query: Record<string, unknown>) => {
  const { minPrice, maxPrice, ...pQuery } = query;

  const productQuery = new QueryBuilder(
    Product.find().populate('category', 'name').populate('brand', 'name'),
    pQuery,
  )
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

  const result = await productQuery.modelQuery;

  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProduct = async (productId: string) => {
  const product = await Product.findById(productId).populate('brand category');

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (!product.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Product is not active');
  }

  const productObj = product.toObject();

  return productObj;
};

const updateProduct = async (productId: string, payload: Partial<IProduct>) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product Not Found');
  }

  return await Product.findByIdAndUpdate(productId, payload, { new: true });
};

const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product Not Found');
  }

  return await Product.findByIdAndDelete(productId);
};

export const ProductService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

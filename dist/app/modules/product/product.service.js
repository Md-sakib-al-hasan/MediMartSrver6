"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const category_model_1 = require("../category/category.model");
const product_model_1 = require("./product.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_utils_1 = require("./product.utils");
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.Category.findById(productData.category);
    if (!isCategoryExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category does not exist!');
    }
    if (!isCategoryExists.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category is not active!');
    }
    const newProduct = new product_model_1.Product(Object.assign(Object.assign({}, productData), { medicineId: (0, product_utils_1.generateId)() }));
    const result = yield newProduct.save();
    return result;
});
const getAllProduct = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice } = query, pQuery = __rest(query, ["minPrice", "maxPrice"]);
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find().populate('category', 'name').populate('brand', 'name'), pQuery)
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return {
        meta,
        result,
    };
});
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId).populate('brand category');
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product not found');
    }
    if (!product.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Product is not active');
    }
    const productObj = product.toObject();
    return productObj;
});
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product Not Found');
    }
    return yield product_model_1.Product.findByIdAndUpdate(productId, payload, { new: true });
});
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(productId);
    if (!product) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Product Not Found');
    }
    return yield product_model_1.Product.findByIdAndDelete(productId);
});
exports.ProductService = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};

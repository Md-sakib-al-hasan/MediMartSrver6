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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const category_model_1 = require("./category.model");
const createCategory = (categoryData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const oldcategory = yield category_model_1.Category.findOne({ name: categoryData.name });
    if (oldcategory) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Category already exist');
    }
    const category = new category_model_1.Category(Object.assign(Object.assign({}, categoryData), { createdBy: authUser.userId }));
    const result = yield category.save();
    return result;
});
const getAllCategory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = new QueryBuilder_1.default(category_model_1.Category.find(), query)
        .search(['name', 'slug'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield categoryQuery.modelQuery;
    const meta = yield categoryQuery.countTotal();
    return {
        meta,
        result,
    };
});
exports.CategoryService = {
    createCategory,
    getAllCategory,
};

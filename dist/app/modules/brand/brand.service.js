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
exports.BrandService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appError_1 = __importDefault(require("../../errors/appError"));
const brand_model_1 = require("./brand.model");
const createBrand = (brandData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const oldBrand = yield brand_model_1.Brand.findOne({ name: brandData.name });
    if (oldBrand) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Brand already exist');
    }
    const brand = new brand_model_1.Brand(Object.assign(Object.assign({}, brandData), { createdBy: authUser.userId }));
    const result = yield brand.save();
    return result;
});
const getAllBrand = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const brandQuery = new QueryBuilder_1.default(brand_model_1.Brand.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield brandQuery.modelQuery;
    const meta = yield brandQuery.countTotal();
    return {
        meta,
        result,
    };
});
exports.BrandService = {
    createBrand,
    getAllBrand,
};

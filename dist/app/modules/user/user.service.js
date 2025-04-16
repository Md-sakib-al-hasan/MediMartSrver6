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
exports.UserServices = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_constant_1 = require("./user.constant");
const auth_service_1 = require("../auth/auth.service");
const user_utils_1 = require("./user.utils");
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    const existingUser = yield user_model_1.default.findOne({ email: userData.email });
    if (existingUser) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, 'Email is already registered');
    }
    userData.userid = (0, user_utils_1.generateId)();
    //  console.log(userData);
    const user = new user_model_1.default(userData);
    const createdUser = yield user.save();
    return auth_service_1.AuthService.loginUser({
        email: createdUser.email,
        password: userData.password,
    });
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const UserQuery = new QueryBuilder_1.default(user_model_1.default.find(), query)
        .search(user_constant_1.UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield UserQuery.modelQuery;
    const meta = yield UserQuery.countTotal();
    return {
        result,
        meta,
    };
});
const updateProfile = (payload, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.default.findById(authUser.userId);
    console.log(authUser.userId);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    console.log(isUserExists);
    const result = yield user_model_1.default.findByIdAndUpdate(authUser.userId, payload, {
        new: true,
    });
    console.log(result);
    return result;
});
const myProfile = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.default.findById(authUser.userId);
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    if (!isUserExists.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not active!');
    }
    const profile = yield user_model_1.default.findOne({ user: isUserExists._id });
    return Object.assign(Object.assign({}, isUserExists.toObject()), { profile: profile || null });
});
exports.UserServices = {
    registerUser,
    getAllUser,
    updateProfile,
    myProfile,
};

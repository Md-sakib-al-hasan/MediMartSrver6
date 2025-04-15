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
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.default.findOne({ email: payload.email }).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found!');
        }
        if (!(yield user_model_1.default.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Password does not match');
        }
        const jwtPayload = {
            userId: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            role: user.role,
        };
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
        yield session.commitTransaction();
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        console.error(err);
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
    }
    const { userId } = verifiedToken;
    const isUserExist = yield user_model_1.default.findById(userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User does not exist');
    }
    if (!isUserExist.isActive) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not active');
    }
    const jwtPayload = {
        userId: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        isActive: isUserExist.isActive,
        role: isUserExist.role,
    };
    const newAccessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AuthService = {
    loginUser,
    refreshToken,
};

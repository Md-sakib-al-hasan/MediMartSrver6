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
exports.SSLController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sslcommerz_service_1 = require("./sslcommerz.service");
const config_1 = __importDefault(require("../../config"));
const validatePaymentService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tran_id = req.query.tran_id;
    const result = yield sslcommerz_service_1.sslService.validatePaymentService(tran_id);
    console.log(result);
    if (result) {
        res.redirect(301, config_1.default.ssl.success_url);
    }
    else {
        res.redirect(301, config_1.default.ssl.failed_url);
    }
}));
exports.SSLController = {
    validatePaymentService,
};

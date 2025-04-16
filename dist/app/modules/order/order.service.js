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
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const coupon_model_1 = require("../coupon/coupon.model");
const order_model_1 = require("./order.model");
const product_model_1 = require("../product/product.model");
const payment_model_1 = require("../payment/payment.model");
const payment_utils_1 = require("../payment/payment.utils");
const sslcommerz_service_1 = require("../sslcommerz/sslcommerz.service");
const emailHelper_1 = require("../../utils/emailHelper");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createOrder = (orderData, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (orderData.products) {
            for (const productItem of orderData.products) {
                const product = yield product_model_1.Product.findById(productItem.product).session(session);
                if (product) {
                    if (product.isActive === false) {
                        throw new Error(`Product ${product === null || product === void 0 ? void 0 : product.name} is inactive.`);
                    }
                    if (product.stock < productItem.quantity) {
                        throw new Error(`Insufficient stock for product: ${product.name}`);
                    }
                    // Decrement the product stock
                    product.stock -= productItem.quantity;
                    yield product.save({ session });
                }
                else {
                    throw new Error(`Product not found: ${productItem.product}`);
                }
            }
        }
        // Handle coupon and update orderData
        if (orderData.coupon) {
            const coupon = yield coupon_model_1.Coupon.findOne({ code: orderData.coupon }).session(session);
            if (coupon) {
                const currentDate = new Date();
                // Check if the coupon is within the valid date range
                if (currentDate < coupon.startDate) {
                    throw new Error(`Coupon ${coupon.code} has not started yet.`);
                }
                if (currentDate > coupon.endDate) {
                    throw new Error(`Coupon ${coupon.code} has expired.`);
                }
                orderData.coupon = coupon._id;
            }
            else {
                throw new Error('Invalid coupon code.');
            }
        }
        // Create the order
        const order = new order_model_1.Order(Object.assign(Object.assign({}, orderData), { user: authUser.userId }));
        const createdOrder = yield order.save({ session });
        yield createdOrder.populate('user products.product');
        const transactionId = (0, payment_utils_1.generateTransactionId)();
        const payment = new payment_model_1.Payment({
            userId: authUser.userId,
            order: createdOrder._id,
            method: orderData.paymentMethod,
            transactionId,
            amount: createdOrder.finalAmount,
        });
        yield payment.save({ session });
        let result;
        if (createdOrder.paymentMethod == 'Online') {
            result = yield sslcommerz_service_1.sslService.initPayment({
                total_amount: createdOrder.finalAmount,
                tran_id: transactionId,
            });
            result = { paymentUrl: result };
        }
        else {
            result = order;
        }
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        console.log(error);
        // Rollback the transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getOrderDetails = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId).populate('user products.product coupon');
    if (!order) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not Found');
    }
    order.payment = yield payment_model_1.Payment.findOne({ order: order._id });
    return order;
});
const getMyOrders = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.Order.find({ user: authUser.userId }).populate('user products.product coupon'), query)
        .search(['user.name', 'user.email', 'products.product.name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const meta = yield orderQuery.countTotal();
    return {
        meta,
        result,
    };
});
const changeOrderStatus = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (status === 'cancelled') {
            const PaymentDetails = yield payment_model_1.Payment.findOne({ order: orderId })
                .populate('userId')
                .session(session);
            if (!PaymentDetails) {
                throw new Error('Payment not found');
            }
            const refundResponse = yield sslcommerz_service_1.sslService.refundPayment(PaymentDetails.transactionId, PaymentDetails.amount, 'cancel your order');
            if (refundResponse.status === 'SUCCESS') {
                yield payment_model_1.Payment.findOneAndUpdate({ transactionId: PaymentDetails.transactionId }, { status: 'Refunded' }, { new: true, session });
                const emailContent = yield emailHelper_1.EmailHelper.createEmailContent({
                    userName: PaymentDetails.userId.name || '',
                }, 'orderCancle');
                yield emailHelper_1.EmailHelper.sendEmail(PaymentDetails.userId
                    .email, emailContent, 'Order cancle!');
            }
            else {
                throw new Error('Refund failed');
            }
        }
        const order = yield order_model_1.Order.findOneAndUpdate({ _id: orderId }, { status }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return order;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.OrderService = {
    createOrder,
    getOrderDetails,
    getMyOrders,
    changeOrderStatus,
};

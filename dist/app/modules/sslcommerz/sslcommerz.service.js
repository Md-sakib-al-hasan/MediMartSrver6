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
exports.sslService = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const payment_model_1 = require("../payment/payment.model");
const order_model_1 = require("../order/order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const generateOrderInvoicePDF_1 = require("../../utils/generateOrderInvoicePDF");
const emailHelper_1 = require("../../utils/emailHelper");
const store_id = config_1.default.ssl.store_id;
const store_passwd = config_1.default.ssl.store_pass;
const is_live = false; // true for live, false for sandbox
// SSLCommerz init
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { total_amount, tran_id } = paymentData;
    const data = {
        total_amount,
        currency: 'BDT',
        tran_id,
        success_url: `${config_1.default.ssl.validation_url}?tran_id=${tran_id}`,
        fail_url: config_1.default.ssl.failed_url,
        cancel_url: config_1.default.ssl.cancel_url,
        ipn_url: 'http://next-mart-steel.vercel.app/api/v1/ssl/ipn',
        shipping_method: 'Courier',
        product_name: 'N/A.',
        product_category: 'N/A',
        product_profile: 'general',
        cus_name: 'N/A',
        cus_email: 'N/A',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'N/A',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    try {
        const apiResponse = yield sslcz.init(data);
        // Redirect the user to the payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;
        if (GatewayPageURL) {
            return GatewayPageURL;
        }
        else {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, 'Failed to generate payment gateway URL.');
        }
    }
    catch (error) {
        console.log(error);
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An error occurred while processing payment.');
    }
});
// const validatePaymentService = async (tran_id: string): Promise<boolean> => {
//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const validationResponse= await sslcz.transactionQueryByTransactionId({
//       tran_id,
//     });
//     console.log(validationResponse.element);
//     let data;
//     if (
//       validationResponse.element[0].status === 'VALID' ||
//       validationResponse.element[0].status === 'VALIDATED'
//     ) {
//       data = {
//         status: 'Paid',
//         gatewayResponse: validationResponse.element[0],
//       };
//     } else if (validationResponse.element[0].status === 'INVALID_TRANSACTION') {
//       data = {
//         status: 'Failed',
//         gatewayResponse: validationResponse.element[0],
//       };
//     } else {
//       data = {
//         status: 'Failed',
//         gatewayResponse: validationResponse.element[0],
//       };
//     }
//     const updatedPayment = await Payment.findOneAndUpdate(
//       { transactionId: validationResponse.element[0].tran_id },
//       data,
//       { new: true, session },
//     );
//     if (!updatedPayment) {
//       throw new Error('Payment not updated');
//     }
//     const updatedOrder = await Order.findByIdAndUpdate(
//       updatedPayment?.order,
//       {
//         paymentStatus: data.status,
//       },
//       { new: true, session },
//     ).populate('user products.product');
//     if (!updatedOrder) {
//       throw new Error('Order not updated');
//     }
//     if (data.status === 'Failed') {
//       throw new Error('Payment failed');
//     }
//     // Commit transaction only if no errors occurred
//     await session.commitTransaction();
//     session.endSession();
//     console.log('email');
//     const pdfBuffer = await generateOrderInvoicePDF(updatedOrder);
//     const emailContent = await EmailHelper.createEmailContent(
//       {
//         userName: (updatedOrder.user as unknown as { name: string }).name || '',
//       },
//       'orderInvoice',
//     );
//     const attachment = {
//       filename: `Invoice_${updatedOrder._id}.pdf`,
//       content: pdfBuffer,
//       encoding: 'base64',
//     };
//     await EmailHelper.sendEmail(
//       (updatedOrder.user as unknown as { email: string }).email,
//       emailContent,
//       'Order confirmed-Payment Success!',
//       attachment,
//     );
//     return true;
//   } catch (error) {
//     // Only abort the transaction if an error occurred
//     await session.abortTransaction();
//     session.endSession();
//     console.error(error); // Log the error for debugging
//     return false;
//   }
// };
const validatePaymentService = (tran_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const validationResponse = (yield sslcz.transactionQueryByTransactionId({
            tran_id,
        })); // Cast the response to your defined type
        const responseElement = (_a = validationResponse === null || validationResponse === void 0 ? void 0 : validationResponse.element) === null || _a === void 0 ? void 0 : _a[0];
        if (!responseElement) {
            throw new Error('Invalid or missing transaction data');
        }
        let data;
        if (responseElement.status === 'VALID' ||
            responseElement.status === 'VALIDATED') {
            data = {
                status: 'Paid',
                gatewayResponse: responseElement,
            };
        }
        else {
            data = {
                status: 'Failed',
                gatewayResponse: responseElement,
            };
        }
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: responseElement.tran_id }, data, { new: true, session });
        if (!updatedPayment) {
            throw new Error('Payment not updated');
        }
        const updatedOrder = yield order_model_1.Order.findByIdAndUpdate(updatedPayment.order, { paymentStatus: data.status }, { new: true, session }).populate('user products.product');
        if (!updatedOrder) {
            throw new Error('Order not updated');
        }
        if (data.status === 'Failed') {
            throw new Error('Payment failed');
        }
        yield session.commitTransaction();
        session.endSession();
        const pdfBuffer = yield (0, generateOrderInvoicePDF_1.generateOrderInvoicePDF)(updatedOrder);
        const emailContent = yield emailHelper_1.EmailHelper.createEmailContent({
            userName: updatedOrder.user.name || '',
        }, 'orderInvoice');
        const attachment = {
            filename: `Invoice_${updatedOrder._id}.pdf`,
            content: pdfBuffer,
            encoding: 'base64',
        };
        yield emailHelper_1.EmailHelper.sendEmail(updatedOrder.user.email, emailContent, 'Order confirmed - Payment Success!', attachment);
        return true;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error('Payment validation error:', error);
        return false;
    }
});
const refundPayment = (tran_id, refund_amount, refund_remarks) => __awaiter(void 0, void 0, void 0, function* () {
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    try {
        const refundResponse = yield sslcz.refundTransaction({
            refund_amount,
            tran_id,
            refund_remarks,
        });
        return refundResponse;
    }
    catch (error) {
        console.error('Refund error:', error);
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Refund process failed.');
    }
});
exports.sslService = {
    refundPayment,
    initPayment,
    validatePaymentService,
};

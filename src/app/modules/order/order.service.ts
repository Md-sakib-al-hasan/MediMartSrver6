import mongoose, { Types } from 'mongoose';
import { IJwtPayload } from '../auth/auth.interface';
import { Coupon } from '../coupon/coupon.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Product } from '../product/product.model';
import { Payment } from '../payment/payment.model';
import { generateTransactionId } from '../payment/payment.utils';
import { sslService } from '../sslcommerz/sslcommerz.service';
import { EmailHelper } from '../../utils/emailHelper';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';

const createOrder = async (
  orderData: Partial<IOrder>,
  authUser: IJwtPayload,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (orderData.products) {
      for (const productItem of orderData.products) {
        const product = await Product.findById(productItem.product).session(
          session,
        );

        if (product) {
          if (product.isActive === false) {
            throw new Error(`Product ${product?.name} is inactive.`);
          }

          if (product.stock < productItem.quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }
          // Decrement the product stock
          product.stock -= productItem.quantity;
          await product.save({ session });
        } else {
          throw new Error(`Product not found: ${productItem.product}`);
        }
      }
    }

    // Handle coupon and update orderData
    if (orderData.coupon) {
      const coupon = await Coupon.findOne({ code: orderData.coupon }).session(
        session,
      );
      if (coupon) {
        const currentDate = new Date();

        // Check if the coupon is within the valid date range
        if (currentDate < coupon.startDate) {
          throw new Error(`Coupon ${coupon.code} has not started yet.`);
        }

        if (currentDate > coupon.endDate) {
          throw new Error(`Coupon ${coupon.code} has expired.`);
        }

        orderData.coupon = coupon._id as Types.ObjectId;
      } else {
        throw new Error('Invalid coupon code.');
      }
    }

    // Create the order
    const order = new Order({
      ...orderData,
      user: authUser.userId,
    });

    const createdOrder = await order.save({ session });
    await createdOrder.populate('user products.product');

    const transactionId = generateTransactionId();

    const payment = new Payment({
      userId: authUser.userId,
      order: createdOrder._id,
      method: orderData.paymentMethod,
      transactionId,
      amount: createdOrder.finalAmount,
    });

    await payment.save({ session });

    let result;

    if (createdOrder.paymentMethod == 'Online') {
      result = await sslService.initPayment({
        total_amount: createdOrder.finalAmount,
        tran_id: transactionId,
      });
      result = { paymentUrl: result };
    } else {
      result = order;
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    console.log(error);
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrderDetails = async (orderId: string) => {
  const order = await Order.findById(orderId).populate(
    'user products.product coupon',
  );
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Order not Found');
  }

  order.payment = await Payment.findOne({ order: order._id });
  return order;
};

const getMyOrders = async (
  query: Record<string, unknown>,
  authUser: IJwtPayload,
) => {
  const orderQuery = new QueryBuilder(
    Order.find({ user: authUser.userId }).populate(
      'user products.product coupon',
    ),
    query,
  )
    .search(['user.name', 'user.email', 'products.product.name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;

  const meta = await orderQuery.countTotal();

  return {
    meta,
    result,
  };
};

const changeOrderStatus = async (orderId: string, status: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (status === 'cancelled') {
      const PaymentDetails = await Payment.findOne({ order: orderId })
        .populate('userId')
        .session(session);

      if (!PaymentDetails) {
        throw new Error('Payment not found');
      }

      const refundResponse = await sslService.refundPayment(
        PaymentDetails.transactionId!,
        PaymentDetails.amount,
        'cancel your order',
      );

      if (refundResponse.status === 'SUCCESS') {
        await Payment.findOneAndUpdate(
          { transactionId: PaymentDetails.transactionId },
          { status: 'Refunded' },
          { new: true, session },
        );

        const emailContent = await EmailHelper.createEmailContent(
          {
            userName:
              (
                PaymentDetails.userId as unknown as {
                  name: string;
                  email: string;
                }
              ).name || '',
          },
          'orderCancle',
        );

        await EmailHelper.sendEmail(
          (PaymentDetails.userId as unknown as { name: string; email: string })
            .email,
          emailContent,
          'Order cancle!',
        );
      } else {
        throw new Error('Refund failed');
      }
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { status },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const OrderService = {
  createOrder,
  getOrderDetails,
  getMyOrders,
  changeOrderStatus,
};

import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';
import { Product } from '../product/product.model';
import { Coupon } from '../coupon/coupon.model';

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    OrderId: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'Online',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to calculate total, discount, delivery charge, and final price
orderSchema.pre('validate', async function (next) {
  // Use 'this' directly instead of aliasing to a variable
  let totalAmount = 0;
  let finalDiscount = 0;

  // Step 1: Calculate total product price
  for (const item of this.products) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new Error('Product not found!'));
    }

    const productPrice = product.price;
    item.unitPrice = productPrice;
    totalAmount += productPrice * item.quantity;
  }

  // Step 2: Handle coupon
  if (this.coupon) {
    const couponDetails = await Coupon.findById(this.coupon);

    if (couponDetails && couponDetails.isActive) {
      if (totalAmount >= couponDetails.minOrderAmount) {
        if (couponDetails.discountType === 'Percentage') {
          finalDiscount = Math.min(
            (couponDetails.discountValue / 100) * totalAmount,
            couponDetails.maxDiscountAmount ?? Infinity,
          );
        } else if (couponDetails.discountType === 'Flat') {
          finalDiscount = Math.min(couponDetails.discountValue, totalAmount);
        }
      }
    }
  }

  const isDhaka = this.shippingAddress?.toLowerCase().includes('dhaka');
  const deliveryCharge = isDhaka ? 60 : 120;

  // Final calculation
  this.totalAmount = totalAmount;
  this.discount = finalDiscount;
  this.deliveryCharge = deliveryCharge;
  this.finalAmount = totalAmount - finalDiscount + deliveryCharge;

  next();
});

export const Order = model<IOrder>('Order', orderSchema);

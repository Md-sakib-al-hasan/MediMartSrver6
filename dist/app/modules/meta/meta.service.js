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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const getChartData = () => __awaiter(void 0, void 0, void 0, function* () {
    const monthlySales = yield order_model_1.Order.aggregate([
        {
            $match: {
                status: 'Completed',
                createdAt: {
                    $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                totalSales: { $sum: '$finalAmount' },
            },
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1,
            },
        },
        {
            $project: {
                _id: 0,
                year: '$_id.year',
                month: '$_id.month',
                totalSales: 1,
            },
        },
    ]);
    const grandTotal = monthlySales.reduce((acc, curr) => acc + curr.totalSales, 0);
    const result = Array.from({ length: 12 }).map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const match = monthlySales.find((item) => item.year === year && item.month === month);
        const totalSales = match ? match.totalSales : 0;
        const percentage = grandTotal
            ? ((totalSales / grandTotal) * 100).toFixed(2)
            : '0.00';
        return {
            year,
            month,
            totalSales,
            percentage,
        };
    });
    return result;
});
const getOrderStatusPercentage = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalOrders = yield order_model_1.Order.countDocuments();
    if (totalOrders === 0) {
        return {
            totalOrders: 0,
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0,
        };
    }
    const [pendingCount, processingCount, completedCount, cancelledCount] = yield Promise.all([
        order_model_1.Order.countDocuments({ status: 'Pending' }),
        order_model_1.Order.countDocuments({ status: 'Processing' }),
        order_model_1.Order.countDocuments({ status: 'Completed' }),
        order_model_1.Order.countDocuments({ status: 'Cancelled' }),
    ]);
    const percentage = (count) => parseFloat(((count / totalOrders) * 100).toFixed(2));
    return {
        totalOrders,
        pendingCount,
        pending: percentage(pendingCount),
        processing: percentage(processingCount),
        completed: percentage(completedCount),
        cancelled: percentage(cancelledCount),
    };
});
const getTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const completedOrders = yield order_model_1.Order.find({
        status: 'Completed',
        paymentStatus: 'Paid',
    });
    const totalRevenue = completedOrders.reduce((sum, order) => {
        return sum + order.finalAmount;
    }, 0);
    return totalRevenue;
});
const getLastMonthOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthOrders = yield order_model_1.Order.countDocuments({
        createdAt: {
            $gte: firstDayOfLastMonth,
            $lt: firstDayOfThisMonth,
        },
    });
    return lastMonthOrders;
});
const lowStock = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield product_model_1.Product.countDocuments({ stock: { $lt: 10 } });
    return count;
});
const getMetaData = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        lowStock: lowStock,
        lastMonthOrders: getLastMonthOrders,
        totalRevenue: getTotalRevenue,
        chartData: getChartData,
        getOrderStatusPercentage,
    };
});
exports.MetaService = {
    getMetaData,
};

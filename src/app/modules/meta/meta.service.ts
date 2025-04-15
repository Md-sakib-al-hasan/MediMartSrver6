import { Order } from '../order/order.model';
import { Product } from '../product/product.model';

const getChartData = async () => {
  const monthlySales = await Order.aggregate([
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

  const grandTotal = monthlySales.reduce(
    (acc, curr) => acc + curr.totalSales,
    0,
  );

  const result = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const match = monthlySales.find(
      (item) => item.year === year && item.month === month,
    );

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
};

const getOrderStatusPercentage = async () => {
  const totalOrders = await Order.countDocuments();

  if (totalOrders === 0) {
    return {
      totalOrders: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  const [pendingCount, processingCount, completedCount, cancelledCount] =
    await Promise.all([
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Processing' }),
      Order.countDocuments({ status: 'Completed' }),
      Order.countDocuments({ status: 'Cancelled' }),
    ]);

  const percentage = (count: number) =>
    parseFloat(((count / totalOrders) * 100).toFixed(2));

  return {
    totalOrders,
    pendingCount,
    pending: percentage(pendingCount),
    processing: percentage(processingCount),
    completed: percentage(completedCount),
    cancelled: percentage(cancelledCount),
  };
};

const getTotalRevenue = async () => {
  const completedOrders = await Order.find({
    status: 'Completed',
    paymentStatus: 'Paid',
  });

  const totalRevenue = completedOrders.reduce((sum, order) => {
    return sum + order.finalAmount;
  }, 0);

  return totalRevenue;
};

const getLastMonthOrders = async () => {
  const now = new Date();
  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  );

  const lastMonthOrders = await Order.countDocuments({
    createdAt: {
      $gte: firstDayOfLastMonth,
      $lt: firstDayOfThisMonth,
    },
  });

  return lastMonthOrders;
};

const lowStock = async () => {
  const count = await Product.countDocuments({ stock: { $lt: 10 } });
  return count;
};

const getMetaData = async () => {
  return {
    lowStock: lowStock,
    lastMonthOrders: getLastMonthOrders,
    totalRevenue: getTotalRevenue,
    chartData: getChartData,
    getOrderStatusPercentage,
  };
};

export const MetaService = {
  getMetaData,
};

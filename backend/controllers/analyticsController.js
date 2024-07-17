import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModels.js";
import User from "../models/userModel.js";

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = asyncHandler(async (req, res) => {
  const totalSales = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const dailySales = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        total: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topSellingProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        totalSold: { $sum: "$orderItems.qty" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $project: {
        _id: 1,
        totalSold: 1,
        name: "$productInfo.name",
      },
    },
  ]);

  res.json({ totalSales, dailySales, topSellingProducts });
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const newUsersLastMonth = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
  });

  res.json({ totalUsers, newUsersLastMonth });
});

// @desc    Get highest reviewed product
// @route   GET /api/analytics/highest-reviewed
// @access  Private/Admin
const getHighestReviewedProduct = asyncHandler(async (req, res) => {
    const highestReviewedProduct = await Product.aggregate([
      { $match: { numReviews: { $gt: 0 } } }, // Only consider products with reviews
      { $sort: { rating: -1, numReviews: -1 } }, // Sort by rating (descending) and then by number of reviews (descending)
      { $limit: 5 }, // Get the top product
      {
        $project: {
          _id: 1,
          name: 1,
          rating: 1,
          numReviews: 1,
          price: 1,
          image: 1
        }
      }
    ]);
  
    if (highestReviewedProduct.length > 0) {
      res.json(highestReviewedProduct[0]);
    } else {
      res.status(404);
      throw new Error("No reviewed products found");
    }
  });
  
// @desc    Get order statistics
// @route   GET /api/analytics/orders
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalPaidOrders = await Order.countDocuments({ isPaid: true });
    const totalDeliveredOrders = await Order.countDocuments({ isDelivered: true });
    
    const averageOrderValue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, avg: { $avg: "$totalPrice" } } }
    ]);
  
    res.json({
      totalOrders,
      totalPaidOrders,
      totalDeliveredOrders,
      averageOrderValue: averageOrderValue[0]?.avg || 0
    });
  });
  
  // @desc    Get product statistics
  // @route   GET /api/analytics/products
  // @access  Private/Admin
  const getProductStats = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5 } });
    
    const categoryCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  
    res.json({
      totalProducts,
      lowStockProducts,
      categoryCounts
    });
  });
  
  export { 
    getSalesAnalytics, 
    getUserAnalytics, 
    getHighestReviewedProduct,
    getOrderStats,
    getProductStats
  };
  
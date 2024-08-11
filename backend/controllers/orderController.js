import asynchandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModels.js"

//@desc create new Order
//@route post /api/orders
//@access private
const addOrderItems = asynchandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  console.log('Incoming request headers:', req.headers);
  console.log('Authenticated user:', req.user);
  if (orderItems && orderItems.lenght === 0) {
    res.status(400);
    throw new Error("No order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//@desc get logged in user orders
//@route get /api/orders/myorders
//@access private
const getMyOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

//@desc get order by id
//@route get /api/orders/:id
//@access private
const getOrderById = asynchandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});


const updateProductQuantity = async (productId, quantityToReduce) => {
  const product = await Product.findById(productId);
  if (product) {
    product.countInStock = Math.max(0, product.countInStock - quantityToReduce);
    await product.save();
  }
};

const checkInventory = asynchandler(async (orderItems) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.qty) {
      throw new Error(`Product ${product.name} is out of stock`);
    }
  }
});

//@desc update order status to paid
//@route put /api/orders/:id/pay
//@access private/admin
const updateOrderToPaid = asynchandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if order is already paid to prevent double processing
    if (order.isPaid) {
      res.status(400);
      throw new Error('Order is already paid');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // Update product quantities
    for (const item of order.orderItems) {
      await updateProductQuantity(item.product, item.qty);
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@desc update order status to delivered
//@route get /api/orders/:id/pay
//@access private/admin
const updateOrderToDelivered = asynchandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
  }
});

//@desc get all orders
//@route get /api/orders/:id/pay
//@access private/admin
const getOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});


export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};

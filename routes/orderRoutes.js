const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

// Place an order
// POST /api/orders
router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({
        message: "Complete shipping address is required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      orderDate: new Date(),
      totalAmount,
      status: "Pending",
      shippingAddress,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.qty,
        priceAtPurchase: item.price,
      })),
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get logged-in user's orders
// GET /api/orders
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
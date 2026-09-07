const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


// ==========================================
// CREATE ORDER
// ==========================================

router.post("/", protect, async (req, res) => {
  try {

    const {
      items,
      shippingAddress
    } = req.body;


    // Check items
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }


    // Check shipping information
    if (
      !shippingAddress?.name ||
      !shippingAddress?.email ||
      !shippingAddress?.phone ||
      !shippingAddress?.address
    ) {
      return res.status(400).json({
        message: "Please provide complete shipping information"
      });
    }


    let orderItems = [];
    let totalAmount = 0;


    // Verify products from database
    for (const item of items) {

      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          message: "Invalid product ID"
        });
      }


      const product = await Product.findById(item.product);


      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }


      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} does not have enough stock`
        });
      }

const itemTotal = product.price * item.quantity;

totalAmount += itemTotal;

orderItems.push({
  product: product._id,
  quantity: item.quantity,
  price: product.price
});

// Decrease product stock
product.stock -= item.quantity;
await product.save();
    }


    // Shipping
    const shipping = 300;

    totalAmount += shipping;


    // Create order
    const order = await Order.create({

      user: req.user.id,

      items: orderItems,

      shippingAddress,

      totalAmount,

      status: "Pending"

    });


    res.status(201).json({
      message: "Order placed successfully",
      order
    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
// ==========================================
// GET MY ORDERS
// ==========================================

router.get("/my-orders", protect, async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user.id
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
// ==============================
// ADMIN - GET ALL ORDERS
// ==============================

router.get("/admin/all", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});
// ==============================
// ADMIN - UPDATE ORDER STATUS
// ==============================

router.put("/admin/:id/status", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required"
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;

import express from 'express';
import { db } from '../database/jsonDb.js';
import { protect, adminOnly, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Place a new order
// @access  Public (Optional Auth)
router.post('/', optionalProtect, async (req, res) => {
  try {
    const { items, total, addressDetails, paymentDetails } = req.body;

    if (!items || items.length === 0 || !total || !addressDetails || !paymentDetails) {
      return res.status(400).json({ success: false, message: 'Please provide items, total, address details, and payment details' });
    }

    const orderData = {
      userId: req.user ? req.user.id : null,
      customerName: req.user ? req.user.name : addressDetails.name,
      customerEmail: req.user ? req.user.email : 'guest@laxmi.com',
      items,
      total: parseFloat(total),
      addressDetails,
      paymentDetails,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const newOrder = await db.insertOne('orders', orderData);

    res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: 'Server error placing order' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await db.find('orders', { userId: req.user.id });
    // Sort by createdAt descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching your orders' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await db.getCollection('orders');
    // Sort by createdAt descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching all orders' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const orderExists = await db.findOne('orders', { id });
    if (!orderExists) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedOrder = await db.updateOne('orders', { id }, { status });

    res.json({ success: true, message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: 'Server error updating order status' });
  }
});

export default router;

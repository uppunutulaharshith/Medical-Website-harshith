import express from 'express';
import { db } from '../database/jsonDb.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (with search & filter options)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, search, minPrice, maxPrice } = req.query;
    let products = await db.getCollection('products');

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Filter by type (Rx / OTC)
    if (type) {
      products = products.filter(p => p.type === type);
    }

    // Search query
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        p.desc.toLowerCase().includes(term)
      );
    }

    // Price range filters
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = await db.findOne('products', { id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("Fetch Product Details Error:", error);
    res.status(500).json({ success: false, message: 'Server error fetching product details' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, type, price, brand, desc, image } = req.body;

    if (!name || !category || !type || !price) {
      return res.status(400).json({ success: false, message: 'Please provide name, category, type, and price' });
    }

    const newProduct = await db.insertOne('products', {
      name,
      category,
      type,
      price: parseFloat(price),
      brand: brand || 'Generic',
      desc: desc || '',
      image: image || ''
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, category, type, price, brand, desc, image } = req.body;

    const productExists = await db.findOne('products', { id });
    if (!productExists) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (category) updateFields.category = category;
    if (type) updateFields.type = type;
    if (price !== undefined) updateFields.price = parseFloat(price);
    if (brand) updateFields.brand = brand;
    if (desc !== undefined) updateFields.desc = desc;
    if (image !== undefined) updateFields.image = image;

    const updatedProduct = await db.updateOne('products', { id }, updateFields);

    res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const productExists = await db.findOne('products', { id });
    if (!productExists) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const deleted = await db.deleteOne('products', { id });
    if (deleted) {
      res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Could not delete product' });
    }
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

export default router;

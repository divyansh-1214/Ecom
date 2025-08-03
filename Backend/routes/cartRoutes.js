const express = require('express');
const router = express.Router();
const Cart = require('../model/cart');

// Add or update product in cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity, selectedSize, selectedColor, price } = req.body;
  // Basic validation
  if (!userId || !productId || !quantity || !selectedSize || !selectedColor || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart if not exists
      cart = new Cart({
        userId,
        items: [{ productId, quantity, selectedSize, selectedColor, price }]
      });
    } else {
      // Check if the item already exists in the cart with same size & color
      const item = cart.items.find(
        i =>
          i.productId.toString() === productId.toString() &&
          i.selectedSize === selectedSize &&
          i.selectedColor === selectedColor
      );

      if (item) {
        // Update quantity
        item.quantity += Number(quantity);
      } else {
        // Add new item
        cart.items.push({ productId, quantity, selectedSize, selectedColor, price });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added/updated in cart', cart });

  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ error: 'Failed to add item to cart', details: err.message });
  }
});


// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item', details: err.message });
  }
});

// Update quantity of a cart item
router.put('/update-quantity', async (req, res) => {
  const { userId, productId, selectedSize, selectedColor, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find(
      i => i.productId.toString() === productId &&
           i.selectedSize === selectedSize &&
           i.selectedColor === selectedColor
    );

    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    item.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity', details: err.message });
  }
});

// Clear cart
router.post('/clear', async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
});

// Get cart by userId
router.get('/get/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
});

module.exports = router;

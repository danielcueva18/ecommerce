const express = require ('express');
const cartsRepo = require('../repositories/carts')

const router = express.Router();

// receive a post request to add an item to a cart
router.post('/cart/products', async (req, res) => {
    // figure out the cart
    let cart;
    if (!req.session.cartId) {
        // We don't have a cart, we need to create one
        // and store the cart id on the req.session
        cart = await cartsRepo.create({items: []})
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId)
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId)
    if (existingItem) {
        // increment and save on cart
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1})
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });
    res.send('Product added to cart');
})

module.exports = router;
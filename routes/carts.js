const express = require ('express');

const router = express.Router();

// receive a post request to add an item to a cart
router.post('/cart/products', (req, res) => {
    console.log(req.body.productId);

    res.send('Product added to cart');
})

module.exports = router;
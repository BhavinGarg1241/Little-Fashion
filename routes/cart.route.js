const express = require('express');
const router = express.Router();
const {
    addProductToCart,
    increaseQuantity,
    decreaseQuantity,
    removeProductFromCart,
    emptyCart
} = require('../controllers/cartController')
const { checkAuth } = require('../middlewares/authMiddleware')

//Add product to cart
router.post('/add/:productId', checkAuth, addProductToCart);

//To increase quantity by one in cart
router.get('/increaseQuantity/:productId', checkAuth, increaseQuantity);

//To decrease quantity by one in cart
router.get('/decreaseQuantity/:productId', checkAuth, decreaseQuantity);

//To remove product from cart
router.get('/removeFromCart/:productId', checkAuth, removeProductFromCart)

//To empty cart
router.get('/emptyCart',checkAuth,emptyCart);

module.exports = router;
const express = require('express');
const router = express.Router();
const { checkAuth,checkCart, checkOrderStatus } = require('../middlewares/authMiddleware');
const { addAddress } = require('../controllers/profileController');
const { changeDefaultBillAddress, changeDefaultShipAddress, placeOrder,orderConfirmed, cancelOrder } = require('../controllers/checkoutController');
const { addressValidation } = require('../middlewares/handleAddressForm');
const { validate } = require('../middlewares/handleFormData');


//To add address while checking out
router.post('/add_address', checkAuth, addressValidation, validate, addAddress);

//To change default billing address
router.post('/select_billAddress', checkAuth, changeDefaultBillAddress);

//To change default billing address
router.post('/select_shipAddress', checkAuth, changeDefaultShipAddress);

//To place order
router.get('/place_order/:id', checkAuth,checkCart, placeOrder);

//Order Confirmation Page
router.get('/order_confirmed/:id',checkAuth,orderConfirmed);

//Cancel Order
router.get('/cancel_order/:id',checkAuth,checkOrderStatus,cancelOrder);

module.exports = router;
const express= require('express');
const router = express.Router();
const {chargeCustomerProfile} = require('../controllers/paymentController');
const { checkAuth } = require('../middlewares/authMiddleware');
const { paymentValidation } = require('../middlewares/handlePaymentValidations');
const { validate } = require('../middlewares/handleAuthForm');

//Payment Route
router.post('/',checkAuth,paymentValidation,validate,chargeCustomerProfile);

module.exports = router;
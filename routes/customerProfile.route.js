const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middlewares/authMiddleware');
const { cardValidation } = require('../middlewares/handleCardDetails');
const { validate } = require('../middlewares/handleAuthForm');
const {createCustomerProfile,createCustomerPaymentProfile,deleteCustomerPaymentProfile} = require('../controllers/customerProfile');

//Add first card and create customer profile
router.post('/add_profile',checkAuth,cardValidation,validate,createCustomerProfile);

//Customer profile already exists and to add cards
router.post('/add_payment_profile',checkAuth,cardValidation,validate,createCustomerPaymentProfile);

//To delete existing cards
router.post('/delete_card',checkAuth,deleteCustomerPaymentProfile);

module.exports = router;
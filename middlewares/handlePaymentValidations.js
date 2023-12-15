const { body, validationResult } = require('express-validator');

//o check user has selected a credit card
const paymentValidation = [
    body('creditCard').notEmpty().withMessage('Credit Card is required'),
]

module.exports = {paymentValidation};
const { body, validationResult } = require('express-validator');

//To validate card details while adding cards
const cardValidation = [
    body('cc').notEmpty().withMessage('Card Number is required').matches(/[0-9\s]{12,19}/).withMessage('Please enter valid card number'),
    body('exp').notEmpty().withMessage('Please enter expiration date (MMYY)').matches(/^(0[1-9]|1[0-2])(\d{2})$/).withMessage('Please enter date in format of MMYY'),
]

module.exports = {cardValidation};
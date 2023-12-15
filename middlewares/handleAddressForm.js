const { body, validationResult } = require('express-validator');

// Validation array for change password form data
const addressValidation = [
    body('fullname').notEmpty().withMessage('Full Name is required'),
    body('hno').notEmpty().withMessage('House No. is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').notEmpty().withMessage('Pin Code is required').isNumeric().withMessage('Pin Code must be a number').isLength({ min: 6, max: 6 }).withMessage('Pin Code must be a 6-digit number'),
    body('address_type').notEmpty().withMessage('Address Type is required')
];


module.exports = { addressValidation };
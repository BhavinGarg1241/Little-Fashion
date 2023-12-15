const { body, validationResult } = require('express-validator');

// Validation array for signup form data
const signupValidation = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invaid Email Format'),
    body('password').trim().notEmpty().withMessage('Password is required').matches('[0-9a-zA-Z]{4,10}').withMessage('Should include only 0-9 a-z A-Z in 4 to 10 characters'),
    body('confirm_password').trim().notEmpty().matches('[0-9a-zA-Z]{4,10}').withMessage('Password does not match the password').custom(async (confirmPassword, { req }) => {
        const password = req.body.password
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('Passwords must be same')
        }
    }),
];

// Validation array for login form data
const loginValidation = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invaid Email Format'),
    body('password').trim().notEmpty().withMessage('Password is required').matches('[0-9a-zA-Z]{4,10}').withMessage('Should include only 0-9 a-z A-Z in 4 to 10 characters'),
];


// For handling validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map((error) => extractedErrors.push({ [error.param]: error.msg }));

    return res.status(500).json({
        errors: extractedErrors,
    });

}; //Used at various points

module.exports = { signupValidation, loginValidation, validate };
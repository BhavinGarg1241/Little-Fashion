const { body, validationResult } = require('express-validator');

// Validation array for change password form data
const changePasswordValidation = [
    body('newPassword').trim().notEmpty().withMessage('Password is required').matches('[0-9a-zA-Z]{4,10}').withMessage('Should include only 0-9 a-z A-Z in 4 to 10 characters'),
    body('confirm_password').trim().notEmpty().matches('[0-9a-zA-Z]{4,10}').withMessage('Password does not match the password').custom(async (confirmPassword, { req }) => {
        const password = req.body.newPassword
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('Passwords must be same')
        }
    }),
];

//To validate email used to get reset password link
const resetPasswordEmailValidation = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invaid Email Format'),
]

module.exports = { changePasswordValidation,resetPasswordEmailValidation };
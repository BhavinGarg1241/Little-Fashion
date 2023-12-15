const express = require('express');
const router = express.Router();
const { registerUser, changePassword, initiateResetPassword, resetPassword } = require('../controllers/authController');
const { authenticate, checkAuth, checkNotAuth } = require('../middlewares/authMiddleware');
const { loginValidation, signupValidation, validate } = require('../middlewares/handleAuthForm')
const { changePasswordValidation, resetPasswordEmailValidation } = require('../middlewares/handleChangePasswordForms');

//To add user
router.post('/register', checkNotAuth, signupValidation, validate, registerUser)

//To login
router.post('/login', checkNotAuth, loginValidation, validate, authenticate)

//To change password
router.post('/change_password', checkAuth, changePasswordValidation, validate, changePassword)

//To change password
router.post('/forgot_password', checkNotAuth, resetPasswordEmailValidation, validate, initiateResetPassword)

//To reset password
router.post('/reset_password', checkNotAuth, changePasswordValidation, validate, resetPassword)

//To logout
router.get('/logout', (req, res) => {
    req.logout((err) => console.log(err));
    res.redirect('/login')
})

module.exports = router;
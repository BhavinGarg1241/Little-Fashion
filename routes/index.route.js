const express = require('express');
const router = express.Router();
const { productValidation, validate, uploadImage } = require('../middlewares/handleFormData');
const {
    homePage,
    aboutPage,
    loginPage,
    signUpPage,
    productsPage,
    addProductsPage,
    faqsPage,
    getProductDetails,
    saveProduct,
    profilePage,
    forbiddenPage,
    initiateResetPasswordPage,
    changePasswordPage,
    resetPasswordPage,
    invalidToken,
    cartPage,
    checkoutPage,
    orderDetailsPage
} = require('../controllers/indexController')
const { checkAuth, checkNotAuth, checkRole, checkCart, checkResetToken } = require('../middlewares/authMiddleware')

//Home Page
router.get('/', checkAuth, homePage);

//Products Page
router.get('/products', checkAuth, productsPage);

//About Page
router.get('/about', checkAuth, aboutPage);

//Login Page
router.get('/login', checkNotAuth, loginPage);

//SignUp Page
router.get('/signup', checkNotAuth, signUpPage);

//FAQs Page
router.get('/faq', checkAuth, faqsPage);

//Add Products Page
router.get('/myproducts', checkAuth, checkRole, addProductsPage);

//To view product details
router.get('/productDetails/:productID', checkAuth, getProductDetails);

//To see profile
router.get('/profile', checkAuth, profilePage);

//To add and save product
router.post('/products', uploadImage, productValidation, validate, saveProduct);

//Forbidden Page
router.get('/forbidden', checkAuth, forbiddenPage);

//Initiate Reset Password Page
router.get('/forgot_password', checkNotAuth, initiateResetPasswordPage);

//Change Password Page
router.get('/change_password', checkAuth, changePasswordPage);

//Reset Password Page
router.get('/reset_password/:token', checkNotAuth, checkResetToken, resetPasswordPage);

//Invalid Reset Password Page
router.get('/invalid_token', checkNotAuth, invalidToken);

//Cart Page
router.get('/cart', checkAuth, cartPage);

//Checkout Page
router.get('/checkout', checkAuth, checkCart, checkoutPage);

//Order Details Page
router.get('/order_details/:order_id', checkAuth, orderDetailsPage);

module.exports = router;

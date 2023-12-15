const express = require('express');
const router = express.Router();
const { checkAuth, checkStrictAdmin } = require('../middlewares/authMiddleware');
const { productValidation, validate, uploadImage } = require('../middlewares/handleFormData');
const { usersPage,
    settingsPage,
    changeUserRole,
    changeUserStatus,
    editProductPage,
    editProduct,
    toggleProductStatus,
    allOrdersPage,
    changeOrderStatus
} = require('../controllers/adminController');

//To get settings page
router.get('/settings', checkAuth, checkStrictAdmin, settingsPage)

//Users Page for Admin
router.get('/users', checkAuth, checkStrictAdmin, usersPage);

//All Orders Page
router.get('/allOrders', checkAuth, checkStrictAdmin,allOrdersPage);

//To change user role
router.post('/update_role/:userId', checkAuth, checkStrictAdmin, changeUserRole);

//To change user role
router.post('/update_status/:userId', checkAuth, checkStrictAdmin, changeUserStatus);

//Edit Product Page
router.get('/edit_product/:productId', checkAuth, checkStrictAdmin, editProductPage);

//To edit product
router.post('/edit_product', checkAuth, checkStrictAdmin, uploadImage, productValidation, validate, editProduct);

//To toggle status of product
router.get('/toggle_status/:productId', checkAuth,checkStrictAdmin,toggleProductStatus);

//To change status of order
router.post('/update_order_status/:orderId',checkAuth,checkStrictAdmin,changeOrderStatus);

module.exports = router;

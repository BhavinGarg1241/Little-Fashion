const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/authMiddleware');
const {
    getAddressPage,
    addAddress,
    getSavedCards,
    getTrackOrderPage,
    editAddress,
    deleteAddress,
    getEditAddressPage
} = require('../controllers/profileController')
const {addressValidation} = require('../middlewares/handleAddressForm');
const { validate } = require('../middlewares/handleFormData');

//Addresses Page from Profile
router.get('/addresses',checkAuth,getAddressPage);

//Saved Cards Page from Profile
router.get('/saved_cards',checkAuth,getSavedCards);

//Order Tracking Page from Profile
router.get('/track_orders',checkAuth,getTrackOrderPage);

//To Delete Address from Profile
router.get('/delete_address/:id',checkAuth,deleteAddress);

//To Add Address from Profile Section
router.post('/add_address',checkAuth,addressValidation,validate,addAddress);

//To Get Edit Address Page to Edit Address from Profile
router.get('/edit_address/:id',checkAuth,getEditAddressPage);

//To Edit Address from Profile
router.post('/edit_address',checkAuth,addressValidation,validate,editAddress);

module.exports = router;
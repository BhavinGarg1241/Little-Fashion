const addresses = require('../models/addressesModel');
const orders = require('../models/ordersModel');
const customerProfiles = require('../models/customerProfilesModel')
const { getNavbarItems, getFooterData, getAddresses} = require('../controllers/getDataFromDB');
const { getCustomerProfile } = require('../controllers/customerProfile');

//To add address
const addAddress = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { fullname, hno, city, state, pincode, address_type, source } = req.body;

        await addresses.create({
            user_id: userId,
            name: fullname,
            hno: hno,
            city: city,
            state: state,
            pincode: pincode,
            type: address_type
        });
        if (source === 'checkout') {
            res.redirect('/checkout');
        } else if (source === 'profile') {
            res.redirect('/profile/addresses');
        }
    } catch (error) {
        console.log(error);
    }
}

//Addresses Page
const getAddressPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const address = await getAddresses(req, res);
        res.render('addresses', { navItems, footerData, address })
    } catch (error) {
        console.log(error);
    }
}

//Saved Cards Page
const getSavedCards = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const customerProfile = await customerProfiles.findOne({
            where: {
                user_id: userId
            }
        });
        let flag = true;
        if (!customerProfile) {
            flag = false;
            return res.render('savedCards', { message: req.flash('message'), navItems, footerData, flag })
        }
        const customerprofileData = await getCustomerProfile(customerProfile.customer_profile_id);
        res.render('savedCards', { message: req.flash('message'), navItems, footerData, customerprofileData, flag })
    } catch (error) {
        console.log(error);
    }
}

//Order Tracking Page
const getTrackOrderPage = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const trackOrders = await orders.findAll({
            where: {
                user_id: userId
            },
            order: [['order_date', 'ASC']]
        })
        res.render('trackOrders', { navItems, footerData, trackOrders });
    } catch (error) {
        console.log(error);
    }
}

//Edit Address Page
const getEditAddressPage = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const address_id = req.params.id;
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const address = await addresses.findOne({
            where: {
                id: address_id,
                user_id: userId
            }
        })
        res.render('editAddress', { navItems, footerData, address });
    } catch (error) {
        console.log(error);
    }
}

//To Edit Address From Profile/Adrresses Page
const editAddress = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { fullname, hno, city, state, pincode, address_type, address_id } = req.body;
        await addresses.update({
            user_id: userId,
            name: fullname,
            hno: hno,
            city: city,
            state: state,
            pincode: pincode,
            type: address_type
        }, {
            where: {
                id: address_id,
                user_id: userId,
            }
        });
        res.redirect('/profile/addresses');
    } catch (error) {
        console.log(error);
    }
}

//To Delete Address from Profile/Adrresses Page
const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await req.user;
        const userId = user.id;

        await addresses.destroy({
            where: {
                id: id,
                user_id: userId
            }
        })
        res.redirect('/profile/addresses');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addAddress,
    getAddressPage,
    getSavedCards,
    getTrackOrderPage,
    editAddress,
    deleteAddress,
    getEditAddressPage
}
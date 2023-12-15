const navbar = require('../models/navItemsModel');
const footerdata = require('../models/footerModel');
const faqdata = require('../models/faqModel');
const products = require('../models/productsModel');
const navRoles = require('../models/navrolesModel');
const cart = require('../models/cartModel');
const address = require('../models/addressesModel');

//To get data from navbar table
const getNavbarItems = async (req, res) => {
    try {
        const user = await req.user;
        const userRole = user.user_role.role;
        const navItems = await navRoles.findAll({
            where: {
                role_id: userRole
            },
            include: [
                {
                    model: navbar,
                    required: true
                }
            ]
        });
        const navItemsArray = navItems.map((item) => {
            const navItem = item.navitem;

            if (navItem) {
                return {
                    name: navItem.name,
                    url: navItem.url
                };
            }
            return null;
        });
        return navItemsArray; // Attach navItems to the req object
    } catch (error) {
        console.log(error)
    }
};

//To get data from footer table
const getFooterData = async (req, res) => {
    try {
        const footerData = await footerdata.findOne();
        return footerData // Attach footerData to the req object
    } catch (error) {
        console.log(error)
    }
};

//To get data fro faq table
const getFaqData = async (req, res) => {
    try {
        const faqData = await faqdata.findOne();
        return faqData // Attach faqData to the req object
    } catch (error) {
        console.log(error)
    }
}


//To get data from products table
const getProducts = async (req, res) => {
    try {
        const productsData = await products.findAll();
        return productsData; // Attach productsData to the req object
    } catch (error) {
        console.log(error)
    }
}

//To get data from cart table
const getCartData = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const cartProducts = await cart.findAll({
            where: { user_id: userId },
            include: [{
                model: products
            }]
        });
        return cartProducts;
    } catch (error) {
        console.log(error);
    }
}

//To get data rom addresses table
const getAddresses = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const addresses = await address.findAll({
            where: {
                user_id: userId,
            }
        })
        return addresses;
    } catch (error) {
        console.log(error);
    }
}

//To get default addresses table
const getDefaultAddresses = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const addresses = await address.findAll({
            where: {
                user_id: userId,
                default_address: true
            }
        })
        return addresses;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getNavbarItems, getFooterData, getFaqData, getProducts, getCartData, getAddresses, getDefaultAddresses };

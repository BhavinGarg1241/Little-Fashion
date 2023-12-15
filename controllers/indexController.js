const products = require('../models/productsModel');
const orderDetailsModel = require('../models/orderDetailsModel');
const { saveData } = require('../middlewares/handleFormData');
const { shuffleProducts, getRandomProducts, filterProductsByRole } = require('../Utils/productUtils');
const { getNavbarItems, getFaqData, getProducts, getFooterData, getCartData, getAddresses, getDefaultAddresses } = require('./getDataFromDB');
const userRoles = require('../models/roleModel');
const {getCustomerProfile} = require('../controllers/customerProfile');
const customerProfiles = require('../models/customerProfilesModel');

//Function to get total price in cart
const calculateTotalPrice = (cartData) => {
    let totalPrice = 0;
    for (let i = 0; i < cartData.length; i++) {
        const cartItem = cartData[i];
        totalPrice += cartItem.product.price * cartItem.quantity;
    }

    return totalPrice;
}

//Home Page
const homePage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const randomProducts = getRandomProducts(await getProducts());
        res.render('index', { navItems, randomProducts, footerData });
    } catch (error) {
        console.log(error);
    }
}

//Products Page
const productsPage = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const userRole = await userRoles.findOne({
            where: {
                user_id: userId
            }
        })
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const shuffledProducts = await shuffleProducts(await getProducts());
        const filteredProducts = await filterProductsByRole(shuffledProducts, userRole)
        res.render('products', { navItems, filteredProducts, userRole, footerData });
    } catch (error) {
        console.log(error)
    }
};

//About Page
const aboutPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('about', { navItems, footerData });
    } catch (error) {
        console.log(error)
    }
};

//Login Page
const loginPage = async (req, res) => {
    try {
        const footerData = await getFooterData();
        res.render('login', { footerData });
    } catch (error) {
        console.log(error)
    }
}

//SignUp Page

const signUpPage = async (req, res) => {
    try {
        const footerData = await getFooterData();
        res.render('signup', { message: req.flash('message'), footerData });
    } catch (error) {
        console.log(error)
    }
}

//FAQs Page
const faqsPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const faqData = await getFaqData();
        const footerData = await getFooterData();
        res.render('faq', { navItems, faqData, footerData });
    } catch (error) {
        console.log(error)
    }
}

//Add Products Page
const addProductsPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('myproducts', { navItems, footerData });
    } catch (error) {
        console.log(error)
    }
}

//To see profile
const profilePage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const user = await req.user;
        const userEmail = user.email;
        const userRole = user.user_role.role;
        res.render('profile', { navItems, email: userEmail, role: userRole, footerData })
    } catch (error) {
        console.log(error)
    }
}

//To view a product's details
const getProductDetails = async (req, res) => {
    try {
        const productID = req.params.productID;
        const mainProduct = await products.findByPk(productID);
        if (!mainProduct) {
            return res.redirect('/products');
        }
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const randomProducts = getRandomProducts(await getProducts());
        res.render('productDetails', { navItems, mainProduct, randomProducts, footerData });
    } catch (error) {
        console.log(error)
    }
}

//To add and save product
const saveProduct = async (req, res) => {
    saveData(req);
    res.redirect('/products');
}

//Forbidden Page
const forbiddenPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('forbidden', { navItems, footerData });
    } catch (error) {
        console.log(error);
    }
}

//Forgot Password Page
const forgotPasswordPage = async (req, res) => {
    try {
        const footerData = await getFooterData();
        res.render('forgotPassword', { footerData });
    } catch (error) {
        console.log(error);
    }
}

//Change Password Page
const changePasswordPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('changePassword', { navItems, footerData });
    } catch (error) {
        console.log(error);
    }
}

//Initial Forgot Password Page
const initiateResetPasswordPage = async (req, res) => {
    try {
        const footerData = await getFooterData();
        res.render('initiateResetPassword', { footerData });
    } catch (error) {
        console.log(error);
    }
}

//Reset Password Page
const resetPasswordPage = async (req, res) => {
    try {
        const token = req.params.token;
        const footerData = await getFooterData();
        res.render('resetPassword', { footerData, token });
    } catch (error) {
        console.log(error);
    }
}

const invalidToken = async (req, res) => {
    try {
        res.render('invalidResetToken');
    } catch (error) {
        console.log(error);
    }
}

//Cart Page
const cartPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const cartData = await getCartData(req, res);
        const footerData = await getFooterData();
        const totalPrice = calculateTotalPrice(cartData);
        res.render('cart', { navItems, cartData, totalPrice, footerData })
    } catch (error) {
        console.log(error);
    }
}

//Checkout Page
const checkoutPage = async (req, res) => {
    try {
        const user= await req.user;
        const userId = user.id;
        const cartData = await getCartData(req, res);
        const totalPrice = calculateTotalPrice(cartData);
        const addresses = await getAddresses(req, res);
        const defaultAddress = await getDefaultAddresses(req, res);

        const customerProfile = await customerProfiles.findOne({
            where: {
                user_id: userId
            }
        });
        let flag = true;
        if (!customerProfile) {
            flag = false;
            return res.render('checkout', { message: req.flash('message'),totalPrice, addresses, defaultAddress, flag })
        }
        const customerprofileData = await getCustomerProfile(customerProfile.customer_profile_id);
        res.render('checkout', { message: req.flash('message'),totalPrice, addresses, defaultAddress,flag, customerprofileData});
    } catch (error) {
        console.log(error);
    }
}

//Order Details Page
const orderDetailsPage = async (req, res) => {
    try {
        const user = await req.user;
        const userRole = user.user_role.role;
        const id = req.params.order_id;
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const orderDetails = await orderDetailsModel.findAll({
            where: {
                order_id: id
            },
            include: [
                {
                    model: products
                }
            ]
        })
        let totalPrice = 0;
        for (const orderDetail of orderDetails) {
            const product = orderDetail.product;
            const quantity = orderDetail.quantity;
            totalPrice += product.price * quantity;
        }
        res.render('orderDetails', { navItems, footerData, userRole, orderDetails, totalPrice })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    homePage,
    aboutPage,
    loginPage,
    signUpPage,
    faqsPage,
    addProductsPage,
    productsPage,
    profilePage,
    getProductDetails,
    saveProduct,
    forbiddenPage,
    forgotPasswordPage,
    changePasswordPage,
    initiateResetPasswordPage,
    resetPasswordPage,
    invalidToken,
    cartPage,
    checkoutPage,
    calculateTotalPrice,
    orderDetailsPage
};
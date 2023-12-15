const passport = require('passport');
const resetTokens = require('../models/resetTokenModel')
const cart = require('../models/cartModel');
const orders = require('../models/ordersModel');

//To authenticate while logging in
const authenticate = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}

//To check if user is alredy logged in
const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

//To check if user is not logged in
const checkNotAuth = (req, res, next) => {
    {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}

//To check if logged in user is admin only
const checkStrictAdmin = async (req, res, next) => {
    try {
        const user = await req.user;
        const userRole = await user.user_role.role;
        if (userRole === 1) {
            return next()
        }
        res.redirect('/forbidden');
    } catch (error) {
        console.log(error);
    }
}

//To check if logged in user is admin or employee and not any other role based user
const checkRole = async (req, res, next) => {
    try {
        const user = await req.user;
        const userRole = await user.user_role.role;
        if (userRole === 1 || userRole === 2) {
            return next()
        }
        res.redirect('/forbidden');
    } catch (error) {
        console.log(error);
    }
}

//To check that while reseting password token used exists or not
const checkResetToken = async (req, res, next) => {
    try {
        const token = req.params.token;
        const user = await resetTokens.findOne({ where: { token: token } });
        if (!user || user.expire_by < Date.now()) {
            if (user.expire_by < Date.now()) {
                await resetTokens.destroy({
                    where: { token: token }
                })
            }
            return res.redirect('/invalid_token');
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.redirect('/login');
    }
}

//To check cart is not empty
const checkCart = async (req, res, next) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const cartData = await cart.findAll({
            where: {
                user_id: userId
            }
        })
        if (cartData.length <= 0) {
            res.redirect('/cart')
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

//Check order status to cancel order
const checkOrderStatus = async (req, res, next) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const transactionId = req.params.id;
        const order = await orders.findOne({
            where: {
                user_id: userId,
                transaction_id: transactionId
            }
        })
        if (order.status === 'Pending' || order.status === 'Accepted') {
            return next();
        }
        res.redirect('/forbidden')
    } catch (error) {
        console.log(error);
    }
}

module.exports = { authenticate, checkAuth, checkNotAuth, checkStrictAdmin, checkRole, checkCart, checkResetToken, checkOrderStatus };
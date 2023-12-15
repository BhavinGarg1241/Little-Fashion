const uuid = require('uuid');
const { calculateTotalPrice } = require('./indexController')
const addresses = require('../models/addressesModel');
const products = require('../models/productsModel'); const cart = require('../models/cartModel');
const orders = require('../models/ordersModel');
const orderDetails = require('../models/orderDetailsModel');
const { getTransactionDetails, voidTransaction, refundPayment } = require('../controllers/paymentController');

//To change default billing address
const changeDefaultBillAddress = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { bill_address } = req.body;
        await addresses.update({
            default_address: false
        }, {
            where: {
                user_id: userId,
                type: 'B'
            }
        })
        await addresses.update({
            default_address: true
        }, {
            where: {
                id: bill_address,
                user_id: userId
            }
        })
        res.redirect('/checkout');
    } catch (error) {
        console.log(error);
    }
}

//To change default billing address
const changeDefaultShipAddress = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const { ship_address } = req.body;
        await addresses.update({
            default_address: false
        }, {
            where: {
                user_id: userId,
                type: 'S'
            }
        })
        await addresses.update({
            default_address: true
        }, {
            where: {
                id: ship_address,
                user_id: userId
            }
        })
        res.redirect('/checkout');
    } catch (error) {
        console.log(error);
    }
}

//To place Order
const placeOrder = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const transactionId = req.params.id;
        const cartData = await cart.findAll({
            where: {
                user_id: userId,
            },
            include: [{
                model: products
            }]
        })
        const address = await addresses.findAll({
            where: {
                user_id: userId,
                default_address: true,
            }
        })
        //Store Id's of billin abd shipping address seperately after filtering it on basis of type 
        let billing_address_id;
        let shipping_address_id;
        address.forEach((data) => {
            if (data.type === 'B') {
                billing_address_id = data.id
            } else if (data.type === 'S') {
                shipping_address_id = data.id
            }
        })
        const totalPrice = calculateTotalPrice(cartData); //Calculate total price of cart
        const newOrder = await orders.create({
            id: uuid.v4(),
            user_id: userId,
            transaction_id: transactionId,
            order_date: new Date(),
            total_price: totalPrice,
            billing_address_id: billing_address_id,
            shipping_address_id: shipping_address_id,
        })
        for (const cartItem of cartData) {
            await orderDetails.create({
                order_id: newOrder.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity
            })
            await cartItem.destroy();
        }
        res.redirect(`/checkout/order_confirmed/${transactionId}`);
    } catch (error) {
        console.log(error);
    }
}

//Order Confirmtion Page
const orderConfirmed = (req, res) => {
    try {
        const transactionId = req.params.id;
        res.render('orderConfirmed', { transactionId });
    } catch (error) {
        console.log(error);
    }
}

//Cancel Order
const cancelOrder = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        const userEmail = user.email;
        const transactionId = req.params.id;

        const order = await orders.findOne({
            where: {
                user_id: userId,
                transaction_id: transactionId
            }
        })
        const transactionDetails = await getTransactionDetails(transactionId);
        const transactionStatus = transactionDetails.transaction.transactionStatus;
        const creditCard = transactionDetails.transaction.payment.creditCard;
        if (transactionStatus === 'authorizedPendingCapture' || transactionStatus === 'capturedPendingSettlement') {
            voidTransaction(req, res, userId, userEmail, transactionId);
        }
        else if (transactionStatus === 'settledSuccessfully') {
            refundPayment(req, res, userId, userEmail, transactionId, creditCard);
        } else {
            req.flash('error', 'Your Order cannot be Cancelled!')
            res.redirect('/profile/track_orders');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    changeDefaultBillAddress,
    changeDefaultShipAddress,
    placeOrder,
    orderConfirmed,
    cancelOrder
}
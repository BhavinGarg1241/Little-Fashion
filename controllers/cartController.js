const products = require('../models/productsModel');
const cart = require('../models/cartModel');

//Add product to cart
const addProductToCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = req.body.quantity;
        const user = await req.user;
        const userId = user.id;
        const price = await products.findOne({ where: { id: productId } }).then(price => price.price);
        const cartItem = await cart.findOne({
            where: { user_id: userId, product_id: productId }
        })
        if (!cartItem) {
            await cart.create({
                user_id: userId,
                product_id: productId,
                quantity: parseInt(quantity),
                price: price
            })
        } else {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        }
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
}

//To increase quantity of product in cart
const increaseQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await req.user;
        const userId = user.id;
        const cartItem = await cart.findOne({
            where: { user_id: userId, product_id: productId }
        })
        cartItem.quantity += 1;
        await cartItem.save();
        res.redirect('/cart');
    } catch (error) {
        console.log(object);
    }
}

//To decrease quantity of product in cart
const decreaseQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await req.user;
        const userId = user.id;
        const cartItem = await cart.findOne({
            where: { user_id: userId, product_id: productId }
        })
        cartItem.quantity -= 1;
        await cartItem.save();
        if (await cartItem.quantity <= 0) {
            await cart.destroy({
                where: {
                    user_id: userId,
                    product_id: productId
                }
            })
        }
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
}

//To remove product from cart
const removeProductFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await req.user;
        const userId = user.id;

        await cart.destroy({
            where: {
                user_id: userId,
                product_id: productId
            }
        })
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
}


//To empty cart
const emptyCart = async (req, res) => {
    try {
        const user = await req.user;
        const userId = user.id;
        await cart.destroy({
            where: {
                user_id: userId,
            }
        })
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

module.exports = { addProductToCart, increaseQuantity, decreaseQuantity, removeProductFromCart, emptyCart }

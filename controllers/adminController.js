const Users = require('../models/userModel');
const userRoles = require('../models/roleModel');
const products = require('../models/productsModel');
const orders = require('../models/ordersModel');
const { getNavbarItems, getFooterData } = require('./getDataFromDB');
const { Sequelize } = require('sequelize');

//Users Page for Admin
const usersPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const users = await Users.findAll({
            include: [
                {
                    model: userRoles,
                    where: {
                        role: {
                            [Sequelize.Op.not]: 1
                        }
                    }
                }
            ]
        })
        res.render('users', { navItems, footerData, users });
    } catch (error) {
        console.log(error);
    }
}

//Settings Page
const settingsPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('settings', { navItems, footerData });
    } catch (error) {
        console.log(error);
    }
}

//To change user role
const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { newRole } = req.body;
        await userRoles.update({
            role: newRole
        }, {
            where: {
                user_id: userId
            }
        })
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error);
    }
}

//To change user statsu
const changeUserStatus = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { newStatus } = req.body;
        await Users.update({
            status: newStatus
        }, {
            where: {
                id: userId
            }
        })
        res.redirect('/admin/users')
    } catch (error) {
        console.log(error);
    }
}

//To get edit product page
const editProductPage = async (req, res) => {
    try {
        const id = req.params.productId;
        const product = await products.findOne({
            where: {
                id: id
            }
        })
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        res.render('editProduct', { navItems, product, footerData });
    } catch (error) {
        console.log(error);
    }
}

//To edit product details
const editProduct = async (req, res) => {
    try {
        const { name, price, des, product_id } = req.body;
        if (req.file) {
            const img = `images/product/${req.file.filename}`
            await products.update({
                name,
                price,
                des,
                img
            }, {
                where: {
                    id: product_id
                }
            })
        } else {
            await products.update({
                name,
                price,
                des,
            }, {
                where: {
                    id: product_id
                }
            })
        }
        res.redirect('/products')
    } catch (error) {
        console.log(error);
    }
}

//To toggle product status
const toggleProductStatus = async (req, res) => {
    try {
        const id = req.params.productId;
        const product = await products.findOne({
            where: {
                id: id
            }
        })
        if (product.status === true) {
            await products.update({
                status: false
            }, {
                where: {
                    id: id
                }
            })
        } else if (product.status === false) {
            await products.update({
                status: true
            }, {
                where: {
                    id: id
                }
            })
        }
        res.redirect('/products')
    } catch (error) {
        console.log(error);
    }
}

//All Orders Page
const allOrdersPage = async (req, res) => {
    try {
        const navItems = await getNavbarItems(req, res);
        const footerData = await getFooterData();
        const allOrders = await orders.findAll({
            include: [{ model: Users }]
        });
        res.render('allOrders', { navItems, footerData, allOrders });
    } catch (error) {
        console.log(error);
    }
}

//To change order status
const changeOrderStatus = async (req, res) => {
    try {
        const id = req.params.orderId;
        const { newStatus } = req.body;
        await orders.update({
            status: newStatus
        }, {
            where: {
                id: id
            }
        })
        res.redirect('/admin/allOrders');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    usersPage,
    settingsPage,
    changeUserRole,
    changeUserStatus,
    editProductPage,
    editProduct,
    toggleProductStatus,
    allOrdersPage,
    changeOrderStatus
};
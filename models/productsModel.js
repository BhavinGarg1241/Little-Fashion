const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const cart = require('./cartModel');
const orderDetails = require('./orderDetailsModel');

const products = sequelize.define('products', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    des:{
        type: DataTypes.STRING,
        allowNull: false
    },
    img:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        dafaultValue: true
    }
}, {
    timestamps: false, // Add this option to disable createdAt and updatedAt columns
});

cart.belongsTo(products,{foreignKey: 'product_id'});
orderDetails.belongsTo(products,{foreignKey: 'product_id'});

module.exports = products;
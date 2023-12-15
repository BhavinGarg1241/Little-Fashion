const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const orderDetails = require('./orderDetailsModel');

const orders = sequelize.define('orders', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    billing_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    transaction_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending'
    }
}, {
    timestamps: false
})

orderDetails.belongsTo(orders, { foreignKey: 'order_id' })

module.exports = orders;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const cartModel = sequelize.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = cartModel;
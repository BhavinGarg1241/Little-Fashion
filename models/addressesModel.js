const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const orders = require('./ordersModel');

const addresses = sequelize.define('addresses', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id:{
        type: DataTypes.STRING,
        allowedNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowedNull: false
    },
    hno:{
        type: DataTypes.STRING,
        allowedNull: false
    },
    city:{
        type: DataTypes.STRING,
        allowedNull: false
    },
    state:{
        type: DataTypes.STRING,
        allowedNull: false
    },
    pincode:{
        type: DataTypes.INTEGER,
        allowedNull: false
    },
    type:{
        type: DataTypes.CHAR(1),
        allowedNull: false
    },
    default_address:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowedNull: false
    }
}, {
    timestamps: false
})

orders.belongsTo(addresses,{foreignKey:'billing_address_id'});
orders.belongsTo(addresses,{foreignKey:'shipping_address_id'});

module.exports = addresses
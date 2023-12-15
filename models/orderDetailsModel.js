const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orderDetails = sequelize.define('order_details',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    order_id:{
        type:DataTypes.STRING,
        allowNull: false
    },
    product_id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps:false
})

module.exports = orderDetails;
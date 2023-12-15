const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const customerProfile = sequelize.define('customer_profiles',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    user_id:{
        type:DataTypes.STRING,
        allowNull: false
    },
    customer_profile_id:{
        type:DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
})

module.exports = customerProfile;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const userRole = require('./roleModel');
const resetTokens = require('./resetTokenModel');
const cartModel = require('./cartModel');
const addresses = require('./addressesModel');
const orders = require('./ordersModel');
const customerProfile = require('./customerProfilesModel');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowedNull: false
    }
}, {
    timestamps: false
})
User.hasOne(userRole, { foreignKey: 'user_id' });
User.hasOne(resetTokens, { foreignKey: 'user_id' });
cartModel.belongsTo(User, { foreignKey: 'user_id' });
addresses.belongsTo(User, { foreignKey: 'user_id' });
orders.belongsTo(User, { foreignKey: 'user_id' });
customerProfile.belongsTo(User, { foreignKey: 'user_id'});

module.exports = User;
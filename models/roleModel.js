const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const navBar = require("./navItemsModel");
const navRoles = require('./navrolesModel');


const roles = sequelize.define('user_roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
})

navRoles.belongsTo(roles, { foreignKey: 'role_id' });

module.exports = roles;


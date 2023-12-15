const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const navbar = require('./navItemsModel');
const roles = require('./roleModel');

const navRoles = sequelize.define('nav_roles', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    navitem_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: false, // Add this option to disable createdAt and updatedAt columns
})

module.exports = navRoles;
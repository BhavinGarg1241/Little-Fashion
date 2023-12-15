const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const roles = require('./roleModel')
const navRoles = require('./navrolesModel');

const navbar = sequelize.define('navitems', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false, // Add this option to disable createdAt and updatedAt columns
});

navRoles.belongsTo(navbar, { foreignKey: 'navitem_id' });

module.exports = navbar;
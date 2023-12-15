const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const footerData = sequelize.define('footer_data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    designed_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    site_map:{
        type: DataTypes.JSON,
        allowNull: false
    },
    social_icons:{
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: false, // Add this option to disable createdAt and updatedAt columns
});
module.exports = footerData;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const faqData = sequelize.define('faqdata', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    generalInfo:{
        type: DataTypes.JSON,
        allowNull: false
    },
    aboutProducts:{
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: false, // Add this option to disable createdAt and updatedAt columns
});
module.exports = faqData;
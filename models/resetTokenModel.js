const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const resetToken = sequelize.define('reset_tokens', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expire_by:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = resetToken;
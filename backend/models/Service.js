const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0, // Le prix doit être positif
        }
    }
});

module.exports = Service;

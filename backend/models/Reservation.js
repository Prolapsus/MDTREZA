const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Service = require('./Service');

const Reservation = sequelize.define('Reservation', {
    dateReservation: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isAfter: String(new Date(Date.now() - 86400000)) // Permet la date d'aujourd'hui ou dans le futur
        }
    },
    status: {
        type: DataTypes.ENUM('confirmée', 'annulée'),
        defaultValue: 'confirmée'
    }
});

// Définir les relations entre les modèles
Reservation.belongsTo(User, { foreignKey: 'userId' });
Reservation.belongsTo(Service, { foreignKey: 'serviceId' });

module.exports = Reservation;

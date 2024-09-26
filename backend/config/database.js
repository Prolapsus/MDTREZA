const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4', // Utilisation de utf8mb4 pour éviter les erreurs d'encodage
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    },
    logging: false,
});

sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données réussie.'))
    .catch(err => console.error('Erreur de connexion :', err));

module.exports = sequelize;

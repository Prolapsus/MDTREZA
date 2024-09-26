const app = require('./app'); // Remplacement de l'initialisation par un import de app.js
const sequelize = require('./config/database');

// Synchronisation de la base de données
sequelize.sync()
    .then(() => console.log('Base de données synchronisée.'))
    .catch(err => console.error('Erreur de synchronisation :', err));

// Lancement du serveur uniquement si nous ne sommes pas en mode test
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}.`);
    });
}

module.exports = app; // Exportation de app pour Supertest

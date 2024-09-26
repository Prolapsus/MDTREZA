const sequelize = require('../config/database');

// Avant chaque test, nous synchronisons la base de données
beforeAll(async () => {
    await sequelize.sync(); // Synchronisation des modèles avec la base de données
});

// Après tous les tests, nous fermons la connexion à la base de données
afterAll(async () => {
    await sequelize.close(); // Fermeture de la connexion
});

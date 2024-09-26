const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger'); // Winston logger

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            logger.info(`Token vérifié pour l'utilisateur ${decoded.id} avec rôle ${decoded.role}`);

            req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

            if (!req.user) {
                logger.warn('Utilisateur non trouvé avec cet ID');
                return res.status(401).json({ message: 'Non autorisé, utilisateur non trouvé' });
            }

            req.user.role = decoded.role; // Assigner le rôle décodé au user
            next();
        } catch (error) {
            logger.error(`Erreur de vérification du token JWT : ${error.message}`);
            return res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        logger.warn('Aucun token trouvé dans la requête');
        return res.status(401).json({ message: 'Non autorisé, aucun token trouvé' });
    }
};

// Middleware pour les routes réservées aux administrateurs
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        logger.warn(`Accès refusé pour l'utilisateur ${req.user.id}, rôle insuffisant`);
        return res.status(403).json({ message: 'Accès refusé' });
    }
};

module.exports = { protect, admin };

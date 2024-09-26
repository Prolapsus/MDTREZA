const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Erreur : ${err.message}`);
    res.status(500).json({
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
};

module.exports = errorHandler;

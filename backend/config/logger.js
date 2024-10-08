const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configuration de Winston
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs des erreurs
        new transports.File({ filename: 'logs/combined.log' }) // Tous les logs
    ]
});

// Si en développement, log également dans la console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = logger;

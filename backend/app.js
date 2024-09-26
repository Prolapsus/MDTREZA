const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const rateLimit = require('express-rate-limit');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.set('trust proxy', 1);

// Middleware de limitation de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Trop de requêtes envoyées depuis cette IP, veuillez réessayer plus tard.',
});
app.use(limiter);

// Configuration de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MDTREZA API',
            version: '1.0.0',
            description: 'API pour la gestion des services et réservations dans MDTREZA',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin/users', adminUserRoutes);

module.exports = app;

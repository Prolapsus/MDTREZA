const express = require('express');
const { registerUser, loginUser, getUserProfile, refreshToken } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const logger = require('../config/logger'); // Importation de Winston pour les logs

const router = express.Router();

// Route pour l'inscription (validation via Joi se fait dans userController.js)
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *                 example: John
 *               nom:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/register', (req, res, next) => {
    logger.info('Tentative de création d\'un nouvel utilisateur');
    registerUser(req, res, next);
});

// Route pour la connexion (validation via Joi se fait dans userController.js)
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Échec de la connexion, informations incorrectes
 */
router.post('/login', (req, res, next) => {
    logger.info(`Tentative de connexion pour l'utilisateur : ${req.body.email}`);
    loginUser(req, res, next);
});

// Route pour obtenir le profil de l'utilisateur connecté
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré
 *       401:
 *         description: Utilisateur non autorisé
 */
router.get('/profile', protect, (req, res, next) => {
    logger.info(`Récupération du profil pour l'utilisateur ${req.user.id}`);
    getUserProfile(req, res, next);
});

// Route pour rafraîchir le token
router.post('/refresh-token', refreshToken);

module.exports = router;

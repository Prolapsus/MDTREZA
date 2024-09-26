const express = require('express');
const { getAllServices, getServiceById, addService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, admin } = require('../middlewares/authMiddleware');
const logger = require('../config/logger'); // Importation de Winston pour les logs

const router = express.Router();

// Route pour récupérer tous les services (accessible à tous)
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Récupérer tous les services disponibles
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste de tous les services
 *       500:
 *         description: Erreur serveur
 */
router.get('/', (req, res, next) => {
    logger.info('Récupération de tous les services');
    getAllServices(req, res, next);
});

// Route pour récupérer un service par son ID (accessible à tous)
/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Récupérer un service par son ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Détails du service
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', (req, res, next) => {
    logger.info(`Récupération du service avec l'ID : ${req.params.id}`);
    getServiceById(req, res, next);
});

// Routes pour ajouter, modifier et supprimer un service (réservé aux admins)
/**
 * @swagger
 * /api/services/add:
 *   post:
 *     summary: Ajouter un nouveau service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Massage relaxant
 *               description:
 *                 type: string
 *                 example: Un massage pour détendre les muscles.
 *               prix:
 *                 type: number
 *                 example: 80
 *     responses:
 *       201:
 *         description: Service créé avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/add', protect, admin, (req, res, next) => {
    logger.info(`Tentative d'ajout d'un nouveau service par l'admin ${req.user.id}`);
    addService(req, res, next);
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Modifier un service existant
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Massage relaxant
 *               description:
 *                 type: string
 *                 example: Un massage pour détendre les muscles.
 *               prix:
 *                 type: number
 *                 example: 80
 *     responses:
 *       200:
 *         description: Service modifié avec succès
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', protect, admin, (req, res, next) => {
    logger.info(`Tentative de modification du service ${req.params.id} par l'admin ${req.user.id}`);
    updateService(req, res, next);
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Supprimer un service existant
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du service
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', protect, admin, (req, res, next) => {
    logger.info(`Suppression du service ${req.params.id} par l'admin ${req.user.id}`);
    deleteService(req, res, next);
});

module.exports = router;

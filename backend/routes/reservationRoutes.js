const express = require('express');
const { createReservation, getUserReservations, cancelReservation, deleteReservation, getAllReservations } = require('../controllers/reservationController');
const { protect, admin } = require('../middlewares/authMiddleware');
const logger = require('../config/logger'); // Importation de Winston pour les logs

const router = express.Router();

// Route pour créer une réservation (client)
/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: integer
 *                 example: 1
 *               dateReservation:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-30"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/', protect, (req, res, next) => {
    logger.info(`Tentative de création de réservation par l'utilisateur ${req.user.id}`); // Log avant la création
    createReservation(req, res, next);
});

// Route pour voir toutes ses réservations (client)
/**
 * @swagger
 * /api/reservations/myreservations:
 *   get:
 *     summary: Voir toutes mes réservations
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations de l'utilisateur
 *       500:
 *         description: Erreur serveur
 */
router.get('/myreservations', protect, (req, res, next) => {
    logger.info(`Récupération des réservations pour l'utilisateur ${req.user.id}`); // Log de récupération des réservations
    getUserReservations(req, res, next);
});

// Route pour annuler une réservation (client)
/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   put:
 *     summary: Annuler une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
 *       400:
 *         description: Impossible d'annuler une réservation passée
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id/cancel', protect, (req, res, next) => {
    logger.info(`Tentative d'annulation de la réservation ${req.params.id} par l'utilisateur ${req.user.id}`);
    cancelReservation(req, res, next);
});

// Route pour voir toutes les réservations (admin)
/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Voir toutes les réservations (admin)
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de toutes les réservations
 *       500:
 *         description: Erreur serveur
 */
router.get('/', protect, admin, (req, res, next) => {
    logger.info('Récupération de toutes les réservations par un admin'); // Log pour les admins
    getAllReservations(req, res, next);
});

// Route pour supprimer une réservation (admin)
/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', protect, admin, (req, res, next) => {
    logger.info(`Suppression de la réservation ${req.params.id} par un admin`);
    deleteReservation(req, res, next);
});

module.exports = router;

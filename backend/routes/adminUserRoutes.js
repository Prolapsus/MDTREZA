const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/adminUserController');
const { protect, admin } = require('../middlewares/authMiddleware');
const logger = require('../config/logger'); // Importation de Winston pour les logs

const router = express.Router();

// Route pour obtenir tous les utilisateurs (admin uniquement)
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtenir la liste de tous les utilisateurs (admin)
 *     tags: [Utilisateurs (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les utilisateurs
 *       500:
 *         description: Erreur serveur
 */
router.get('/', protect, admin, (req, res, next) => {
    logger.info(`Récupération de la liste de tous les utilisateurs par l'admin ${req.user.id}`);
    getAllUsers(req, res, next);
});

// Route pour supprimer un utilisateur (admin uniquement)
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin)
 *     tags: [Utilisateurs (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', protect, admin, (req, res, next) => {
    logger.info(`Suppression de l'utilisateur ${req.params.id} par l'admin ${req.user.id}`);
    deleteUser(req, res, next);
});

module.exports = router;
